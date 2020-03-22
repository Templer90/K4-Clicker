class Building {
    constructor(name, desc, price, valuePerSec, reward, additions) {
        additions = Object.assign({visible: false}, additions);
        this.name = helpers.formatName(name);
        this.additions = {};
        this.displayName = name;
        this.desc = desc;
        this.visible = additions.visible;
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

                return numbers.fix(tmpRef[this.reward.type], 2) + ' ' +this.reward.type.toLowerCase() + '/sec';
            }
        }
        this.valuePerSec = valuePerSec;

        this.titleElement = undefined;
        this.inDivElement = undefined;
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
                this.upgradeCostElement.append(Object.entries(this.price.startCost).map(([element, cost]) => elements.getHTML(element, style) + ': ' + numbers.fix(this.buildPrice(element), 0)).join(' & '));
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
        //this.costString = numbers.fix(this.buildPrice(), 0) + ' ' + this.price.type.toLowerCase();
    };
    
    update(){
        const constElement = document.getElementById('builds-infos-' + this.index);
        this.titleElement.innerHTML = this.name + ' : ' + numbers.fix(this.valuePerSec.perSec, 2) + ' ' + this.valuePerSec.type.toLowerCase() + '/sec';
        this.ownedElement.innerHTML = numbers.fix(g.b.owned[this.index], 0) + ' owned : ' + this.reward.rewardPerSecondString(g.b.owned[this.index], constElement);
        this.updateCostStyle();
        //this.upgradeCostElement.innerHTML = 'Cost ' + numbers.fix(this.buildPrice(), 0) + ' ' + this.price.type.toLowerCase();
    }

    genHTML(index) {
        const main = document.createElement('div');
        main.setAttribute('id', 'builds-row-' + index);
        main.className = 'row bottom-spacer';

        const infoBox = document.createElement('div');
        infoBox.setAttribute('class', 'col-md-8');

        const paragraph = document.createElement('p');
        paragraph.id = 'builds-infos-' + index;
        paragraph.setAttribute('class', 'no-margin');


        this.titleElement = document.createElement('div');
        this.titleElement.innerHTML = this.displayName + ' : ' + this.valuePerSec.type + ' ' + this.valuePerSec.perSec + '/sec';
       
        this.ownedElement = document.createElement('div');
        this.ownedElement.innerHTML= numbers.fix(g.b.owned[index], 0) + ' owned : ' + this.reward.rewardPerSecondString(g.b.owned[index], paragraph);
        
        this.upgradeCostElement = document.createElement('div');
        this.updateCostStyle();
        //this.upgradeCostElement.innerHTML = 'Cost ' + this.costString;

        paragraph.append(this.titleElement);
        this.inDivElement = document.createElement('div');
        this.inDivElement.className = 'stash-panel';
        this.inDivElement.append(this.ownedElement);
        this.inDivElement.append(this.upgradeCostElement);
        paragraph.append(this.inDivElement);
        infoBox.append(paragraph);

        const buyButton = document.createElement('div');
        buyButton.setAttribute('class', 'col-md-4');

        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group mb-3';

        const inputPrepend = document.createElement('div');
        inputPrepend.className = 'input-group-prepend';
        inputGroup.append(inputPrepend);

        const inputBackground = document.createElement('div');
        inputBackground.className = 'btn building-checkbox input-group-text';
        inputPrepend.append(inputBackground);

        const inputCheckbox = document.createElement('input');
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
    constructor(name, desc, price, valuePerSec, additions) {
        additions = Object.assign({visible: false}, additions);
        super(name, desc, price, valuePerSec, {}, additions);
        this.genReward();
        this.selectElement = undefined;
        this.additions.selectedColliderIndex = 0;
    }

    genReward() {
        this.reward = {
            type: "Collider",
            accumulator: 0,
            rewardPerSecondString: (owned, element) => {
                const statistic = g.collider.statistic[this.additions.selectedColliderIndex];
                element.removeAttribute('title');
                element.removeAttribute('data-original-title');

                let tooltip = 'Input:\n';
                tooltip += '\tEnergy: ' + Math.round(statistic.inputEnergy * owned) + '\n\t';
                tooltip += statistic.inputElements.map((output) => output.element + " " + (output.value * owned)).join('\n\t');
                tooltip += '\nOutput:\n';
                tooltip += '\tEnergy: ' + Math.round(statistic.outputEnergy * owned) + '\n\t';
                tooltip += statistic.outputElements.map((output) => output.element + ": " + (output.value * owned)).join('\n\t');

                element.setAttribute('data-original-title', tooltip);
                $(element).tooltip('update');
                element.dataset.toggle = 'tooltip';
                element.dataset.placement = 'top';

                return statistic.outputElements.map((output) => elements.find(output.element).symbol + (output.value * owned)).join(" & ") + ' /sec';
            },
            func: (value, delta, reward) => {
                reward.accumulator += value * delta;

                if (reward.accumulator < 1) return;

                if (g.resources.perClick.Collider.can(g.resources.owned, Math.floor(reward.accumulator), this.additions.selectedColliderIndex)) {
                    g.resources.perClick.Collider.click(g.resources.owned, Math.floor(reward.accumulator), this.additions.selectedColliderIndex);
                    reward.accumulator -= Math.floor(reward.accumulator);
                } else {
                    while (reward.accumulator > 1) {
                        reward.accumulator -= 1;
                        game.earnCollider(this.additions.selectedColliderIndex);
                    }
                }
            }
        };
    }

    update() {
        this.updateSelect();
        super.update();
    }

    updateSelect() {
        let length = this.selectElement.options.length;
        for (let i = length - 1; i >= 0; i--) {
            this.selectElement.options[i] = null;
        }

        g.collider.statistic.forEach((stat, i) => {
            let option = document.createElement('option');
            if (i === 0) {
                option.text = 'Main';
            } else {
                option.text = 'Collider #' + i;
            }
            option.value = i;
            this.selectElement.add(option, this.selectElement[i]);
        });

        this.selectElement.selectedIndex = this.additions.selectedColliderIndex;
    }

    genHTML(index) {
        const main = super.genHTML(index);
        const div = document.createElement('div');
        div.className = 'col-md-12';

        const a = document.createElement('a');
        a.innerHTML = this.titleElement.innerHTML;
        a.className = 'collapsed';
        a.dataset.toggle = 'collapse';
        a.dataset.target = '#build-' + this.name;
        $(a).collapse();

        this.titleElement.parentNode.replaceChild(a, this.titleElement);
        this.titleElement = a;

        const divPanel = document.createElement('div');
        divPanel.id = 'build-' + this.name;
        divPanel.className = 'panel-collapse collapse';


        const sliderDiv = document.createElement('div');
        sliderDiv.className = 'col-md-12';
        const sliderLabel = document.createElement('label');
        sliderLabel.setAttribute('for', 'testLabel');
        sliderLabel.className = 'col-md-4';
        sliderLabel.innerText = '50';
        sliderDiv.append(sliderLabel);
        const sliderInput = document.createElement('input');
        sliderInput.className = 'custom-range col-md-8';
        sliderInput.setAttribute('type', 'range');
        sliderInput.setAttribute('min', '10');
        sliderInput.setAttribute('max', '100');
        sliderInput.setAttribute('id', 'testLabel');
        sliderInput.oninput = (ev) => {
            sliderLabel.innerText = sliderInput.value;
        };
        sliderDiv.append(sliderInput);


        const selectDiv = document.createElement('div');
        selectDiv.className = 'col-md-8';
        this.selectElement = document.createElement('select');
        this.selectElement.className = 'custom-select';
        this.selectElement.oninput = () => {
            this.additions.selectedColliderIndex = this.selectElement.value;
            this.update();
        };
        selectDiv.append(this.selectElement);
        this.updateSelect();

        divPanel.append(sliderDiv);
        divPanel.append(selectDiv);
        div.append(divPanel);

        this.inDivElement.append(div);
        return main;
    }
}