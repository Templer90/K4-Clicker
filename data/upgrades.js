g.u.list = [
    new Upgrade("Hydrogen Isotopes", "You sometimes get an additional Hydrogen Isotope when collecting Hydrogen", 'Hydrogen,Output,Isotopes', {'Hydrogen': 10}, () => {
        game.resources.perClick.Hydrogen.amount *= 2;
        game.collider.options.usableElements.push('D');
    }),
    new Upgrade("Hydrogen I", "Hydrogen/click x2", 'Hydrogen,Output', {'Hydrogen': 10}, () => {
        game.resources.perClick.Hydrogen.amount *= 2;
    }),
    new Upgrade("Hydrogen II", "Hydrogen/click x2", 'Hydrogen,Output', {'Hydrogen': 75}, () => {
        game.resources.perClick.Hydrogen.amount *= 2;
    }),
    new Upgrade("Hydrogen III", "Hydrogen/click x1.5", 'Hydrogen,Output', {'Hydrogen': 1000, 'Oxygen': 10}, () => {
        game.resources.perClick.Hydrogen.amount *= 1.5;
    }),

    new Upgrade("Building Test", "Building_Test", 'Building,Debug', {'Hydrogen': 1}),

    new MultiUpgrade("MultiUpgrade", "Hydrogen/click x2", 'Building', {'Hydrogen': 10}, 4, () => {
        game.resources.perClick.Hydrogen.amount *= 2;
    }),

    new Upgrade("Depends on MultiUpgrade >0", "Depends", 'Building', {'Hydrogen': 100}, () => {
        game.resources.perClick.Hydrogen.amount *= 2;
    }, () => {
        return g.u.owned["MultiUpgrade"] === true || g.u.owned["MultiUpgrade"] !== false;
    }),
    new Upgrade("Depends on MultiUpgrade >=2", "Depends", 'Building', {'Hydrogen': 100}, () => {
        game.resources.perClick.Hydrogen.amount *= 2;
    }, () => {
        return g.u.owned["MultiUpgrade"] === true || g.u.owned["MultiUpgrade"] >= 2;
    }),
    new Upgrade("Depends on MultiUpgrade >=1", "Depends", 'Building', {'Hydrogen': 100}, () => {
        game.resources.perClick.Hydrogen.amount *= 2;
    }, () => {
        return g.u.owned["MultiUpgrade"] === true || g.u.owned["MultiUpgrade"] >= 1;
    }),
    new MultiUpgrade("Depends on MultiUpgrade finished", "Depends", 'Building', {'Hydrogen': 100}, 8, () => {
        game.resources.perClick.Hydrogen.amount *= 2;
    }, () => {
        return g.u.owned["MultiUpgrade"] === true;
    }),

    new Upgrade("Deuterium I", "Deuterium++", 'Deuterium', {'Hydrogen': 10}, () => {
        game.resources.perClick.Deuterium.amount *= 2;
    }),

    new Upgrade("Better Collider I", "Collider Output/click x2", 'Collider', {'Hydrogen': 10}, () => {
        game.resources.perClick.Collider.amount *= 2;
    }),
    new Upgrade("Better Collider II", "Collider Output/click x2", 'Collider', {'Hydrogen': 75}, () => {
        game.resources.perClick.Collider.amount *= 2;
    }),
    new Upgrade("Better Collider III", "Collider Output/click x1.5", 'Collider', {'Hydrogen': 1000}, () => {
        game.resources.perClick.Collider.amount *= 1.5;
    }),

    new MultiUpgrade("Energy I", "Energy/click x2", 'Energy', {'Energy': 10}, 5, () => {
        game.resources.perClick.Energy.amount *= 2;
    }),
    new MultiUpgrade("Energy II", "Energy/click x2", 'Energy', {'Energy': 75}, 5, () => {
        game.resources.perClick.Energy.amount *= 1.5;
    }),
    new Upgrade("Energy III", "Energy/click x1.5", 'Energy', {'Energy': 1000}, () => {
        game.resources.perClick.Energy.amount *= 1.5;
    }),

    new Upgrade("Add Tritium to Collider", "Add Tritium", 'Collider,Tritium', {'Deuterium': 1000}, () => {
        g.collider.options.usableElements.push('T');
        game.collider.updateAllowedElements();
    }),
    new Upgrade("Add Carbon to Collider", "Add Carbon", 'Collider,Carbon', {'Tritium': 1000}, () => {
        g.collider.options.usableElements.push('C');
        game.collider.updateAllowedElements();
    }),
    new Upgrade("Add Neon to Collider", "Add Neon", 'Collider,Neon', {'Carbon': 1000}, () => {
        g.collider.options.usableElements.push('Ne');
        game.collider.updateAllowedElements();
    }),
    new Upgrade("Add Oxygen to Collider", "Add Oxygen", 'Collider,Oxygen', {'Neon': 1000}, () => {
        g.collider.options.usableElements.push('O');
        game.collider.updateAllowedElements();
    }),
    new Upgrade("Add Silicon to Collider", "Add Silicon", 'Collider,Silicon', {'Oxygen': 1000}, () => {
        g.collider.options.usableElements.push('Si');
        game.collider.updateAllowedElements();
    }),
    new Upgrade("Add Iron to Collider", "Add Iron", 'Collider,Iron', {'Silicon': 1000}, () => {
        g.collider.options.usableElements.push('Fe');
        game.collider.updateAllowedElements();
    }),
    new MultiUpgrade("More Emitters", "Emitter++", 'Collider,Emitter', {'Hydrogen': 1}, 8, (self) => {
        self.price.Hydrogen *= 2;
        g.collider.options.maxEmitter += 1;
    }),
    new MultiUpgrade("More Collider", "Collider++", 'Collider', {'Hydrogen': 1}, 8, (self) => {
        g.collider.options.collider += 1;
    }),
];