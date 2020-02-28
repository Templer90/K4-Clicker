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
        return Object.keys(this.price).find((key) => g.ressources.owned[key] < this.price[key]) === undefined;
    }

    pay() {
        Object.keys(this.price).forEach((key) => {
            g.ressources.owned[key] -= this.price[key];
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
        let dots = document.getElementById("upgrades-btn-" + this.name).parentElement.parentElement.getElementsByClassName("dot");
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

g.upgrades = g.u = {};
g.u.owned = {};

game.upgrades.buy = (thing) => {
    let obj = thing;
    if (typeof (thing) === "string") {
        obj = g.u.list[thing];
    }

    if (obj.buyable()) {
        obj.pay();
        obj.boughtFunction(obj);
        if (obj instanceof MultiUpgrade) {
            if (g.u.owned[obj.name] === false) {
                g.u.owned[obj.name] = 0;
            }

            g.u.owned[obj.name]++;
            obj.updateDots();

            if (g.u.owned[obj.name] === obj.max) {
                g.u.owned[obj.name] = true;
            }
        } else {
            g.u.owned[obj.name] = true;
        }

        g.buttons();
        g.status();

        if (g.u.owned[obj.name] === true) {
            let upgradeBTN = document.getElementById("upgrades-btn-" + obj.name);
            upgradeBTN.remove();
            g.u.hide();
            game.builds.update();
        }
    }
};

game.upgrades.init = () => {
    let panel = document.getElementById('upgrades-panelbody');
    g.u.list.forEach((obj, i) => {
        g.u.list[obj.name] = obj;
        g.u.owned[obj.name] = false;


        let main = document.createElement("div");
        main.setAttribute('id', 'upgrades-row-' + i);
        main.setAttribute('class', 'row bottom-spacer upgrade-holder');

        let infoBox = document.createElement("div");
        infoBox.setAttribute('class', 'col-md-8');

        let paragraph = document.createElement("p");
        paragraph.setAttribute('class', 'no-margin');

        let dots = "";
        if (obj instanceof MultiUpgrade) {
            dots = " " + "<span class='dot dot-off'></span>".repeat(obj.max);
        }

        paragraph.innerHTML = obj.displayName + ": " + obj.desc + dots + "<br>" + obj.costString;
        infoBox.append(paragraph);

        let buyButton = document.createElement("div");
        buyButton.setAttribute('class', 'col-md-4');
        buyButton.setAttribute('style', ' margin: auto;');

        let buyLink = document.createElement("a");
        buyLink.id = 'upgrades-btn-' + obj.name;
        buyLink.setAttribute('class', 'btn btn-primary btn-block');
        buyLink.setAttribute('type', 'button');
        buyLink.onclick = () => {
            g.u.buy(obj);
        };
        buyLink.innerHTML = 'Buy upgrade';
        obj.buylink = buyLink;
        obj.mainDiv = main;

        buyButton.append(buyLink);
        main.append(infoBox);
        main.append(buyButton);
        panel.append(main);
    });
};
game.upgrades.checkBuyStatus = () => {
    g.u.list.forEach((obj, i) => {
        if (obj.buyable()) {
            obj.buylink.removeAttribute('disabled');
            obj.buylink.classList.remove('disabled');
        } else {
            obj.buylink.setAttribute('disabled', 'disabled');
            obj.buylink.classList.add('disabled');
        }
    });
};
game.upgrades.search = (searchBox) => {
    const input = searchBox.value.trim().toUpperCase();

    if (input === '') {
        g.u.list.forEach((obj) => {
            obj.mainDiv.style.display = '';
        });
        game.upgrades.hide();
    } else {
        const regex = new RegExp(`.*${input}.*`, "g");

        g.u.list.forEach((obj) => {
            const infoString = obj.name + "," + obj.tags + "," + Object.keys(obj.price).toString();
            if (regex.exec(infoString.toUpperCase())) {
                obj.mainDiv.style.display = '';
            } else {
                obj.mainDiv.style.display = 'none';
            }
        });
    }
};
game.upgrades.hide = () => {
    let funcHide = (obj, i) => {
        obj.mainDiv.style.display = 'none';
    };
    let funcShow = (obj, i) => {
        obj.mainDiv.style.display = '';
    };
    let func = funcHide;
    if (document.getElementById('upgrades-checkbox').checked === true) {
        func = funcShow;
    }

    g.u.list.filter((obj) => g.u.owned[obj.name] === true).forEach(func);
};
game.upgrades.onlyBuyable = () => {
    //g.u.list.forEach((obj, i) => {
    //    if (obj.buyable()) {
    //        obj.mainDiv.style.display = '';
    //    }else{
    //        obj.mainDiv.style.display = 'none';
    //    }
    //});
};
game.upgrades.check = () => {
    g.u.onlyBuyable();
    g.u.list.forEach((obj, i) => {
        if (g.u.owned[obj.name] === true) {
            let upgradeBTN = document.getElementById("upgrades-btn-" + obj.name);
            upgradeBTN.remove();
        }
    });
};
game.upgrades.checkSave = () => {
    if (g.u.owned.length !== g.u.list.length) {
        let a = (g.u.list.length - g.u.owned.length);
        for (let i = 0; i < a.length; i++)
            g.u.owned.push(0);
    }
};
game.upgrades.save = () => {
    return {
        owned: g.u.owned
    };
};
game.upgrades.load = (saveObj) => {
    g.u.owned = saveObj.owned;
    g.u.list
        .filter((obj) => (obj instanceof MultiUpgrade) && (typeof g.u.owned[obj.name] === 'number'))
        .forEach((obj) => {
            obj.updateDots()
        });
};