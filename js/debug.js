const debug={};

debug.builds = () => {
    game.builds.list.forEach((b) => {
        b.visible = true;
    });
    game.builds.update();
};

debug.money = (value = 1000000) => {
    Object.keys(game.resources.owned).forEach((r) => {
        game.resources.owned[r] += value;
    });
};