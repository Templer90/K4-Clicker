g.u.list = [
    new g.u.create("Hydrogen I", "Hydrogen/click x2", {amount: 10, type: 'Hydrogen'}, () => {
        game.ressources.perClick.Hydrogen.amount *= 2;
    }),
    new g.u.create("Hydrogen II", "Hydrogen/click x2", {amount: 75, type: 'Hydrogen'}, () => {
        game.ressources.perClick.Hydrogen.amount *= 2;
    }),
    new g.u.create("Hydrogen III", "Hydrogen/click x1.5", [{amount: 1000, type: 'Hydrogen'},{amount: 10, type: 'Oxygen'} ], () => {
        game.ressources.perClick.Hydrogen.amount *= 1.5;
    }),

    new g.u.create("Hydrogen Manufacture", "Auto Hydrogen=clicks", {amount: 2000, type: 'Hydrogen'}, () => {
        for (let i = 0; i < g.b.multiplier.length; i++) {
            game.builds.multiplier[i] *= game.ressources.perClick.Hydrogen.amount;
            game.builds.update();
        }
    }, () => {
        return g.u.owned["Hydrogen_III"];
    }),

    new g.u.create("Oxygen I", "Oxygen/click x2", {amount: 10, type: 'Oxygen'}, () => {
        game.ressources.perClick.Oxygen.amount *= 2;
    }),
    new g.u.create("Oxygen II", "Oxygen/click x2", {amount: 75, type: 'Oxygen'}, () => {
        game.ressources.perClick.Oxygen.amount *= 2;
    }),
    new g.u.create("Oxygen III", "Oxygen/click x1.5", {amount: 1000, type: 'Oxygen'}, () => {
        game.ressources.perClick.Oxygen.amount *= 1.5;
    }),

    new g.u.create("Energy I", "Energy/click x2", {amount: 10, type: 'Energy'}, () => {
        game.ressources.perClick.Energy.amount *= 2;
    }),
    new g.u.create("Energy II", "Energy/click x2", {amount: 75, type: 'Energy'}, () => {
        game.ressources.perClick.Energy.amount *= 2;
    }),
    new g.u.create("Energy III", "Energy/click x1.5", {amount: 1000, type: 'Energy'}, () => {
        game.ressources.perClick.Energy.amount *= 1.5;
    })
];