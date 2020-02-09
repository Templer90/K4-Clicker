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
            price.forEach((p) => {
                g.ressources.owned[p.type] -= p.amount;
            });
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
    g.u.list.forEach((obj, i) => {
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
        obj.mainDiv=main;

        buyButton.append(buyLink);
        main.append(infoBox);
        main.append(buyButton);
        panel.append(main);
    });
};
game.upgrades.checkBuyStatus = function () {
    g.u.list.forEach((obj, i) => {
        if (obj.buyable()) {
            obj.buylink.removeAttribute('disabled');
            obj.buylink.classList.remove('disabled');
        }else{
            obj.buylink.setAttribute('disabled','disabled');
            obj.buylink.classList.add('disabled');
        }
    });
};
game.upgrades.hide = () => {
    let funcHide = (obj, i) => {
        obj.mainDiv.style.display = 'none';
    };
    let funcShow = (obj, i) => {
        obj.mainDiv.style.display = 'block';
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
            let upgradeBTN =  obj.mainDiv.getElementById("upgrades-btn-" + i);
            upgradeBTN.setAttribute('onclick', '');
            upgradeBTN.classList.replace('btn-primary', 'btn-success');
            upgradeBTN.innerHTML = 'Owned';
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