var helpers = h = {};

helpers.capitalizeFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
helpers.removeCursor = function () {
    $(".typed-cursor").remove();
};
helpers.earnRessource = function (type, src) {
    var str = h.capitalizeFirstLetter(type);
    let windowGame = window["game"].ressources;
    windowGame.owned[str] += src;
    windowGame.total[str] += src;
};
helpers.maxCells = function () {
    return Math.floor(g.ressources.owned[3] * g.cellsPerWater);
};
helpers.cellsMeat = function () {
    return g.ressources.owned[4] * g.cellMeat;
};
helpers.buildPrice = function (i) {
    return (g.b.list[i].price * Math.pow(g.b.list[i].inflation, g.b.owned[i]));
};
helpers.buildReward = function (i) {
    return (g.b.list[i].reward * g.b.owned[i]) * g.b.multiplier[i];
};