g.u.list = [
    new Upgrade("Hydrogen Isotopes", "You sometimes get a Hydrogen Isotope when collecting Hydrogen", {amount: 10, type: 'Hydrogen'}, () => {
        game.ressources.perClick.Hydrogen.amount *= 2;
    }),
    new Upgrade("Hydrogen I", "Hydrogen/click x2", {amount: 10, type: 'Hydrogen'}, () => {
        game.ressources.perClick.Hydrogen.amount *= 2;
    }),
    new Upgrade("Hydrogen II", "Hydrogen/click x2", {amount: 75, type: 'Hydrogen'}, () => {
        game.ressources.perClick.Hydrogen.amount *= 2;
    }),
    new Upgrade("Hydrogen III", "Hydrogen/click x1.5", [{amount: 1000, type: 'Hydrogen'},{amount: 10, type: 'Oxygen'} ], () => {
        game.ressources.perClick.Hydrogen.amount *= 1.5;
    }),
    
    new MultiUpgrade("MultiUpgrade", "Hydrogen/click x2", {amount: 10, type: 'Hydrogen'} , 4,() => {
        game.ressources.perClick.Hydrogen.amount *= 2;
    }),

    new Upgrade("Depends on MultiUpgrade >0", "Depends", {amount: 100, type: 'Hydrogen'}, () => {
        game.ressources.perClick.Hydrogen.amount *= 2;
    }, () => {
        return g.u.owned["MultiUpgrade"] === true || g.u.owned["MultiUpgrade"] !== false;
    }),
    new Upgrade("Depends on MultiUpgrade >=2", "Depends", {amount: 100, type: 'Hydrogen'}, () => {
        game.ressources.perClick.Hydrogen.amount *= 2;
    }, () => {
        return  g.u.owned["MultiUpgrade"] === true ||g.u.owned["MultiUpgrade"] >= 2;
    }),
    new Upgrade("Depends on MultiUpgrade >=1", "Depends", {amount: 100, type: 'Hydrogen'}, () => {
        game.ressources.perClick.Hydrogen.amount *= 2;
    }, () => {
        return  g.u.owned["MultiUpgrade"] === true ||g.u.owned["MultiUpgrade"] >= 1;
    }),
    new MultiUpgrade("Depends on MultiUpgrade finished", "Depends", {
        amount: 100, type: 'Hydrogen'
    }, 8, () => {
        game.ressources.perClick.Hydrogen.amount *= 2;
    }, () => {
        return g.u.owned["MultiUpgrade"] === true;
    }),


    new Upgrade("Better Collider I", "Collider Output/click x2", {amount: 10, type: 'Hydrogen'}, () => {
        game.ressources.perClick.Collider.amount *= 2;
    }),
    new Upgrade("Better Collider II", "Collider Output/click x2", {amount: 75, type: 'Hydrogen'}, () => {
        game.ressources.perClick.Collider.amount *= 2;
    }),
    new Upgrade("Better Collider III", "Collider Output/click x1.5", {amount: 1000, type: 'Hydrogen'}, () => {
        game.ressources.perClick.Collider.amount *= 1.5;
    }),

    new MultiUpgrade("Energy I", "Energy/click x2", {amount: 10, type: 'Energy'}, 5,() => {
        game.ressources.perClick.Energy.amount *= 2;
    }),
    new MultiUpgrade("Energy II", "Energy/click x2", {amount: 75, type: 'Energy'}, 5,() => {
        game.ressources.perClick.Energy.amount *= 1.5;
    }),
    new Upgrade("Energy III", "Energy/click x1.5", {amount: 1000, type: 'Energy'}, () => {
        game.ressources.perClick.Energy.amount *= 1.5;
    })
];