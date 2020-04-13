const debug = {};

debug.protonChain = (a, b) => {
    const testCases = [
        {string: "Proton + Proton => Deuterium + 1,442 MeV", a: {i: Isotope.Hydrogen(), e: 3.3}, b: {i: Isotope.Hydrogen(), e: 0}},
        {string: "Deuterium + Proton => Helium-3 + 5,49 MeV", a: {i: Isotope.Hydrogen(), e: 5.50}, b: {i: Isotope.Deuterium(), e: 0}},
        {string: "Helium-3 + Helium-3 => Helium + 2Protons + 12.86MeV", a: {i: new Isotope(2, 1), e: 12.87}, b: {i: new Isotope(2, 1), e: 3}},
        {string: "Deuterium + Deuterium => Helium-3 + Neutron + 3.27MeV", a: {i:  Isotope.Deuterium(), e: 1}, b: {i:  Isotope.Deuterium(), e: 1}},
        {string: "Deuterium + Deuterium => Helium-3 + Proton + 4.03MeV", a: {i:  Isotope.Deuterium(), e: 1}, b: {i:  Isotope.Deuterium(), e: 1}},
        {string: "Deuterium + Tritium => Helium + neutron + 17MeV", a: {i:  Isotope.Deuterium(), e: 17}, b: {i:  Isotope.Tritium(), e: 0}},
        {string: "Deuterium + Lithium => Helium + Helium + 22.2MeV", a: {i:  new Isotope(3, 3), e: 22.2}, b: {i:  Isotope.Deuterium(), e: 0}},
    ];
    testCases.forEach((testCase, i) => {
        console.log('test #' + i + " " + testCase.string);
        const output = Isotope.fuseIsotopes(testCase.a.i, testCase.b.i, testCase.a.e, testCase.b.e);
        console.log(output, output.resultIsotopes.map((a) => a.name));
    });
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