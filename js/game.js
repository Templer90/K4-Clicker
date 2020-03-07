const game = g = {};

g.gameName = 'Element Clicker';
g.options = {};
g.options.devMode = true;
g.options.fps = 60;
g.options.hold = 100;
g.options.saveIntervalTime = 10000;
g.options.interval = (1000 / g.options.fps);
g.options.init = false;
g.options.before = new Date().getTime();
g.options.now = new Date().getTime();
g.options.version = "0.001 Alpha";

g.resources = {};
g.resources.special = ["Energy", "Collider", "Water", "Cells", "Meat", "Sun", "Atmosphere Generator"];
g.resources.perClick = {};
g.resources.owned = {};
g.resources.total = {};

g.cellsPerWater = 10;
g.cellMeat = 0.1;
g.cellCost = 5;

g.buyMultiplier = 1;

g.username = undefined;
g.currentTab = 'stash';
g.holding = [];

// CORE FUNCTIONS
game.init = () => {
    elements.init();
    g.resources.init();
    g.upgrades.init();
    g.collider.init();
    g.builds.init();
    
    const stashWell = document.getElementById("stash-well");
    elements.list.forEach((element) => {
        const div = document.createElement("div");

        const h = document.createElement("h6");
        h.className = 'panel-heading';
        div.append(h);

        const a = document.createElement("a");
        a.id = "link-" + element.name;
        a.className = 'collapsed';
        a.dataset.toggle = "collapse";
        a.dataset.target = "#element-" + element.name;
        $(a).collapse();
        element.stashLink = a;
        h.append(a);

        const divPanel = document.createElement("div");
        divPanel.id = "element-" + element.name;
        divPanel.className = 'panel-collapse collapse stash-panel';
        divPanel.dataset.oldValue = -1;
        element.stashPanel = divPanel;
        div.append(divPanel);

        stashWell.append(div);
    });

    save.loadData();
    save.checkSave();

    g.devMode();
    g.builds.checkSave();
    g.upgrades.checkSave();
    g.tutorial.checkSave();

    g.c.emitters.calcTrajectory();
    g.c.compileStatistics();
    
    g.upgrades.check();
    g.upgrades.hide();
    
    g.collider.update();
    g.builds.update();
    g.buttons();

    if ( game.t.counter !== game.t.list.length) {
        game.tutorial.tutorial();
    }

    if (g.options.hold !== 100) {
        game.addHoldingFunction();
    }
    document.getElementById('holdIntervalSlider').value = game.options.hold;
    game.changeHoldInterval();

    Array.from(document.querySelectorAll('[data-toggle="tooltip"]')).forEach((obj) => {
        $(obj).tooltip();
    });

    const nameElement = document.getElementById('game-name');
    nameElement.innerHTML = nameElement.innerHTML.replace('[name]', g.gameName);
    document.getElementById('game-version').innerHTML = g.options.version;
    
    const saveInterval = game.options.saveIntervalTime / 1000;
    document.getElementById("saveIntervalSlider").value = saveInterval;
    document.getElementById("intervalText").innerHTML = "The game autosaves every " + saveInterval + " seconds.";

    //Workaround because bootstrap has a bug
    $('#menu a').click((function (e) {
        e.preventDefault();
        $(this).tab('show');
    }));

    $('a[data-toggle="tab"]').on('shown.bs.tab', ((e) => {
        game.currentTab = e.target.hash.substring(1);
    }));

    g.options.init = true;
};
game.clearHolding = () => {
    game.holding.forEach((i) =>
        window.clearInterval(i)
    );
    game.holding = [];
};
game.addHoldingFunction = () => {
    game.clearHolding();
    game.removeHoldingFunction();
    $(".multiClickable").each(function (index, item) {
        $(item).on('mousedown', () => {
            game.holding.push(window.setInterval(() => {
                item.click();
            }, game.options.hold));
        }).on('mouseup mouseleave', () => {
            game.clearHolding();
        });
    });
};
game.removeHoldingFunction = () => {
    game.clearHolding();

    $(".multiClickable").each(function (index, item) {
        $(item).off('mousedown').off('mouseup mouseleave');
    });
};
game.display = () => {
    document.getElementById("resources-display").innerHTML =
        "Energy : " + numbers.fix(g.resources.owned.Energy, 0) + "<br>" +
        "Hydrogen : " + numbers.fix(g.resources.owned.Hydrogen, 0) + "<br>" +
        "<br>" +
        "Water : " + numbers.fix(g.resources.owned.Water, 0) + " mL<br>" +
        "Meat : " + numbers.fix(g.resources.owned.Meat, 2) + "<br>" +
        "Cells : " + numbers.fix(g.resources.owned.Cells, 0) + "/" + numbers.fix(h.maxCells(), 0);

    g.displayHorde();
};
game.buttons = () => {
    Array.from(document.getElementsByClassName("genResource")).forEach(
        (element) => {
            element.innerHTML = element.dataset.template.replace('[number]', numbers.fix(g.resources.perClick[element.dataset.element].amount, 0));
        }
    );

    document.getElementById("btn-collider").html = "Run Collider";

    const waterButton = $("#btn-2-1");
    waterButton.html("Generate water (+" + numbers.fix(g.resources.perClick.Water.amount * g.buyMultiplier, 0) + " mL)");
    waterButton.attr('data-original-title', 'Cost ' + numbers.fix((20 * g.buyMultiplier), 0) + ' hydrogen, ' + numbers.fix((10 * g.buyMultiplier), 0) + ' oxygen');

    const cellButton = $("#btn-3-1");
    cellButton.html("Generate cell (+" + numbers.fix(g.resources.perClick.Cells.amount * g.buyMultiplier, 0) + ")");
    cellButton.attr('data-original-title', 'Cost ' + numbers.fix((g.cellCost * g.buyMultiplier), 0) + ' energy');

    if (g.resources.owned.Sun === 1) {
        document.getElementById("btn-3-2").style.setProperty('display', 'none');
    }
    if (g.resources.owned["Atmosphere Generator"] === 1) {
        document.getElementById("btn-3-3").style.setProperty('display', 'none');
    }
};
game.loop = () => {
    if (g.options.init === true) {
        g.options.now = new Date().getTime();
        const elapsedTime = (g.options.now - g.options.before);
        if (elapsedTime > g.options.interval) {
            g.b.earn(Math.floor(elapsedTime / g.options.interval));
            g.cellsEarn(Math.floor(elapsedTime / g.options.interval))
        } else {
            g.b.earn(1);
            g.cellsEarn(1);
        }
        g.options.before = new Date().getTime();
        g.display();
    }
};
game.status = () => {
    if (g.t.done === false) {
        g.t.check();
    }
    
    g.upgrades.checkBuyStatus();
    g.builds.checkBuyStatus();
};

game.resources.init = () => {
    //Set up the  Proxy for the total Atoms Count
    g.resources.owned = new Proxy({}, {
        set: function (target, prop, value /*,receiver*/) {
            g.resources.total[prop] += (value - target[prop] > 0) ? (value - target[prop]) : 0;
            target[prop] = value;
            return true;
        }
    });
    
    //Add the normals
    elements.list.forEach((resource) => {
        g.resources.owned[resource.name] = 0;
        g.resources.total[resource.name] = 0;
        g.resources.perClick[resource.name] = {
            amount: g.options.devMode ? 100 : 1,
            can: () => {
                return true;
            },
            click: function (owned, multi) {
                owned[resource.name] += this.amount * multi;
                return owned[resource];
            }
        };
    });

    //Add the specials
    game.resources.special.forEach((resource) => {
        g.resources.owned[resource] = 0;
        g.resources.total[resource] = 0;
        g.resources.perClick[resource] = {
            amount: g.options.devMode ? 100 : 1,
            can: () => {
                return true;
            },
            click: function (owned, multi) {
                owned[resource] += this.amount * multi;
                return owned[resource];
            }
        };
    });

    game.resources.specialInit();
};

// GAME FUNCTIONS
game.earn = function (type, multi = 1) {
    const str = h.capitalizeFirstLetter(type);
    if (g.resources.perClick[str].can(g.resources.owned, multi)) {
        g.resources.perClick[str].click(g.resources.owned, multi)
    }

    if (g.t.done === true) {

    } else {
        g.t.check();
    }
};
game.cellsEarn = function (times) {
    g.resources.owned.Meat += (h.cellsMeat() * times) / g.options.fps;
};
game.changeBuy = () => {
    if (g.buyMultiplier === 1) {
        g.buyMultiplier = 10;
    } else if (g.buyMultiplier === 10) {
        g.buyMultiplier = 100;
    } else if (g.buyMultiplier === 100) {
        g.buyMultiplier = 1000;
    } else if (g.buyMultiplier === 1000) {
        g.buyMultiplier = 1;
    }

    $("#btn-buy-multiplier").html("Buy x" + numbers.fix(g.buyMultiplier, 0));
    game.buttons();
};
game.devMode = () => {
    if (g.options.devMode === true) {
        console.warn("Dev mode enabled!");
        g.t.done = true;
    }
};
game.changeSaveInterval = () => {
    let val = document.getElementById('saveIntervalSlider').value;

    document.getElementById('intervalText').innerHTML = "The game autosaves every " + val + " seconds.";
    game.options.saveIntervalTime = val * 1000;
    window.clearInterval(game.saveInterval);

    game.saveInterval = window.setInterval(() => {
        save.saveData();
    }, game.options.saveIntervalTime);
};
game.save = () => {
    let res = {
        owned: g.resources.owned,
        click: g.resources.perClick,
        total: g.resources.total
    };
    g.options.hold = document.getElementById('holdIntervalSlider').value;
    return {
        options: game.options,
        tutorial: game.tutorial.counter,
        resources: res
    };
};
game.load = (saveObj) => {
    game.options = saveObj.options;
    document.getElementById('holdIntervalSlider').value = game.options.hold;
    game.changeHoldInterval();

    Object.keys(saveObj.resources.owned).forEach((key)=>{
        g.resources.owned[key] = saveObj.resources.owned[key];
    });
    
    Object.keys(saveObj.resources.click).forEach((obj) => {
        let params = saveObj.resources.click[obj];
        Object.keys(params).forEach((param) => {
            g.resources.perClick[obj][param] = params[param];
        });
    });

    g.resources.total = saveObj.resources.total;
    g.tutorial.counter = saveObj.tutorial;
};
game.changeHoldInterval = () => {
    let val = document.getElementById('holdIntervalSlider').value;
    if (val >= 90) {
        document.getElementById('holdIntervalSlider').value = 100;
        g.removeHoldingFunction();
        document.getElementById("holdText").innerHTML = "No Holdig";
    } else {
        g.options.hold = val;
        g.addHoldingFunction();
        document.getElementById("holdText").innerHTML = "Click every 1/" + val + "sec";
    }
};
game.displayHorde = () => {
    if (game.currentTab !== 'stash') return;
   // let text = "Energy".padEnd(13, String.fromCharCode(160)) + ": " + numbers.fix(g.resources.owned.Energy, 0) + "<br>";

    let list = elements.list;

    list.forEach((element) => {
        if (element.symbol === 'n') return;
        //This is correct, because I want to type coerce
        if (element.stashPanel.dataset.oldValue.toString() === g.resources.owned[element.name].toString()) return;
        const rawNumber = Math.round(g.resources.owned[element.name]);
        const total =  Math.round(g.resources.total[element.name]);
        const line = element.name.padEnd(13, String.fromCharCode(160)) + ": " + numbers.element(rawNumber);
        const avogadro = rawNumber / elements.avogadro;

        element.stashLink.innerHTML = line;
        element.stashPanel.innerHTML =
            numbers.zeroPad(rawNumber, 22) + " Atoms<br>"
            + numbers.zeroPad(total, 22) + " Total Atoms created<br>"
            + numbers.beautify(avogadro, 20) + " mol";
        element.stashPanel.dataset.oldValue = g.resources.owned[element.name];
    });
};

// INTERVALS + ONLOAD
window.onload = () => {
    let fragments = $("div[data-frag]");
    window.loadCounter = fragments.length;
    fragments.each((index, item) => {
        let jItem = $(item);
        jItem.load(jItem.data("frag"), null, () => {
            window.loadCounter--;
            if (window.loadCounter === 0) {
                window.loadCounter = null;
                g.init();
            }
        });
    });
};
g.coreLoop = window.setInterval(() => {
    g.loop();
}, g.options.interval);

g.statusLoop = window.setInterval(() => {
    g.status();
}, 500);
g.saveInterval = window.setInterval(() => {
    save.saveData();
}, g.options.saveIntervalTime);