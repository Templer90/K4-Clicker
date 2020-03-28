const debug = {};

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
debug.dev = (value = undefined) => {
    if (value === undefined) {
        value = '';
    }
    localStorage.setItem(save.devKey, value);
};

debug.noDev = () => {
    localStorage.removeItem(save.devKey);
};