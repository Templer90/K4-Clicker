class Upgrade {
    constructor(name, desc, tags, price, boughtFunction, dependsOn = undefined, buyCheckFunction = undefined) {
        this.name = name.replace(/ /g, "_");
        this.displayName = name;
        this.desc = desc;
        this.tags = tags;
        this.boughtFunction = boughtFunction;
        if (boughtFunction === undefined) {
            this.boughtFunction = () => {
            };
        }
        this.depends = dependsOn;
        this.buyCheckFunction = buyCheckFunction;
        this.mainDiv = undefined;
        this.buylink = undefined;

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
}

class MultiUpgrade extends Upgrade {
    constructor(name, desc, tags, price, max, boughtFunction, dependsOn = undefined, buyCheckFunction = undefined) {
        super(name, desc, tags, price, boughtFunction, dependsOn, buyCheckFunction);
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
}