class Upgrade {
    constructor(name, desc, tags, price, boughtFunction, dependsOn = undefined, visibleFunction = undefined) {
        this.name = name.replace(/ /g, "_");
        this.displayName = name;
        this.desc = desc;
        this.tags = tags;
        this.index = -1;
        this.buylink = undefined;
        this.mainDiv = undefined;
        
        this.boughtFunction = boughtFunction;
        if (boughtFunction === undefined) {
            this.boughtFunction = () => {
            };
        }
        
        this.depends = dependsOn;

        if (visibleFunction === undefined) {
            this.visibleFunction = () => true;
        } else {
            this.visibleFunction = visibleFunction;
        }

        this.price = price;
        this.costString = 'Cost: ' + Object.entries(this.price).map(([a, b]) => a + ": " + b).join(" & ");
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
    
    visible(){
        return this.visibleFunction();
    }
    
    setVisibility(visibility){
        if(visibility && this.visibleFunction()){
            this.mainDiv.style.display = '';
        }else{
            this.mainDiv.style.display = 'none';
        }
    }
    
    getHTML(){
        let main = document.createElement("div");
        main.setAttribute('id', 'upgrades-row-' + this.index);
        main.setAttribute('class', 'row bottom-spacer outlined');

        let infoBox = document.createElement("div");
        infoBox.setAttribute('class', 'col-md-8');

        let paragraph = document.createElement("p");
        paragraph.setAttribute('class', 'no-margin');
        
        let nameParagraph = document.createElement("p");
        nameParagraph.setAttribute('class', 'no-margin text-center upgrades-title');
        nameParagraph.innerHTML = this.displayName;
        infoBox.append(nameParagraph);

        paragraph.innerHTML = this.desc + "<br>" + this.costString;
        infoBox.append(paragraph);

        let buyButton = document.createElement("div");
        buyButton.setAttribute('class', 'col-md-4');
        buyButton.setAttribute('style', ' margin: auto;');

        let buyLink = document.createElement("a");
        buyLink.id = 'upgrades-btn-' + this.name;
        buyLink.setAttribute('class', 'btn btn-primary btn-block');
        buyLink.setAttribute('type', 'button');
        buyLink.onclick = () => {
            g.u.buy(this);
        };
        buyLink.innerHTML = 'Buy upgrade';
        this.buylink = buyLink;
        this.mainDiv = main;

        buyButton.append(buyLink);
        main.append(infoBox);
        main.append(buyButton);
        
        return main;
    }
}

class MultiUpgrade extends Upgrade {
    constructor(name, desc, tags, price, max, boughtFunction, dependsOn, buyCheckFunction, visibleFunction) {
        super(name, desc, tags, price, boughtFunction, dependsOn, buyCheckFunction, visibleFunction);
        this.max = max;
    }

    updateDots() {
        const dots = document.getElementById("upgrades-btn-" + this.name).parentElement.parentElement.getElementsByClassName("dot");
        for (let i = 0; i < g.u.owned[this.name]; i++) {
            dots[i].classList.replace("dot-off", "dot-on");
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

        let dots = " " + "<span class='dot dot-off'></span>".repeat(this.max);
        main.firstElementChild.firstElementChild.innerHTML = this.displayName + dots;

        return main;
    }
}