class Building {
    constructor(name, desc, price, valuePerSec, reward, visible = true) {
        this.name = name.replace(/ /g, "_");
        this.displayName = name;
        this.desc = desc;
        this.visible = visible;
        this.price = price;
        this.index = -1;
        this.enabled = true;

        //if (!Array.isArray(price)) {
        //    this.price = [price];
        //}
        this.reward = reward;
        if (reward.rewardPerSecondString === undefined) {
            //TODO add description
            reward.rewardPerSecondString = (owned) => {
                const tmpRef = {};
                tmpRef[this.reward.type] = 0;

                this.reward.func(owned, this.valuePerSec.perSec, this.reward, tmpRef);

                return numbers.fix(tmpRef[this.reward.type], 2) + " " + this.price.type.toLowerCase() + "/sec";
            }
        }
        this.valuePerSec = valuePerSec;
    }

    buildPrice = () => {
        return this.price.amount * Math.pow(this.price.inflation, g.b.owned[this.index]);
    };

    buyable = () => {
        const cost = g.b.list[this.index].buildPrice(this.index);
        return g.resources.owned[g.b.list[this.index].price.type] >= cost;
    };

    buy = () => {
        g.resources.owned[this.price.type] -= this.buildPrice(this.index);
        this.costString = numbers.fix(this.buildPrice(), 0) + " " + this.price.type.toLowerCase();
    };

    genHTML = (index) => {
        const main = document.createElement("div");
        main.setAttribute('id', 'builds-row-' + index);
        main.setAttribute('class', 'row bottom-spacer');

        const infoBox = document.createElement("div");
        infoBox.setAttribute('class', 'col-md-8');

        const paragraph = document.createElement("p");
        paragraph.id = "builds-infos-" + index;
        paragraph.setAttribute('class', 'no-margin');

        const line1 = this.displayName + " : " + this.valuePerSec.type + " " + this.valuePerSec.perSec + "/sec";
        const line2 = numbers.fix(g.b.owned[index], 0) + " owned : " + this.reward.rewardPerSecondString(g.b.owned[index], paragraph);
        const line3 = "Cost " + this.costString;
        paragraph.innerHTML = line1 + "<br>" + line2 + "<br>" + line3;
        infoBox.append(paragraph);

        const buyButton = document.createElement("div");
        buyButton.setAttribute('class', 'col-md-4');

        const inputGroup = document.createElement("div");
        inputGroup.className = 'input-group mb-3';

        const inputPrepend = document.createElement("div");
        inputPrepend.className = 'input-group-prepend';
        inputGroup.append(inputPrepend);

        const inputBackground = document.createElement("div");
        inputBackground.className = 'btn building-checkbox input-group-text';
        inputPrepend.append(inputBackground);

        const inputCheckbox = document.createElement("input");
        inputCheckbox.className = 'btn-primary';
        inputCheckbox.setAttribute('aria-label', 'Checkbox for following text input');
        inputCheckbox.type = 'checkbox';
        inputCheckbox.checked = true;
        inputCheckbox.onclick = () => {
            this.enabled = !this.enabled;
        };
        inputBackground.append(inputCheckbox);

        const buyLink = document.createElement('a');
        buyLink.id = 'builds-btn-' + this.name;
        buyLink.className='btn btn-primary btn-block form-control';
        buyLink.setAttribute('type', 'button');
        buyLink.onclick = () => {
            g.b.buy(index, this);
        };
        buyLink.innerHTML = 'Buy build';
        this.buttons = [buyLink];

        inputGroup.append(buyLink);
        buyButton.append(inputGroup);
        // buyButton.append(buyLink);
        main.append(infoBox);
        main.append(buyButton);
        
        return main;
    };
}

g.builds = g.b = {};
g.b.owned = [];
g.b.multiplier = [];

game.builds.init = () => {
    const panel = document.getElementById('builds-panelbody');
    g.b.list.forEach((b, i) => {
        g.b.owned.push(0);
        g.b.multiplier.push(1);
        b.index = i;
        panel.append(b.genHTML(i));
    });
};
game.builds.checkBuyStatus = () => {
    g.b.list.forEach((obj) => {
        obj.buttons.forEach((button) => {
            if (obj.buyable()) {
                button.removeAttribute('disabled');
                button.classList.remove('disabled');
            } else {
                button.setAttribute('disabled', 'disabled');
                button.classList.add('disabled');
            }
        });
    });
};
game.builds.buy = (index) => {
    if (g.b.list[index].buyable()) {
        g.b.list[index].buy();
        g.b.owned[index]++;
        g.b.update();
    }
};
game.builds.earn = (times) => {
    const delta = times / g.options.fps;
    for (let i = 0; i < g.b.list.length; i++) {
        if (g.b.owned[i] > 0 && g.b.list[i].enabled) {
            const reward = g.b.list[i].reward;
            g.b.list[i].reward.func(g.b.list[i].valuePerSec.perSec * g.b.owned[i] * g.b.multiplier[i],
                delta,
                reward,
                game.resources.owned
            );
        }
    }
};
game.builds.checkSave = () => {
    if (g.b.owned.length !== g.b.list.length) {
        const a = (g.b.list.length - g.b.owned.length);
        for (let i = 0; i < a; i++)
            g.b.owned.push(0);
    }
};
game.builds.update = () => {
    g.b.list.forEach((obj, i) => {
        const row = document.getElementById("builds-row-" + i);
        if (obj.visible) {
            row.style.display = 'flex';
        } else {
            row.style.display = 'none';
        }

        const constElement= document.getElementById("builds-infos-" + i);
        const line1 = obj.name + " : " + numbers.fix(obj.valuePerSec.perSec, 2) + " " + obj.valuePerSec.type.toLowerCase() + "/sec";
        const line2 = numbers.fix(g.b.owned[i], 0) + " owned : " + obj.reward.rewardPerSecondString(g.b.owned[i], constElement);
        const line3 = "Cost " + numbers.fix(obj.buildPrice(), 0) + " " + obj.price.type.toLowerCase();

        constElement.innerHTML = line1 + "<br>" + line2 + "<br>" + line3 + "<br>";
    });
};

game.builds.save = () => {
    return {
        owned: g.b.owned,
        multiplier: g.b.multiplier,
        data: g.b.list.map((obj) => {
            return {visible: obj.visible, perSec: obj.valuePerSec.perSec}
        })
    };
};
game.builds.load = (saveObj) => {
    g.b.owned = saveObj.owned;
    g.b.multiplier = saveObj.multiplier;
    g.b.list.forEach((obj, i) => {
        obj.visible = saveObj.data[i].visible;
        obj.valuePerSec.perSec = saveObj.data[i].perSec;
    });
};