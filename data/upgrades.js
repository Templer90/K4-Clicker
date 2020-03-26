g.u.list = [
    new Upgrade('Hydrogen Isotopes', 'You sometimes get an additional Hydrogen Isotope when creating Hydrogen', 'Hydrogen,Output,Isotopes', {'Hydrogen': 4096},
        () => {
            game.resources.perClick.Hydrogen.amount *= 2;
            game.collider.options.usableElements.push('D');
            game.collider.updateAllowedElements();
        },
        {
            visible: 'Hydrogen I'
        }),
    new Upgrade('Hydrogen I', 'Hydrogen/click x2', 'Hydrogen,Output', {'Hydrogen': 20}, () => {
            game.resources.perClick.Hydrogen.amount *= 2;
        },
        {
            visible: true
        }),
    new MultiUpgrade('Hydrogen II', 'Hydrogen/click x2', 'Hydrogen,Output', {'Hydrogen': 75}, 4, () => {
        game.resources.perClick.Hydrogen.amount *= 2;
    }, {
        visible: 'Hydrogen Isotopes'
    }),
    
    new InfiniteUpgrade('Hydrogen III', 'Hydrogen/click x1.5', 'Hydrogen,Output', {'Hydrogen': 1}, (upgrade) => {
        upgrade.price.Hydrogen++;
        upgrade.updateCostStyle();
        game.resources.perClick.Hydrogen.amount *= 1.5;
        },
        {
            visible: 'Building Test'
        }),

    new Upgrade('Building Test', 'Building_Test', 'Building,Debug', {'Hydrogen': 1}, () => {}, {
        visible: {
            list: ['Hydrogen II', 'Hydrogen Isotopes'],
            func: () => {
                return true
            }
        }
    }),

    new MultiUpgrade('MultiUpgrade', 'Hydrogen/click x2', 'Building', {'Hydrogen': 10}, 4, () => {
        game.resources.perClick.Hydrogen.amount *= 2;
    }),

    new MultiUpgrade('Building Efficiency', 'Makes every Building more Efficient (x2)', 'Building,Efficiency', {
        'Hydrogen': 1000000,
        'Energy': 1000000
    }, 4, () => {
        g.b.multiplier = g.b.multiplier.map((x) => x * 2);
    }, {
        visible: true
    }),

    new Upgrade('Deuterium I', 'Deuterium++', 'Deuterium', {'Deuterium': 100000, 'Energy':100000}, () => {
        game.resources.perClick.Deuterium.amount *= 2;
    }),
    new Upgrade('Better Collider I', 'Collider Output/click x2', 'Collider', {'Hydrogen': 10}, () => {
        game.resources.perClick.Collider.amount *= 2;
    }),
    new Upgrade('Better Collider II', 'Collider Output/click x2', 'Collider', {'Hydrogen': 75}, () => {
        game.resources.perClick.Collider.amount *= 2;
    }),
    new Upgrade('Better Collider III', 'Collider Output/click x1.5', 'Collider', {'Hydrogen': 1000}, () => {
        game.resources.perClick.Collider.amount *= 1.5;
    }),
    new Upgrade('A Sun', 'A Sun. Produces Energy and Helium', 'Building,Sun', {
        'Hydrogen': 1.8313164e+30,
        'Helium': 1.550952e+29
    }, () => {
        game.builds.find('Suns').visible = true;
    }, {visible: true}),


    new MultiUpgrade('Energy I', 'Energy/click x2', 'Energy', {'Energy': 10}, 5, () => {
            game.resources.perClick.Energy.amount *= 2;
        },
        {
            visible: true
        }),
    new MultiUpgrade('Energy II', 'Energy/click x2', 'Energy', {'Energy': 10000}, 5, () => {
            game.resources.perClick.Energy.amount *= 2;
        },
        {
            visible: 'Energy II'
        }),
    new MultiUpgrade('Energy III', 'Energy/click x1.5', 'Energy', {'Energy': 10e10}, 3, () => {
            game.resources.perClick.Energy.amount *= 1.5;
        },
        {
            visible: 'Energy III'
        }),

    new Upgrade('Add Tritium to Collider', 'Add Tritium', 'Collider,Tritium', {'Deuterium': 1000}, () => {
        g.collider.options.usableElements.push('T');
        game.collider.updateAllowedElements();
    }),
    new Upgrade('Add Carbon to Collider', 'Add Carbon', 'Collider,Carbon', {'Tritium': 1000}, () => {
        g.collider.options.usableElements.push('C');
        game.collider.updateAllowedElements();
    }),
    new Upgrade('Add Neon to Collider', 'Add Neon', 'Collider,Neon', {'Carbon': 1000}, () => {
        g.collider.options.usableElements.push('Ne');
        game.collider.updateAllowedElements();
    }),
    new Upgrade('Add Oxygen to Collider', 'Add Oxygen', 'Collider,Oxygen', {'Neon': 1000}, () => {
        g.collider.options.usableElements.push('O');
        game.collider.updateAllowedElements();
    }),
    new Upgrade('Add Silicon to Collider', 'Add Silicon', 'Collider,Silicon', {'Oxygen': 1000}, () => {
        g.collider.options.usableElements.push('Si');
        game.collider.updateAllowedElements();
    }),
    new Upgrade('Add Iron to Collider', 'Add Iron', 'Collider,Iron', {'Silicon': 1000}, () => {
        g.collider.options.usableElements.push('Fe');
        game.builds.find('AutoUpgrade_Hydrogen_build').visible = true;
        game.collider.updateAllowedElements();
    }),
    
    
    new MultiUpgrade('More Emitters', 'Emitter++', 'Collider,Emitter', {'Hydrogen': 1}, 8, (self) => {
        self.price.Hydrogen *= 2;
        g.collider.options.maxEmitter += 1;
    }),
    new MultiUpgrade('More Collider', 'Collider++', 'Collider', {'Hydrogen': 1}, 8, () => {
        g.collider.options.collider += 1;
        game.collider.update();
    }),
];