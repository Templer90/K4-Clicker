var game = g = {};

g.options = {};
g.options.devMode = true;
g.options.fps = 60;
g.options.saveIntervalTime = 10000;
g.options.interval = (1000 / g.options.fps);
g.options.init = false;
g.options.before = new Date().getTime();
g.options.now = new Date().getTime();
g.options.version = "0.001 Alpha";

g.ressources = {};
g.ressources.list = ["Hydrogen", "Oxygen", "Helium", "Water", "Cells", "Meat", "Sun", "Atmosphere Generator", ""];
g.ressources.perClick = {};
g.ressources.owned = {};
g.ressources.total = {};

g.cellsPerWater = 10;
g.cellMeat = 0.1;
g.cellCost = 5;

g.buyMultiplier = 1;

g.username = undefined;

// CORE FUNCTIONS
game.init = function () {
    g.ressources.init();
    g.upgrades.init();
    g.builds.init();

    save.loadData();
    save.checkSave();

    g.devMode();
    g.builds.checkSave();
    g.upgrades.checkSave();
    g.tutorial.saveCheck();
    g.upgrades.check();
    g.upgrades.hide();
    g.builds.update();
    g.buttons();

    if (g.t.intro5.check !== true)
        g.tutorial.intro();

    $('[data-toggle="tooltip"]').tooltip();
    $('.header-small').html(g.options.version);

    g.options.init = true;
};
game.display = function () {
    $("#ressources-display").html(
        "Hydrogen : " + fix(g.ressources.owned.Hydrogen, 0) + "<br>" +
        "Oxygen : " + fix(g.ressources.owned.Oxygen, 0) + "<br>" +
        "Helium : " + fix(g.ressources.owned.Helium, 0) + "<br>" +
        "Water : " + fix(g.ressources.owned.Water, 0) + " mL<br>" +
        "Meat : " + fix(g.ressources.owned.Meat, 2) + "<br>" +
        "Cells : " + fix(g.ressources.owned.Cells, 0) + "/" + fix(h.maxCells(), 0)
    );
};
game.buttons = function () {
    $("#btn-1-1").html("Create hydrogen (+" + fix(g.ressources.perClick.Hydrogen.amount, 0) + ")");
    $("#btn-1-2").html("Create oxygen (+" + fix(g.ressources.perClick.Oxygen.amount, 0) + ")");
    $("#btn-1-3").html("Create helium (+" + fix(g.ressources.perClick.Helium.amount, 0) + ")");
    
    let waterButton = $("#btn-2-1");
    waterButton.html("Generate water (+" + fix(g.ressources.perClick.Water.amount * g.buyMultiplier, 0) + " mL)");
    waterButton.attr('data-original-title', 'Cost ' + fix((20 * g.buyMultiplier), 0) + ' hydrogen, ' + fix((10 * g.buyMultiplier), 0) + ' oxygen');
    
    let cellButton = $("#btn-3-1");
    cellButton.html("Generate cell (+" + fix(g.ressources.perClick.Cells.amount * g.buyMultiplier, 0) + ")");
    cellButton.attr('data-original-title', 'Cost ' + fix((g.cellCost * g.buyMultiplier), 0) + ' helium');

    if (g.ressources.owned.Sun === 1){
        $("#btn-3-2").css('display', 'none');
    }
    if (g.ressources.owned["Atmosphere Generator"] === 1){
        $("#btn-3-3").css('display', 'none');
    }
};
game.loop = function () {
    if (g.options.init === true) {
        g.options.now = new Date().getTime();
        let elapsedTime = (g.options.now - g.options.before);
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
game.ressources.init = function () {
    for (let i = 0; i < g.ressources.list.length; i++) {
        let resource = g.ressources.list[i];
        g.ressources.owned[resource] = 0;
        g.ressources.total[resource] = 0;
        g.ressources.perClick[resource] = {
            amount: 100,
            can: function (owned) {
                return true;
            },
            click: function (owned) {
                owned[resource] += this.amount;
                return this.amount;
            }
        };
    }
    
    g.ressources.perClick.Water = {
        amount: 1,
        can: function (owned) {
            return owned.Hydrogen >= 20 * g.buyMultiplier && owned.Oxygen >= 10 * g.buyMultiplier;
        },
        click: function (owned) {
            this.amount = 0;
            if (g.buyMultiplier > 1) {
                for (let i = 0; i < g.buyMultiplier; i++) {
                    if (owned.Hydrogen >= 20 && owned.Oxygen >= 10) {
                        owned.Hydrogen -= 20;
                        owned.Oxygen -= 10;
                        owned.Water++;
                        this.amount++;
                    }
                }
            } else {
                owned.Hydrogen -= 20;
                owned.Oxygen -= 10;
                owned.Water++;
                this.amount++;
            }
        }
    };

    g.ressources.perClick.Sun = {
        amount: 1,
        can: function (owned) {
            return owned.Hydrogen >= 75 && owned.Water >= 15 && owned.Oxygen >= 10 && owned.Sun === 0;
        },
        click: function (owned) {
            owned.Sun = 1;
            owned.Hydrogen -= 75;
            owned.Water -= 15;
            owned.Oxygen -= 10;
            $("#btn-3-2").fadeOut('slow', function () {
                $("#btn-3-2, .tooltip").remove();
            });
        }
    };

    g.ressources.perClick["Atmosphere Generator"] = {
        amount: 1,
        can: function (owned) {
            return owned.Hydrogen >= 150 && owned.Oxygen >= 100 && owned.Water >= 50 && owned["Atmosphere Generator"] === 0;
        },
        click: function (owned) {
            owned["Atmosphere Generator"] = 1;
            owned.Hydrogen -= 150;
            owned.Oxygen -= 100;
            owned.Water -= 50;
            $("#btn-3-3, .tooltip").fadeOut('slow', function () {
                $("#btn-3-3, .tooltip").remove();
            });
        }
    };

    g.ressources.perClick.Cells = {
        amount: 1,
        can: function (owned) {
            return owned.Cells + g.buyMultiplier <= h.maxCells() && owned.Water >= g.cellCost * g.buyMultiplier;
        },
        click: function (owned) {
            if (g.buyMultiplier > 1) {
                for (let i = 0; i < g.buyMultiplier; i++) {
                    if (owned.Water >= g.cellCost) {
                        owned.Cells++;
                        owned.Water -= g.cellCost;
                    }
                }
            } else {
                owned.Cells++;
                owned.Water -= g.cellCost;
            }
        }
    };
    
};

// GAME FUNCTIONS
game.earn = function (type) {
    const a = g.ressources.owned;
    const str = h.capitalizeFirstLetter(type);
    if (g.ressources.perClick[str].can(g.ressources.owned)) {
        g.ressources.perClick[str].click(g.ressources.owned)
    }
 
    if (g.t.fast.check === true) {

    } else {
        g.t.check();
    }
};
game.cellsEarn = function (times) {
    g.ressources.owned.Meat += (h.cellsMeat() * times) / g.options.fps;
};
game.changeBuy = function () {
    if (g.buyMultiplier === 1) {
        g.buyMultiplier = 10;
    } else if (g.buyMultiplier === 10) {
        g.buyMultiplier = 100;
    } else if (g.buyMultiplier === 100) {
        g.buyMultiplier = 1000;
    } else if (g.buyMultiplier === 1000) {
        g.buyMultiplier = 1;
    }
    
    $("#btn-buy-multiplier").html("Buy x" + fix(g.buyMultiplier, 0));
    game.buttons();
};
game.devMode = function () {
    if (g.options.devMode === true) {
        console.warn("Dev mode enabled!");
        g.t.fast.check = true;
    }
};

// INTERVALS + ONLOAD
window.onload = function () {
    g.init();
};
g.coreLoop = window.setInterval(function () {
    g.loop();
}, g.options.interval);
g.saveInterval = window.setInterval(function () {
    //save.saveData();
}, g.options.saveIntervalTime);