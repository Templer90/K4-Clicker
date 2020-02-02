g.builds = g.b = {};
g.b.owned = [];
g.b.multiplier = [];

game.builds.create = function (name, desc, price, valuePerSec, reward, inflation) {
    this.name = name;
    this.desc = desc;
    this.price = price;

    this.reward = reward;
    this.valuePerSec = valuePerSec;
    this.inflation = inflation;

    this.buildPrice = (index) => {
        return g.b.list[index].price.amount * Math.pow(g.b.list[index].inflation, g.b.owned[index]);
    };

    this.buyable = (index) => {
        return g.ressources.owned[g.b.list[index].price.type] >= g.b.list[index].buildPrice(index);
    }
};
game.builds.init = () => {
    for (let i = 0; i < g.b.list.length; i++) {
        g.b.owned.push(0);
        g.b.multiplier.push(1);

        let main = $(document.createElement("div"));
        main.attr('id', 'builds-row-' + i);
        main.attr('class', 'row bottom-spacer');

        let infoBox = $('<div class="col-md-8"><p id="builds-infos-' + i + '" class="no-margin">' + g.b.list[i].name + " : " + g.b.list[i].reward.type + " " + g.b.list[i].price.type.toLowerCase() + "/sec<br>" + g.b.owned[i] + " owned : " + h.buildReward(i) + " " + g.b.list[i].price.type.toLowerCase() + "/sec" + "<br>Cost " + fix(g.b.list[i].buildPrice(i), 0) + " " + g.b.list[i].price.type.toLowerCase() + '</p></div>');
        let buyButton = $('<div class="col-md-4"><a id="builds-btn-' + i + '" type="button" class="btn btn-primary btn-block" onclick="g.b.buy(' + i + ',\'' + g.b.list[i].name + '\')">Buy build</a></div>');

        main.append(infoBox);
        main.append(buyButton);

        $("#builds-panelbody").append(main);
    }
};
game.builds.buy = (index, name) => {
    let price = g.b.list[index].price.amount;
    let type = g.b.list[index].price.type;

    if (g.b.list[index].buyable(index)) {
        g.ressources.owned[type] -= price;
        g.b.owned[index]++;
        g.b.update();
    }
};
game.builds.earn = (times) => {
    for (let i = 0; i < g.b.list.length; i++) {
        if (g.b.owned[i] > 0) {
            g.b.list[i].reward(g.b.list[i].valuePerSec * g.b.owned[i] * g.b.multiplier[i], times / g.options.fps);
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
        let string = obj.name + " : " + fix(obj.valuePerSec, 2) + " " + obj.price.type.toLowerCase() + "/sec<br>" +
            fix(g.b.owned[i], 0) + " owned : " + fix(obj.valuePerSec * g.b.owned[i] * g.b.multiplier[i], 2) + " " + obj.price.type.toLowerCase() + "/sec" + "<br>" +
            "Cost " + fix(obj.buildPrice(i), 0) + " " + obj.price.type.toLowerCase();

        $("#builds-infos-" + i).html(string);
    }
};

g.b.list = [
    new g.b.create("Hydrogen build", "Create some hydrogen", {
            amount: 25,
            type: 'Hydrogen'
        },
        1,
        (value, delta) => {
            game.ressources.owned.Hydrogen += value * delta;
        },
        1.15),
    new g.b.create("Oxygen build", "Create some oxygen", {
            amount: 25,
            type: 'Oxygen'
        },
        1,
        (value, delta) => {
            game.ressources.owned.Oxygen += value * delta;
        },
        1.15),
    new g.b.create("Helium build", "Create some helium", {
            amount: 25,
            type: 'Helium'
        },
        1,
        (value, delta) => {
            game.ressources.owned.Helium += value * delta;
        },
        1.15),
    new g.b.create("Water generator", "Generate some water", {
            amount: 1500,
            type: 'Hydrogen'
        },
        1,
        (value, delta) => {
            game.ressources.owned.Water += value * delta;
        },
        1.15)
];