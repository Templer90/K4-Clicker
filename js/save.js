const save = {};
save.key = "K4Clicker_Save";
save.devKey = "K4Clicker_Save_Dev";

save.saveData = function () {
    console.info("Game saved. (Auto-save every " + (g.options.saveIntervalTime / 1000) + " seconds)");
    localStorage.setItem(save.key, JSON.stringify({
        game: game.save(),
        upgrades: game.upgrades.save(),
        builds: game.builds.save(),
        collider: game.collider.save(),
        achievements: game.achievements.save()
    }));
};
save.removeData = function () {
    g.saveInterval = undefined;
    localStorage.removeItem(save.key);
    location.reload();
};
save.loadData = function () {
    if (localStorage.getItem(save.key) === null) {
        console.warn("No save found!");
    } else {
        let saveGame = JSON.parse(localStorage.getItem(save.key));
        let sg = saveGame.game;

        if (sg.options.version !== g.options.version) {
            console.warn('Warning : loading save from an older version.');
        }

        game.load(saveGame.game);
        game.upgrades.load(saveGame.upgrades);
        game.collider.load(saveGame.collider);
        game.builds.load(saveGame.builds);
        game.achievements.load(saveGame.achievements);
    }
};

save.checkSave = function () {
    if (typeof g.b.multiplier !== "object") {
        g.b.multiplier = [];
        for (let i = 0; i < g.b.list.length; i++) {
            g.b.multiplier.push(1);
        }
    }
    if (g.resources.owned[4] > h.maxCells()) {
        g.resources.owned[4] = h.maxCells();
        alert('Bug exploit used, number of cells reduced.');
    }
};