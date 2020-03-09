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
        buyLink.className = 'btn btn-primary btn-block form-control';
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