g.u.list = [
    new Upgrade("Hydrogen Isotopes", "You sometimes get an additional Hydrogen Isotope when collecting Hydrogen", {'Hydrogen': 10}, () => {
        game.ressources.perClick.Hydrogen.amount *= 2;
        game.collider.options.usableElements.push('D')
    }),
    new Upgrade("Hydrogen I", "Hydrogen/click x2", {'Hydrogen': 10}, () => {
        game.ressources.perClick.Hydrogen.amount *= 2;
    }),
    new Upgrade("Hydrogen II", "Hydrogen/click x2", {'Hydrogen': 75}, () => {
        game.ressources.perClick.Hydrogen.amount *= 2;
    }),
    new Upgrade("Hydrogen III", "Hydrogen/click x1.5", {'Hydrogen': 1000, 'Oxygen': 10}, () => {
        game.ressources.perClick.Hydrogen.amount *= 1.5;
    }),
    
    new MultiUpgrade("MultiUpgrade", "Hydrogen/click x2", {'Hydrogen': 10} , 4,() => {
        game.ressources.perClick.Hydrogen.amount *= 2;
    }),

    new Upgrade("Depends on MultiUpgrade >0", "Depends", {'Hydrogen': 100}, () => {
        game.ressources.perClick.Hydrogen.amount *= 2;
    }, () => {
        return g.u.owned["MultiUpgrade"] === true || g.u.owned["MultiUpgrade"] !== false;
    }),
    new Upgrade("Depends on MultiUpgrade >=2", "Depends", {'Hydrogen': 100}, () => {
        game.ressources.perClick.Hydrogen.amount *= 2;
    }, () => {
        return  g.u.owned["MultiUpgrade"] === true ||g.u.owned["MultiUpgrade"] >= 2;
    }),
    new Upgrade("Depends on MultiUpgrade >=1", "Depends", {'Hydrogen': 100}, () => {
        game.ressources.perClick.Hydrogen.amount *= 2;
    }, () => {
        return  g.u.owned["MultiUpgrade"] === true ||g.u.owned["MultiUpgrade"] >= 1;
    }),
    new MultiUpgrade("Depends on MultiUpgrade finished", "Depends", {'Hydrogen': 100}, 8, () => {
        game.ressources.perClick.Hydrogen.amount *= 2;
    }, () => {
        return g.u.owned["MultiUpgrade"] === true;
    }),


    new Upgrade("Better Collider I", "Collider Output/click x2", {'Hydrogen': 10}, () => {
        game.ressources.perClick.Collider.amount *= 2;
    }),
    new Upgrade("Better Collider II", "Collider Output/click x2", {'Hydrogen': 75}, () => {
        game.ressources.perClick.Collider.amount *= 2;
    }),
    new Upgrade("Better Collider III", "Collider Output/click x1.5", {'Hydrogen': 1000}, () => {
        game.ressources.perClick.Collider.amount *= 1.5;
    }),

    new MultiUpgrade("Energy I", "Energy/click x2", {'Energy': 10} , 5,() => {
        game.ressources.perClick.Energy.amount *= 2;
    }),
    new MultiUpgrade("Energy II", "Energy/click x2", {'Energy': 75} , 5,() => {
        game.ressources.perClick.Energy.amount *= 1.5;
    }),
    new Upgrade("Energy III", "Energy/click x1.5", {'Energy': 1000} , () => {
        game.ressources.perClick.Energy.amount *= 1.5;
    }),

    new Upgrade("Add Tritium to Collider", "Add Tritium", {'Deuterium': 1000}, () => {
        g.collider.options.usableElements.push('T');
        game.collider.updateAllowedElements();
    }),
    new Upgrade("Add Carbon to Collider", "Add Carbon", {'Tritium': 1000}, () => {
        g.collider.options.usableElements.push('C');
        game.collider.updateAllowedElements();
    }),
    new Upgrade("Add Neon to Collider", "Add Neon", {'Carbon': 1000}, () => {
        g.collider.options.usableElements.push('Ne');
        game.collider.updateAllowedElements();
    }),
    new Upgrade("Add Oxygen to Collider", "Add Oxygen", {'Neon': 1000}, () => {
        g.collider.options.usableElements.push('O');
        game.collider.updateAllowedElements();
    }),
    new Upgrade("Add Silicon to Collider", "Add Silicon", {'Oxygen': 1000}, () => {
        g.collider.options.usableElements.push('Si');
        game.collider.updateAllowedElements();
    }),
    new Upgrade("Add Iron to Collider", "Add Silicon", {'Silicon': 1000}, () => {
        g.collider.options.usableElements.push('Fe');
        game.collider.updateAllowedElements();
    }),
    new MultiUpgrade("More Emitters", "Emitter++", {'Hydrogen': 1}, 8, (self) => {
        self.price.Hydrogen *= 2;
        g.collider.options.maxEmitter += 1;
    }),
];