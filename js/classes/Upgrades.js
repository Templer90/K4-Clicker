class Upgrade {
    constructor(name, desc, tags, price, boughtFunction, additions) {
        additions = Object.assign({depends: undefined, visible: () => false}, additions);
        this.name = name.replace(/ /g, "_");
        this.displayName = name;
        this.desc = desc;
        this.tags = tags;
        this.index = -1;
        this.buylink = undefined;
        this.mainDiv = undefined;
        this.costParagraph = undefined;
        this.recursiveVisability = true;
        this.visibleFunctionList=[];
        
        this.boughtFunction = boughtFunction;
        if (boughtFunction === undefined) {
            this.boughtFunction = () => {
            };
        }

        this.depends = additions.depends;
        
        if (typeof additions.visible === 'string') {
            this.visibleFunction = () => {
                return g.u.owned[additions.visible] === true;
            }
        } else if (typeof additions.visible === 'object') {
            this.recursiveVisability = true;

            this.visibleFunction = additions.visible.func;
            this.visibleFunctionList = additions.visible.list
           
        } else {
            this.visibleFunction = additions.visible;
        }

        this.price = price;
    }

    updateCostStyle(style = undefined) {
        this.costParagraph.innerHTML = '';
        this.costParagraph.append(this.desc);
        this.costParagraph.append(document.createElement('br'));

        if (style === undefined) {
            style = game.options.elemental.toLowerCase();
        } else {
            style = style.toLowerCase();
        }

        switch (style) {
            case 'short':
                this.costParagraph.append(Object.entries(this.price).map(([element, cost]) => cost + elements.getHTML(element, style)).join(' & '));
                break;
            case 'name':
            case 'long':
                this.costParagraph.append(Object.entries(this.price).map(([element, cost]) => elements.getHTML(element, style) + ": " + cost).join(' & '));
                break;
            case 'aze-short':
            case 'aze':
                Object.entries(this.price).map(([element, cost]) => {
                    const e = document.createElement('div');
                    e.innerHTML = cost + ' ';
                    e.append(elements.getHTML(element, style));
                    this.costParagraph.append(e);
                });
                break;
        }
    }

    checkResources() {
        return Object.keys(this.price).find((key) => g.resources.owned[key] < this.price[key]) === undefined;
    }

    pay() {
        Object.keys(this.price).forEach((key) => {
            g.resources.owned[key] -= this.price[key];
        });
    }

    buyable() {
        let dependency = true;
        if (this.depends !== undefined) {
            dependency = this.depends();
        }

        return dependency && this.checkResources() && g.u.owned[this.name] === false;
    }

    visible() {
        if (this.recursiveVisability) {
            const thisFunc = this.visibleFunction();
            const list = this.visibleFunctionList.find((upgradeName) => {
                return g.u.list[upgradeName].visible() === false
            });
            return list === undefined && thisFunc;
        } else {
            return this.visibleFunction();
        }
    }
    
    finishBuy(){
        g.u.owned[this.name] = true;
    }
    
    setVisibility(visibility){
        if(visibility && this.visible()){
            this.mainDiv.style.display = '';
        }else{
            this.mainDiv.style.display = 'none';
        }
    }
    
    getHTML(){
        let main = document.createElement('div');
        main.setAttribute('id', 'upgrades-row-' + this.index);
        main.setAttribute('class', 'row bottom-spacer outlined');

        let infoBox = document.createElement('div');
        infoBox.setAttribute('class', 'col-md-8');

        let paragraph = document.createElement('p');
        paragraph.setAttribute('class', 'no-margin');
        this.costParagraph = paragraph;
        
        let nameParagraph = document.createElement('p');
        nameParagraph.setAttribute('class', 'no-margin text-center upgrades-title');
        nameParagraph.innerHTML = this.displayName;
        infoBox.append(nameParagraph);

        this.updateCostStyle(game.options.elemental);
        infoBox.append(paragraph);

        let buyButton = document.createElement('div');
        buyButton.setAttribute('class', 'col-md-4');
        buyButton.setAttribute('style', ' margin: auto;');

        this.buylink = document.createElement('a');
        this.buylink.id = 'upgrades-btn-' + this.name;
        this.buylink.setAttribute('class', 'btn btn-primary btn-block');
        this.buylink.setAttribute('type', 'button');
        this.buylink.onclick = () => {
            g.u.buy(this);
        };
        this.buylink.innerHTML = 'Buy upgrade';
        this.mainDiv = main;

        buyButton.append(this.buylink);
        main.append(infoBox);
        main.append(buyButton);
        
        return main;
    }
}

class InfiniteUpgrade extends Upgrade {
    constructor(name, desc, tags, price, boughtFunction, additions) {
        super(name, desc, tags, price, boughtFunction, additions);
    }

    buyable() {
        let dependency = true;
        if (this.depends !== undefined) {
            dependency = this.depends();
        }

        return dependency && this.checkResources() && g.u.owned[this.name] !== true;
    }

    finishBuy() {
        if (g.u.owned[this.name] === false) {
            g.u.owned[this.name] = 0;
        }

        g.u.owned[this.name]++;
    }
}

class MultiUpgrade extends Upgrade {
    constructor(name, desc, tags, price, max, boughtFunction, additions) {
        super(name, desc, tags, price, boughtFunction, additions);
        additions = Object.assign({showDots: true}, additions);
        this.max = max;
        this.showDots = additions.showDots;
    }

    updateDots() {
        if (this.showDots === false) return;
        const dots = document.getElementById("upgrades-btn-" + this.name).parentElement.parentElement.getElementsByClassName("dot");
        for (let i = 0; i < g.u.owned[this.name]; i++) {
            dots[i].classList.replace("dot-off", "dot-on");
        }
    }
    
    finishBuy() {
        if (g.u.owned[this.name] === false) {
            g.u.owned[this.name] = 0;
        }

        g.u.owned[this.name]++;
        this.updateDots();

        if (g.u.owned[this.name] === this.max) {
            g.u.owned[this.name] = true;
        }
    }

    buyable() {
        let dependency = true;
        if (this.depends !== undefined) {
            dependency = this.depends();
        }

        return dependency && this.checkResources() && g.u.owned[this.name] < this.max;
    }

    getHTML() {
        let main = super.getHTML();
        if (this.showDots) {
            let dots = " " + "<span class='dot dot-off'></span>".repeat(this.max);
            main.firstElementChild.firstElementChild.innerHTML = this.displayName + dots;
        }
        return main;
    }
}