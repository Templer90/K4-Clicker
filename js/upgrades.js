g.upgrades = g.u = {};
g.u.owned = {};

game.upgrades.create = function (name, desc, price, boughtFunction, dependsOn = undefined) {
    this.name = name;
    this.desc = desc;
    this.price = price;
    this.boughtFunction = boughtFunction;
    this.depends = () => {
        return true;
    };

    if (dependsOn !== undefined) {
        this.depends = dependsOn;
    }
};

game.upgrades.buyable = (name) => {
    let obj = g.u.list[name];
    return g.ressources.owned[obj.price.type] >= obj.price.amount && g.u.owned[name] === false;
};

game.upgrades.buy = (name) => {
    let obj = g.u.list[name];

    if (game.upgrades.buyable(name) && obj.depends()) {
        g.ressources.owned[obj.price.type] -= obj.price.amount;
        obj.boughtFunction();
        g.u.owned[name] = true;
        g.buttons();

        let upgradeBTN = document.getElementById("upgrades-btn-" + name);
        upgradeBTN.setAttribute('onclick', '');
        upgradeBTN.classList.replace('btn-primary', 'btn-success');
        upgradeBTN.innerHTML = 'Owned';
        g.u.hide();
    }
};

game.upgrades.init = () => {
    let panel = document.getElementById('upgrades-panelbody');
    for (let i = 0; i < g.u.list.length; i++) {
        let obj = g.u.list[i];
        g.u.list[obj.name] = obj;
        g.u.owned[obj.name] = false;

        let main = document.createElement("div");
        main.setAttribute('id', 'upgrades-row-' + i);
        main.setAttribute('class', 'row bottom-spacer');

        let infoBox = document.createElement("div");
        infoBox.setAttribute('class', 'col-md-8');

        let paragraph = document.createElement("p");
        paragraph.setAttribute('class', 'no-margin');
        paragraph.innerHTML = obj.name + " : " + obj.desc + "<br>Cost " + fix(obj.price.amount, 0) + " " + obj.price.type.toLowerCase();
        infoBox.append(paragraph);

        let buyButton = document.createElement("div");
        buyButton.setAttribute('class', 'col-md-4');
        let buyLink = document.createElement("a");
        buyLink.id = 'upgrades-btn-' + obj.name;
        buyLink.setAttribute('class', 'btn btn-primary btn-block');
        buyLink.setAttribute('type', 'button');
        buyLink.onclick = () => {
            g.u.buy(obj.name);
        };
        buyLink.innerHTML = 'Buy upgrade';

        buyButton.append(buyLink);

        main.append(infoBox);
        main.append(buyButton);

        panel.append(main);
    }
};
game.upgrades.hide = () => { // todo
    let a = document.getElementById('upgrades-checkbox');
    if (a.checked === true) {
        for (let i = 0; i < g.u.list.length; i++) {
            let obj = g.u.list[i];
            if (g.u.owned[obj.name] === true)
                document.getElementById("upgrades-row-" + i).style.display = 'block';
        }
    } else {
        for (let i = 0; i < g.u.list.length; i++) {
            let obj = g.u.list[i];
            if (g.u.owned[obj.name] === true)
                document.getElementById("upgrades-row-" + i).style.display = 'none';
        }
    }
};
game.upgrades.check = () => {
    for (let i = 0; i < g.u.list.length; i++) {
        let obj = g.u.list[i];
        if (g.u.owned[obj.name] === true) {
            let upgradeBTN = document.getElementById("upgrades-btn-" + i);
            upgradeBTN.setAttribute('onclick', '');
            upgradeBTN.classList.replace('btn-primary', 'btn-success');
            upgradeBTN.innerHTML = 'Owned';
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

    new g.u.create("Hydrogen Manufacture", "Auto Hydrogen=clicks", {amount: 2000, type: 'Hydrogen'}, () => {
        for (let i = 0; i < g.b.multiplier.length; i++) {
            game.builds.multiplier[i] *= game.ressources.perClick.Hydrogen.amount;
            game.builds.update();
        }
    }, () => {
        return g.u.owned["Hydrogen III"];
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