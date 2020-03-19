var helpers = h = {};

helpers.capitalizeFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
helpers.removeCursor = function () {
    $(".typed-cursor").remove();
};
helpers.earnRessource = function (type, src) {
    let str = h.capitalizeFirstLetter(type);
    let windowGame = window["game"].resources;
    windowGame.owned[str] += src;
    windowGame.total[str] += src;
};
helpers.maxCells = function () {
    return Math.floor(g.resources.owned.Water * g.cellsPerWater);
};
helpers.cellsMeat = function () {
    return g.resources.owned.Cells * g.cellMeat;
};
helpers.formatName = function (name) {
    return name.replace(/ /g, '_');
};