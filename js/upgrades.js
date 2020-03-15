g.upgrades = g.u = {};
g.u.owned = {};

game.upgrades.buy = (thing) => {
    let upgrade = thing;
    if (typeof (thing) === 'string') {
        upgrade = g.u.list[thing];
    }

    if (upgrade.buyable()) {
        upgrade.pay();
        upgrade.boughtFunction(upgrade);
        upgrade.finishBuy();
        
        g.buttons();
        g.status();

        if (g.u.owned[upgrade.name] === true) {
            let upgradeBTN = document.getElementById('upgrades-btn-' + upgrade.name);
            upgradeBTN.remove();
            g.u.hide();
            game.builds.update();
        }
    }
};

game.upgrades.init = () => {
    let panel = document.getElementById('upgrades-panelbody');
    g.u.list.forEach((upgrade, i) => {
        upgrade.index = i;
        g.u.list[upgrade.name] = upgrade;
        g.u.owned[upgrade.name] = false;

        panel.append(upgrade.getHTML());
        upgrade.setVisibility(true);
    });
};
game.upgrades.checkBuyStatus = () => {
    g.u.list.forEach((upgrade, i) => {
        if (upgrade.buyable()) {
            upgrade.buylink.removeAttribute('disabled');
            upgrade.buylink.classList.remove('disabled');
        } else {
            if( upgrade.buylink===undefined)debugger;
            upgrade.buylink.setAttribute('disabled', 'disabled');
            upgrade.buylink.classList.add('disabled');
        }
    });
};
game.upgrades.search = (searchBox) => {
    const input = searchBox.value.trim().toUpperCase();

    if (input === '') {
        g.u.list.forEach((upgrade) => {
            upgrade.setVisibility(true);
        });
        game.upgrades.hide();
    } else {
        const regex = new RegExp(`.*${input}.*`, 'g');

        g.u.list.forEach((upgrade) => {
            const infoString = upgrade.name + ',' + upgrade.tags + ',' + Object.keys(upgrade.price).toString();
            if (regex.exec(infoString.toUpperCase())) {
                upgrade.setVisibility(true);
            } else {
                upgrade.setVisibility(false);
            }
        });
    }
};
game.upgrades.hide = () => {
    let funcHide = (upgrade) => {
        upgrade.setVisibility(false);
    };
    let funcShow = (upgrade) => {
        upgrade.setVisibility(true);
    };
    let func = funcHide;
    if (document.getElementById('upgrades-checkbox').checked === true) {
        func = funcShow;
    }

    g.u.list.forEach((upgrade) => {
        upgrade.setVisibility(true);
    });
    g.u.list.filter((upgrade) => g.u.owned[upgrade.name] === true ).forEach(func);
    //g.u.list.forEach(func);
};
game.upgrades.updateCost = () => {
    g.u.list.forEach((upgrade) => {
        upgrade.updateCostStyle();
    });
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
    g.u.list.forEach((upgrade, i) => {
        if (g.u.owned[upgrade.name] === true) {
            let upgradeBTN = document.getElementById('upgrades-btn-' + upgrade.name);
            upgradeBTN.remove();
        }
        upgrade.updateCostStyle();
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
        .filter((upgrade) => (upgrade instanceof MultiUpgrade) && (typeof g.u.owned[upgrade.name] === 'number'))
        .forEach((upgrade) => {
            upgrade.updateDots()
        });
};