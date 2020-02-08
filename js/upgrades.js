g.upgrades = g.u = {};
g.u.owned = {};

game.upgrades.create = function (name, desc, price, boughtFunction, dependsOn = undefined) {
    this.name = name.replace(/ /g,"_");
    this.displayName = name;
    this.desc = desc;

    if (!Array.isArray(price)) {
        price = [price];
    }
    this.price = {
        checkResources: () => {
            for (let i = 0; i < price.length; i++) {
                if (g.ressources.owned[price[i].type] < price[i].amount) {
                    return false;
                }
            }
            return true;

        },
        pay: () => {
            for (let i = 0; i < price.length; i++) {
                g.ressources.owned[price[i].type] -= price[i].amount;
            }
        },
        costString: helpers.genCostString(price)
    };
    
    this.boughtFunction = boughtFunction;
    this.depends = dependsOn;

    this.buyable = () => {
        let dependency = true;
        if (this.depends !== undefined) {
            dependency = this.depends();
        }
        
        return dependency && this.price.checkResources() && g.u.owned[this.name] === false;
    };
};

game.upgrades.buy = (thing) => {
    let obj = thing;
    if (typeof (thing) === "string") {
        obj = g.u.list[thing];
    }

    if (obj.buyable()) {
        obj.price.pay();
        obj.boughtFunction();
        g.u.owned[obj.name] = true;
        g.buttons();
        g.status();

        let upgradeBTN = document.getElementById("upgrades-btn-" + obj.name);
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
        paragraph.innerHTML = obj.displayName + " : " + obj.desc + "<br>" + obj.price.costString;
        infoBox.append(paragraph);

        let buyButton = document.createElement("div");
        buyButton.setAttribute('class', 'col-md-4');
        let buyLink = document.createElement("a");
        buyLink.id = 'upgrades-btn-' + obj.name;
        buyLink.setAttribute('class', 'btn btn-primary btn-block');
        buyLink.setAttribute('type', 'button');
        buyLink.onclick = () => {
            g.u.buy(obj);
        };
        buyLink.innerHTML = 'Buy upgrade';
        obj.buylink = buyLink;


        buyButton.append(buyLink);
        main.append(infoBox);
        main.append(buyButton);
        panel.append(main);
    }
};
game.upgrades.checkBuyStatus = function () {
    for (let i = 0; i < g.u.list.length; i++) {
        let obj = g.u.list[i];
        if (obj.buyable()) {
            obj.buylink.removeAttribute('disabled');
            obj.buylink.classList.remove('disabled');
        }else{
            obj.buylink.setAttribute('disabled','disabled');
            obj.buylink.classList.add('disabled');
        }
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