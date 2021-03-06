g.b.list = [
    new Building('Hydrogen build', 'Create some Hydrogen', {
            startCost: {'Hydrogen': 10,'Energy': 8},
            inflation: {'Hydrogen': 1.2,'Energy': 1.1},
        },
        {perSec: 1, type: 'Hydrogen'},
        {
            type: 'Hydrogen',
            func: (value, delta, reward, destination) => {
                destination[reward.type] += value * delta * (g.u.owned['Buildings_can_use_Clicks'] ? g.resources.perClick.Hydrogen.amount : 1);
            }
        }),
    new Building('Energy build', 'Create some Energy', {
            startCost: {'Energy': 25},
            inflation: 1.15
        },
        {perSec: 1, type: 'Energy'},
        {
            type: 'Energy',
            func: (value, delta, reward, destination) => {
                destination[reward.type] += value * delta * (g.u.owned['Buildings_can_use_Clicks'] ? g.resources.perClick.Energy.amount : 1)
            }
        }),
    new Building('Suns', 'Create some Energy', {
            startCost: {'Hydrogen':  1.8313164e+30, 'Helium': 1.550952e+29},
            inflation: {'Hydrogen': 1, 'Helium': 1}
        },
        {perSec: 2.37177347 * 1e45, type: 'Energy'},
        {
            type: 'Energy',
            func: (value, delta, reward, destination) => {
                destination['Helium'] += delta * 606000000;
                destination['Energy'] += value * delta;
            }
        }, {visible: false}),
    new Building('Helium build', 'Create some Helium', {
            startCost: {'Helium': 10,'Energy': 8},
            inflation: {'Helium': 1.1,'Energy': 1.1},
        },
        {perSec: 1, type: 'Helium'},
        {
            type: 'Helium',
            func: (value, delta, reward, destination) => {
                destination[reward.type] += value * delta * (g.u.owned['Buildings_can_use_Clicks'] ? g.resources.perClick.Helium.amount : 1);
            }
        }),
    new ColliderBuilding('Autonomous Collider I', 'Run the Collider', {
            startCost: {'Hydrogen': 10},
            inflation: 1.15
        },
        {perSec: 1, type: 'Collider.click'}),
    new ColliderBuilding('Autonomous Collider II', 'Run the Collider', {
            startCost: {'Hydrogen': 1.0e+6, 'Helium': 1.0e+6},
            inflation: 1.17
        },
        {perSec: 1, type: 'Collider.click'}),
    new ColliderBuilding('Autonomous Collider III', 'Run the Collider', {
            startCost: {'Hydrogen': 1.0e+12, 'Helium':1.0e+12},
            inflation: 1.2
        },
        {perSec: 1, type: 'Collider.click'}),
    
    new Building('AutoUpgrade Hydrogen build', 'Takes 134 Atoms of Hydrogen and makes Helium, Carbon, Neon, Oxygen, Silicon and Iron', {
            startCost: {'Hydrogen': 1.0e+5,'Energy': 1.0e+5},
            inflation: {'Hydrogen': 1.09,'Energy': 1.09},
        },
        {perSec: 1.0/7.0, type: 'Hydrogen'},
        {
            type: 'Hydrogen',
            rewardPerSecondString: (owned) => {
                return 'Around ' + (owned / 7 * 6).toFixed(2) + ' Atoms/sec';
            },
            func: (value, delta, reward, destination) => {
                if (destination.Hydrogen <= 134 ) return;

                destination.Hydrogen -= 134;
                destination.Helium += 1;
                destination.Carbon += 1;
                destination.Neon += 1;
                destination.Oxygen += 1;
                destination.Silicon += 1;
                destination.Iron += 1;
            }
        })
];