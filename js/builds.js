g.builds = g.b = {};
g.b.owned = [];
g.b.multiplier = [];

game.builds.create = function (name, desc, price, valuePerSec, reward, inflation) {
    this.name = name.replace(/ /g, "_");
    this.displayName = name;
    this.desc = desc;
    this._orginalPrices=price;
    
    this.price=price;
    //if (!Array.isArray(price)) {
    //    price = [price];
    //}
    //this.price = {
    //    checkResources: () => {
    //        for (let i = 0; i < price.length; i++) {
    //            if (g.ressources.owned[price[i].type] < price[i].amount) {
    //                return false;
    //            }
    //        }
    //        return true;

    //    },
    //    pay: () => {
    //        for (let i = 0; i < price.length; i++) {
    //            g.ressources.owned[price[i].type] -= price[i].amount;
    //        }
    //    },
    //    costString: helpers.genCostString(price)
    //};

    this.reward = reward;
    this.valuePerSec = valuePerSec;
    this.inflation = inflation;

    this.buildPrice = (index) => {
        return this.price.amount * Math.pow(this.inflation, g.b.owned[index]);
    };

    this.buyable = (index) => {
        return g.ressources.owned[g.b.list[index].price.type] >= g.b.list[index].buildPrice(index);
    };

    this.buy = (index) => {
        let type = this.price.type;
        g.ressources.owned[type] -= this.buildPrice(index);
        this.costString = fix(this.buildPrice(), 0) + " " + this.price.type.toLowerCase();
    };
};
game.builds.init = () => {
    let panel = document.getElementById('builds-panelbody');
    for (let i = 0; i < g.b.list.length; i++) {
        let obj = g.b.list[i];
        g.b.owned.push(0);
        g.b.multiplier.push(1);

        let main = document.createElement("div");
        main.setAttribute('id', 'builds-row-' + i);
        main.setAttribute('class', 'row bottom-spacer');

        let infoBox = document.createElement("div");
        infoBox.setAttribute('class', 'col-md-8');

        let paragraph = document.createElement("p");
        paragraph.id = "builds-infos-" + i;
        paragraph.setAttribute('class', 'no-margin');

        let line1 = obj.displayName + " : " + obj.reward.type + " " + obj.valuePerSec + "/sec";
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
    }
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
    if (g.b.list[index].buyable(index)) {
        g.b.list[index].buy(index);
        g.b.owned[index]++;
        g.b.update();
    }
};
game.builds.earn = (times) => {
    let delta = times / g.options.fps;
    for (let i = 0; i < g.b.list.length; i++) {
        if (g.b.owned[i] > 0) {
            g.b.list[i].reward.func(g.b.list[i].valuePerSec * g.b.owned[i] * g.b.multiplier[i], delta);
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
    for (let i = 0; i < g.b.list.length; i++) {
        let obj = g.b.list[i];
        let line1 = obj.name + " : " + fix(obj.valuePerSec, 2) + " " + obj.price.type.toLowerCase() + "/sec";
        let line2 = fix(g.b.owned[i], 0) + " owned : " + fix(obj.valuePerSec * g.b.owned[i] * g.b.multiplier[i], 2) + " " + obj.price.type.toLowerCase() + "/sec";
        let line3 = "Cost " + fix(obj.buildPrice(i), 0) + " " + obj.price.type.toLowerCase();
        document.getElementById("builds-infos-" + i).innerHTML = line1 + "<br>" + line2 + "<br>" + line3 + "<br>";
    }
};

g.b.list = [
    new g.b.create("Hydrogen build", "Create some hydrogen", {
            amount: 25,
            type: 'Hydrogen'
        },
        1,
        {
            type: "Hydrogen",
            func: (value, delta) => {
                game.ressources.owned.Hydrogen += value * delta;
            },
        },
        1.15),
    new g.b.create("Oxygen build", "Create some oxygen", {
            amount: 25,
            type: 'Oxygen'
        },
        1,
        {
            type: "Oxygen",
            func: (value, delta) => {
                game.ressources.owned.Oxygen += value * delta;
            },
        },
        1.15),
    new g.b.create("Helium build", "Create some helium", {
            amount: 25,
            type: 'Helium'
        },
        1,
        {
            type: "Helium",
            func: (value, delta) => {
                game.ressources.owned.Helium += value * delta;
            },
        },
        1.15),
    new g.b.create("Water generator", "Generate some water", {
            amount: 1500,
            type: 'Hydrogen'
        },
        1,
        {
            type: "Water",
            func: (value, delta) => {
                game.ressources.owned.Water += value * delta;
            },
        },
        1.15)
];