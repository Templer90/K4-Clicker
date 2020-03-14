class Building {
    constructor(name, desc, price, valuePerSec, reward, visible = true) {
        this.name = name.replace(/ /g, "_");
        this.displayName = name;
        this.desc = desc;
        this.visible = visible;
        this.price = {
            startCost: price.startCost,
            inflation: undefined
        };

        if (price.inflation === undefined) {
            console.error(this.displayName + ' has a price without inflation');
        } else if (typeof (price.inflation) === 'number') {
            this.price.inflation = {};
            Object.entries(this.price.startCost).forEach(([element, value]) => {
                this.price.inflation[element] = price.inflation;
            });
        } else if (typeof price.inflation === 'object') {
            this.price.inflation  = {};
            Object.entries(price.inflation).forEach(([element, value]) => {
                this.price.inflation[element] = value;
            });
        }
        
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

                return numbers.fix(tmpRef[this.reward.type], 2) + " " +this.reward.type.toLowerCase() + "/sec";
            }
        }
        this.valuePerSec = valuePerSec;

        this.titleElement = undefined;
        this.ownedElement = undefined;
        this.upgradeCostElement = undefined;
    }

    updateCostStyle(style = undefined) {
        this.upgradeCostElement.innerHTML = '';

        if (style === undefined) {
            style = game.options.elemental.toLowerCase();
        } else {
            style = style.toLowerCase();
        }

        switch (style) {
            case 'short':
                this.upgradeCostElement.append(Object.entries(this.price.startCost).map(([element, cost]) => numbers.fix(this.buildPrice(element), 0) + elements.getHTML(element, style)).join(' & '));
                break;
            case 'name':
            case 'long':
                this.upgradeCostElement.append(Object.entries(this.price.startCost).map(([element, cost]) => elements.getHTML(element, style) + ": " + numbers.fix(this.buildPrice(element), 0)).join(' & '));
                break;
            case 'aze-short':
            case 'aze':
                Object.entries(this.price.startCost).map(([element, cost]) => {
                    const e = document.createElement('div');
                    e.innerHTML = numbers.fix(this.buildPrice(element), 0) + ' ';
                    e.append(elements.getHTML(element, style));
                    this.upgradeCostElement.append(e);
                });
                break;
        }
    }

    buildPrice(element) {
        return this.price.startCost[element] * Math.pow( this.price.inflation[element], g.b.owned[this.index]);
    };

    buyable() {
        let flag = true;
        Object.entries(this.price.startCost).forEach(([entry, value]) => {
            if (this.buildPrice(entry) > g.resources.owned[entry]) {
                flag = false;
            }
        });
        return flag;
    };

    buy() {
        Object.entries(this.price.startCost).forEach(([entry, value]) => {
            g.resources.owned[entry] -= this.buildPrice(entry);
        });
      
        this.updateCostStyle();
        //this.costString = numbers.fix(this.buildPrice(), 0) + " " + this.price.type.toLowerCase();
    };
    
    update(){
        const constElement = document.getElementById("builds-infos-" + this.index);
        this.titleElement.innerHTML = this.name + " : " + numbers.fix(this.valuePerSec.perSec, 2) + " " + this.valuePerSec.type.toLowerCase() + "/sec";
        this.ownedElement.innerHTML = numbers.fix(g.b.owned[this.index], 0) + " owned : " + this.reward.rewardPerSecondString(g.b.owned[this.index], constElement);
        this.updateCostStyle();
        //this.upgradeCostElement.innerHTML = "Cost " + numbers.fix(this.buildPrice(), 0) + " " + this.price.type.toLowerCase();
    }

    genHTML(index) {
        const main = document.createElement("div");
        main.setAttribute('id', 'builds-row-' + index);
        main.setAttribute('class', 'row bottom-spacer');

        const infoBox = document.createElement("div");
        infoBox.setAttribute('class', 'col-md-8');

        const paragraph = document.createElement("p");
        paragraph.id = "builds-infos-" + index;
        paragraph.setAttribute('class', 'no-margin');


        this.titleElement = document.createElement("div");
        this.titleElement.innerHTML = this.displayName + " : " + this.valuePerSec.type + " " + this.valuePerSec.perSec + "/sec";
       
        this.ownedElement = document.createElement("div");
        this.ownedElement.innerHTML= numbers.fix(g.b.owned[index], 0) + " owned : " + this.reward.rewardPerSecondString(g.b.owned[index], paragraph);
        
        this.upgradeCostElement = document.createElement("div");
        this.updateCostStyle();
        //this.upgradeCostElement.innerHTML = "Cost " + this.costString;

        paragraph.append(this.titleElement);
        paragraph.append(this.ownedElement);
        paragraph.append(this.upgradeCostElement);
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


class ColliderBuilding extends Building {
    constructor(name, desc, price, valuePerSec, reward, visible = true) {
        super(name, desc, price, valuePerSec, reward, visible);
    }

    genHTML(index) {
        const main = super.genHTML(index);
        const div = document.createElement("div");
        div.className = 'col-md-12';

        const a = document.createElement("a");
        a.innerHTML = this.titleElement.innerHTML;
        a.className = 'collapsed';
        a.dataset.toggle = "collapse";
        a.dataset.target = "#build-" + this.name;
        $(a).collapse();

        this.titleElement.parentNode.replaceChild(a,this.titleElement);
        this.titleElement = a;

        const divPanel = document.createElement("div");
        divPanel.id = "build-" + this.name;
        divPanel.className = 'panel-collapse collapse';
        divPanel.innerHTML = "TestTrings";
        div.append(divPanel);

        main.append(div);
        return main;
    }
}