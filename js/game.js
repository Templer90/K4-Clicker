var game = g = {};

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

g.ressources = {};
g.ressources.special = ["Energy", "Collider", "Water", "Cells", "Meat", "Sun", "Atmosphere Generator"];
g.ressources.perClick = {};
g.ressources.owned = {};
g.ressources.total = {};

g.cellsPerWater = 10;
g.cellMeat = 0.1;
g.cellCost = 5;

g.buyMultiplier = 1;

g.username = undefined;
g.holding = [];

// CORE FUNCTIONS
game.init = function () {
    g.ressources.init();
    g.upgrades.init();
    g.builds.init();
    g.collider.init();

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

    if (g.t.intro5.check !== true) g.tutorial.intro();

    if (g.options.hold !== 0) {
        game.addHoldingFunction();
    }

    $('[data-toggle="tooltip"]').tooltip();
    $('.header-small').html(g.options.version);

    let saveInterval = game.options.saveIntervalTime / 1000;
    $("#saveIntervalSlider").val(saveInterval);
    $("#intervalText").html("The game autosaves every " + saveInterval + " seconds.");


    //Workaround because bootstrap has a bug
    $('#menu a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    g.options.init = true;
};
game.clearHolding=function(){
    game.holding.forEach((i)=>
        window.clearInterval(i)
    );
    game.holding=[];
};
game.addHoldingFunction = function () {
    game.clearHolding();
    game.removeHoldingFunction();
    $(".multiClickable").each(function (index, item) {
        $(item).on('mousedown', () => {
            game.holding.push( window.setInterval(() => {
                item.click();
            }, game.options.hold));
        }).on('mouseup mouseleave', () => {
            game.clearHolding();
        });
    });
};
game.removeHoldingFunction = function () {
    game.clearHolding();
    
    $(".multiClickable").each(function (index, item) {
        $(item).off('mousedown').off('mouseup mouseleave');
    });
};
game.display = function () {
    $("#ressources-display").html(
        "Energy : " + fix(g.ressources.owned.Energy, 0) + "<br>" +
        "Hydrogen : " + fix(g.ressources.owned.Hydrogen, 0) + "<br>" +
        "<br>" +
        "Water : " + fix(g.ressources.owned.Water, 0) + " mL<br>" +
        "Meat : " + fix(g.ressources.owned.Meat, 2) + "<br>" +
        "Cells : " + fix(g.ressources.owned.Cells, 0) + "/" + fix(h.maxCells(), 0)
    );

    g.displayHorde();
};
game.buttons = function () {
    $("#btn-energy").html("Create Energy (+" + fix(g.ressources.perClick.Energy.amount, 0) + ")");
    $("#btn-hydrogen").html("Create Hydrogen (+" + fix(g.ressources.perClick.Hydrogen.amount, 0) + ")");
    $("#btn-collider").html("Run Collider");

    let waterButton = $("#btn-2-1");
    waterButton.html("Generate water (+" + fix(g.ressources.perClick.Water.amount * g.buyMultiplier, 0) + " mL)");
    waterButton.attr('data-original-title', 'Cost ' + fix((20 * g.buyMultiplier), 0) + ' hydrogen, ' + fix((10 * g.buyMultiplier), 0) + ' oxygen');

    let cellButton = $("#btn-3-1");
    cellButton.html("Generate cell (+" + fix(g.ressources.perClick.Cells.amount * g.buyMultiplier, 0) + ")");
    cellButton.attr('data-original-title', 'Cost ' + fix((g.cellCost * g.buyMultiplier), 0) + ' energy');

    if (g.ressources.owned.Sun === 1) {
        $("#btn-3-2").css('display', 'none');
    }
    if (g.ressources.owned["Atmosphere Generator"] === 1) {
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
game.status = function () {
    g.upgrades.checkBuyStatus();
    g.builds.checkBuyStatus();
};

game.ressources.init = function () {
    //Add the specials
    game.ressources.special.forEach((resource, i) => {
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
    });

    //Add the normals
    elements.list.forEach((resource, i) => {
        g.ressources.owned[resource.name] = 0;
        g.ressources.total[resource.name] = 0;
        g.ressources.perClick[resource.name] = {
            amount: 100,
            can: function (owned) {
                return true;
            },
            click: function (owned) {
                owned[resource.name] += this.amount;
                return this.amount;
            }
        };
    });

    g.ressources.perClick.Hydrogen.click = function (owned) {
        owned["Hydrogen"] += this.amount;
        owned["Deuterium"] += g.u.owned["Hydrogen_Isotopes"] * (0.000115 * g.ressources.perClick.Deuterium.amount * this.amount);
        return this.amount;
    };

    g.ressources.perClick.Collider = {
        amount: 1,
        can: function (owned) {
            let statistic = g.collider.statistic;

            if (statistic.unstable) return false;
            if (owned.Energy <= statistic.inputEnergy) return false;
            let found = statistic.inputElements.find((obj, i) => {
                return owned[obj.element] <= obj.value * this.amount;
            });

            return found === undefined;
        },
        click: function (owned) {
            let statistic = g.collider.statistic;

            owned.Energy -= statistic.inputEnergy;
            statistic.inputElements.forEach((obj, i) => {
                owned[obj.element] -= obj.value * this.amount;
            });
            statistic.outputElements.forEach((obj, i) => {
                owned[obj.element] += obj.value * this.amount;
            });

            return this.amount;
        }
    };

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

game.changeSaveInterval = function () {
    let val = document.getElementById('saveIntervalSlider').value;
    $("#intervalText").html("The game autosaves every " + val + " seconds.");
    game.options.saveIntervalTime = val * 1000;
    window.clearInterval(game.saveInterval);

    game.saveInterval = window.setInterval(() => {
        save.saveData();
    }, game.options.saveIntervalTime);
};

game.changeHoldInterval = function () {
    let val = document.getElementById('holdIntervalSlider').value;
    if (val > 90) {
        document.getElementById('holdIntervalSlider').value = 100;
        g.options.hold = 0;
        g.removeHoldingFunction();
        document.getElementById("holdText").innerHTML = "No Holdig";
    } else {
        g.options.hold = val;
        g.addHoldingFunction();
        document.getElementById("holdText").innerHTML = "Click every 1/" + val + "sec";
    }
};
g.displayHorde = function () {
    let text = "Energy".padEnd(13, String.fromCharCode(160)) + ": " + fix(g.ressources.owned.Energy, 0) + "<br>";
    elements.list.sort((a, b) => g.ressources.owned[b.name] - g.ressources.owned[a.name]).forEach((element) => {
        let value = g.ressources.owned[element.name];
        text += element.name.padEnd(13, String.fromCharCode(160)) + ": " + fix(value, 0) + "<br>";
    });
    document.getElementById("log-well").innerHTML = text;
};

// INTERVALS + ONLOAD
window.onload = function () {
    let fragments = $("div[data-frag]");
    window.loadCounter = fragments.length;
    fragments.each(function (index, item) {
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
    //save.saveData();
}, g.options.saveIntervalTime);