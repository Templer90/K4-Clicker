const debug = {};

debug.protonChain = (a, b) => {
    console.log("Proton + Proton => Deuterium 1,442 MeV");
    const deuterium = Isotope.fuseIsotopes(Isotope.Hydrogen(), Isotope.Hydrogen(), 1, 1);
    console.log(deuterium, deuterium.resultIsotopes.map((a) => a.name));
    console.log("Deuterium + Proton => Helium-3 5,49 MeV");
    const helium3 = Isotope.fuseIsotopes(Isotope.Hydrogen(), Isotope.Deuterium(), a, b);
    console.log(helium3, helium3.resultIsotopes.map((a) => a.name));

    console.log("Helium-3 + Helium-3 => Helium + 2Protons");
    const helium = Isotope.fuseIsotopes(new Isotope(2, 1), new Isotope(1, 0), 1,1);
    console.log(helium, helium.resultIsotopes.map((a) => a.name))
};

debug.builds = () => {
    game.builds.list.forEach((b) => {
        b.visible = true;
    });
    game.builds.update();
};
debug.money = (value = 10e12) => {
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