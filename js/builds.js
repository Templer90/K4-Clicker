class Building{
    constructor(name, desc, price, valuePerSec, reward, visible = true) {
        this.name = name.replace(/ /g, "_");
        this.displayName = name;
        this.desc = desc;
        this.visible = visible;
        this._orginalPrices = price;
        this.price = price;
        this.index = -1;
        
        //if (!Array.isArray(price)) {
        //    this.price = [price];
        //}
        this.reward = reward;
        if (reward.rewardPerSecondString === undefined) {
            //TODO add description
            reward.rewardPerSecondString = (owned) => {
                const tmpRef = {};
                tmpRef[this.reward.type] = 0;

                this.reward.func(owned, 1, this.reward, tmpRef);

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
        return g.ressources.owned[g.b.list[this.index].price.type] >= cost;
    };

    buy = () => {
        let type = this.price.type;
        g.ressources.owned[type] -= this.buildPrice(this.index);
        this.costString = numbers.fix(this.buildPrice(), 0) + " " + this.price.type.toLowerCase();
    };

    checkResources() {
        for (let i = 0; i < this.price.length; i++) {
            if (g.ressources.owned[this.price[i].type] < this.price[i].amount) {
                return false;
            }
        }
        return true;
    }
}

g.builds = g.b = {};
g.b.owned = [];
g.b.multiplier = [];

game.builds.init = () => {
    let panel = document.getElementById('builds-panelbody');
    g.b.list.forEach((obj, i) => {
        g.b.owned.push(0);
        g.b.multiplier.push(1);
        obj.index=i;

        let main = document.createElement("div");
        main.setAttribute('id', 'builds-row-' + i);
        main.setAttribute('class', 'row bottom-spacer');

        let infoBox = document.createElement("div");
        infoBox.setAttribute('class', 'col-md-8');

        let paragraph = document.createElement("p");
        paragraph.id = "builds-infos-" + i;
        paragraph.setAttribute('class', 'no-margin');

        let line1 = obj.displayName + " : " + obj.valuePerSec.type + " " + obj.valuePerSec.perSec + "/sec";
        let line2 = g.b.owned[i] + " owned : " + h.buildReward(i) + " " + obj.price.type.toLowerCase() + "/sec";
        let line3 = "Cost " + obj.costString;
        paragraph.innerHTML = line1 + "<br>" + line2 + "<br>" + line3;
        infoBox.append(paragraph);

        let buyButton = document.createElement("div");
        buyButton.setAttribute('class', 'col-md-4');

        let buyLink = document.createElement("a");
        buyLink.id = 'builds-btn-' + obj.name;
        buyLink.setAttribute('class', 'btn btn-primary btn-block');
        buyLink.setAttribute('type', 'button');
        buyLink.onclick = () => {
            g.b.buy(i, obj);
        };
        buyLink.innerHTML = 'Buy build';
        obj.buylink = buyLink;

        buyButton.append(buyLink);
        main.append(infoBox);
        main.append(buyButton);
        panel.append(main);
    });
};
game.builds.checkBuyStatus = function () {
    for (let i = 0; i < g.b.list.length; i++) {
        let obj = g.b.list[i];
        if (obj.buyable(i)) {
            obj.buylink.removeAttribute('disabled');
            obj.buylink.classList.remove('disabled');
        } else {
            obj.buylink.setAttribute('disabled', 'disabled');
            obj.buylink.classList.add('disabled');
        }
    }
};
game.builds.buy = (index, object) => {
    if (g.b.list[index].buyable()) {
        g.b.list[index].buy();
        g.b.owned[index]++;
        g.b.update();
    }
};
game.builds.earn = (times) => {
    let delta = times / g.options.fps;
    for (let i = 0; i < g.b.list.length; i++) {
        if (g.b.owned[i] > 0) {
            let reward= g.b.list[i].reward;
            g.b.list[i].reward.func(g.b.list[i].valuePerSec.perSec * g.b.owned[i] * g.b.multiplier[i],
                delta,
                reward,
                game.ressources.owned
            );
        }
    }
};
game.builds.checkSave = () => {
    if (g.b.owned.length !== g.b.list.length) {
        let a = (g.b.list.length - g.b.owned.length);
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

        const line1 = obj.name + " : " + numbers.fix(obj.valuePerSec.perSec, 2) + " " + obj.valuePerSec.type.toLowerCase() + "/sec";
        const line2 = numbers.fix(g.b.owned[i], 0) + " owned : " + obj.reward.rewardPerSecondString(g.b.owned[i]);
        const line3 = "Cost " + numbers.fix(obj.buildPrice(), 0) + " " + obj.price.type.toLowerCase();

        document.getElementById("builds-infos-" + i).innerHTML = line1 + "<br>" + line2 + "<br>" + line3 + "<br>";
    });
};

game.builds.save = () => {
    return {
        owned: g.b.owned,
        multiplier: g.b.multiplier,
        visible: g.b.list.map((obj) => obj.visible)
    };
};
game.builds.load = (saveObj) => {
    g.b.owned = saveObj.owned;
    g.b.multiplier = saveObj.multiplier;
    g.b.list.forEach((obj, i) => {
        obj.visible = saveObj.visible[i];
    });
};