const debug = {};

debug.protonChain = (a, b) => {
    const containsAll = (arr1, arr2) => arr2.every(arr2Item => arr1.includes(arr2Item));
    const sameMembers = (arr1, arr2) => containsAll(arr1, arr2) && containsAll(arr2, arr1);
    
    const testCases = [
        {q:  1.442, string: "Proton + Proton => Deuterium + 1,442 MeV", a: {i: Isotope.Hydrogen(), e: 1.442}, b: {i: Isotope.Hydrogen(), e: 0}, result:[ "Deuterium"]},
        {q: 4.98, string: "Deuterium + Proton => Helium-3 + 4.98 MeV", a: {i: Isotope.Deuterium(), e: 5.50}, b: {i: Isotope.Hydrogen(), e: 0}, result:["Helium"]},
        {q: 12.87, string: "Helium-3 + Helium-3 => Helium + 2Protons + 12.86MeV", a: {i: new Isotope(2, 1), e: 12.87}, b: {i: new Isotope(2, 1), e: 3},result:["Hydrogen", "Helium", "Hydrogen"]},
        {q: 3.27, string: "Deuterium + Deuterium => Helium-3 + Neutron + 3.27MeV", a: {i:  Isotope.Deuterium(), e: 3.3}, b: {i:  Isotope.Deuterium(), e: 0}},
        {q: 4.03, string: "Deuterium + Deuterium => Helium-3 + Proton + 4.03MeV", a: {i:  Isotope.Deuterium(), e: 4.1}, b: {i:  Isotope.Deuterium(), e: 0}},
        {q: 17, string: "Deuterium + Tritium => Helium + neutron + 17MeV", a: {i:  Isotope.Deuterium(), e: 17}, b: {i:  Isotope.Tritium(), e: 0},result:[ "Helium","Neutron"]},
        {q: 22.2, string: "Deuterium + Lithium => Helium + Helium + 22.2MeV", a: {i:  new Isotope(3, 3), e: 22.2}, b: {i:  Isotope.Deuterium(), e: 0}, result:["Helium", "Helium"]},
        {q: 4.8, string: "Neutron + Lithium => Hydrogen + Helium + 4.8MeV", a: {i: new Neutron(), e: 10000}, b: {i:  new Isotope(3, 3), e: 0}, result:["Hydrogen", "Helium"]},
    ];
    testCases.forEach((testCase, i) => {
       
        const output = Isotope.fuseIsotopes(testCase.a.i, testCase.b.i, testCase.a.e, testCase.b.e);
        const map = output.resultIsotopes.map((a) => a.name);
        const Qdiff = Math.abs(output.Q - testCase.q);
        let color = Qdiff<=0.2?'color: #000000':'color: #ff0000';
        console.log('test #' + i + " " + testCase.string+ " %c"+output.Q, color);
        if (testCase.result === undefined) {
            console.log(output, output.resultIsotopes.map((a) => a.name));
        } else {
            if (sameMembers(map, testCase.result)) {
                console.log(output);
            } else {
                console.log(output, output.resultIsotopes.map((a) => a.name));
            }
        }
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