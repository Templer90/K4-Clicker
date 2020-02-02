g.upgrades = g.u = {};
g.u.owned = [];

game.upgrades.create = function (name, desc, price, buyFunction) {
    this.name = name;
    this.desc = desc;
    this.price = price;
    this.func = buyFunction;

    this.buyable = (index) => {
        return g.ressources.owned[this.price.type] >= this.price.amount && g.u.owned[index] === false;
    }
};

game.upgrades.buy = (i) => {
    let obj = g.u.list[i];

    if (obj.buyable(i)) {
        g.ressources.owned[obj.price.type] -= obj.price.amount;
        obj.func();
        g.u.owned[i] = true;
        g.buttons();

        let upgradeBTN = $("#upgrades-btn-" + i);
        upgradeBTN.attr('onclick', '');
        upgradeBTN.removeClass('btn-primary');
        upgradeBTN.addClass('btn-success');
        upgradeBTN.html('Owned');
        g.u.hide();
    }
};

game.upgrades.init = () => {
    for (let i = 0; i < g.u.list.length; i++) {
        g.u.owned.push(false);
        let main = $(document.createElement("div"));
        main.attr('id', 'upgrades-row-' + i);
        main.attr('class', 'row bottom-spacer');

        let infoBox = $('<div class="col-md-8"><p class="no-margin">' + g.u.list[i].name + " : " + g.u.list[i].desc + "<br>Cost " + fix(g.u.list[i].price.amount, 0) + " " + g.u.list[i].price.type.toLowerCase() + '</p>' + '</div>');
        let buyButton = $('<div class="col-md-4"><a id="upgrades-btn-' + i + '" type="button" class="btn btn-primary btn-block" onclick="g.u.buy(' + i + ')">Buy upgrade</a></div>');

        main.append(infoBox);
        main.append(buyButton);

        $("#upgrades-panelbody").append(main);
    }
};
game.upgrades.hide = () => { // todo
    let a = document.getElementById('upgrades-checkbox');
    if (a.checked === true) {
        for (let i = 0; i < g.u.list.length; i++) {
            if (g.u.owned[i] === true)
                $("#upgrades-row-" + i).css("display", 'block');
        }
    } else {
        for (let i = 0; i < g.u.list.length; i++) {
            if (g.u.owned[i] === true)
                $("#upgrades-row-" + i).css("display", 'none');
        }
    }
};
game.upgrades.check = () => {
    for (let i = 0; i < g.u.list.length; i++) {
        if (g.u.owned[i] === true) {
            let upgradeBTN = $("#upgrades-btn-" + i);
            upgradeBTN.attr('onclick', '');
            upgradeBTN.removeClass('btn-primary');
            upgradeBTN.addClass('btn-success');
            upgradeBTN.html('Owned');
        }
    }
};
game.upgrades.checkSave = () => {
    if (g.u.owned.length !== g.u.list.length) {
        let a = (g.u.list.length - g.u.owned.length);
        for (let i = 0; i < a.length; i++)
            g.u.owned.push(0);
    }
};

g.u.owned = [];
g.u.list = [
    new g.u.create("Hydrogen I", "Hydrogen/click x2", {amount: 10, type: 'Hydrogen'}, () => {
        game.ressources.perClick.Hydrogen.amount *= 2;
    }),
    new g.u.create("Hydrogen II", "Hydrogen/click x2", {amount: 75, type: 'Hydrogen'}, () => {
        game.ressources.perClick.Hydrogen.amount *= 2;
    }),
    new g.u.create("Hydrogen III", "Hydrogen/click x1.5", {amount: 1000, type: 'Hydrogen'}, () => {
        game.ressources.perClick.Hydrogen.amount *= 1.5;
    }),

    new g.u.create("Oxygen I", "Oxygen/click x2", {amount: 10, type: 'Oxygen'}, () => {
        game.ressources.perClick.Oxygen.amount *= 2;
    }),
    new g.u.create("Oxygen II", "Oxygen/click x2", {amount: 75, type: 'Oxygen'}, () => {
        game.ressources.perClick.Oxygen.amount *= 2;
    }),
    new g.u.create("Oxygen III", "Oxygen/click x1.5", {amount: 1000, type: 'Oxygen'}, () => {
        game.ressources.perClick.Oxygen.amount *= 1.5;
    }),

    new g.u.create("Helium I", "Helium/click x2", {amount: 10, type: 'Helium'}, () => {
        game.ressources.perClick.Helium.amount *= 2;
    }),
    new g.u.create("Helium II", "Helium/click x2", {amount: 75, type: 'Helium'}, () => {
        game.ressources.perClick.Helium.amount *= 2;
    }),
    new g.u.create("Helium III", "Helium/click x1.5", {amount: 1000, type: 'Helium'}, () => {
        game.ressources.perClick.Helium.amount *= 1.5;
    })
];