var helpers = h = {};

helpers.capitalizeFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
helpers.removeCursor = function () {
    $(".typed-cursor").remove();
};
helpers.earnRessource = function (type, src) {
    let str = h.capitalizeFirstLetter(type);
    let windowGame = window["game"].ressources;
    windowGame.owned[str] += src;
    windowGame.total[str] += src;
};
helpers.maxCells = function () {
    return Math.floor(g.ressources.owned.Water * g.cellsPerWater);
};
helpers.cellsMeat = function () {
    return g.ressources.owned.Cells * g.cellMeat;
};
helpers.buildReward = function (i) {
    return (g.b.list[i].reward * g.b.owned[i]) * g.b.multiplier[i];
};
helpers.genCostString = function (price) {
    if (!Array.isArray(price)) {
        price = [price];
    }

    let costString = 'Cost: ';
    for (let i = 0; i < price.length - 1; i++) {
        costString += fix(price[i].amount, 0) + " " + price[i].type.toLowerCase() + " & ";
    }
    costString += fix(price[price.length - 1].amount, 0) + " " + price[price.length - 1].type.toLowerCase();
    return costString;
};