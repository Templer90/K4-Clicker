g.b.list = [
    new Building("Hydrogen build", "Create some hydrogen", {
            amount: 10,
            type: 'Hydrogen',
            inflation: 1.5
        },
        {perSec: 1, type: "Hydrogen"},
        {
            type: "Hydrogen",
            func: (value, delta, reward, destination) => {
                destination[reward.type] += value * delta * (g.u.owned["Building_Test"] ? g.resources.perClick.Hydrogen.amount : 1);
            }
        }),
    new Building("Oxygen build", "Create some oxygen", {
            amount: 25,
            type: 'Oxygen',
            inflation: 1.09
        },
        {perSec: 1, type: "Oxygen"},
        {
            type: "Oxygen",
            func: (value, delta, reward, destination) => {
                destination[reward.type] += value * delta * (g.u.owned["Building_Test"] ? g.resources.perClick.Oxygen.amount : 1);
            },
        }),
    new Building("Energy build", "Create some Energy", {
            amount: 25,
            type: 'Energy',
            inflation: 1.15
        },
        {perSec: 1, type: "Energy"},
        {
            type: "Energy",
            func: (value, delta, reward, destination) => {
                destination[reward.type] += value * delta * (g.u.owned["Building_Test"] ? g.resources.perClick.Energy.amount : 1)
            }
        }),
    new Building("Autonomous Collider", "Run the Collider", {
            amount: 1,
            type: 'Hydrogen',
            inflation: 1.23
        },
        {perSec: 1, type: "Collider.click"},
        {
            type: "Collider",
            accumulator: 0,
            rewardPerSecondString: (owned) => {
                if (g.collider.statistic.outputElements.length === 1) {
                    const element = g.collider.statistic.outputElements[0];
                    return element.element + " " + (element.value*owned) + " /sec";
                }
                return 'click /sec';
            },
            func: (value, delta, reward) => {
                reward.accumulator += value * delta;

                if (reward.accumulator < 1) return;

                if (g.resources.perClick.Collider.can(g.resources.owned, Math.floor(reward.accumulator))) {
                    g.resources.perClick.Collider.click(g.resources.owned, Math.floor(reward.accumulator));
                    reward.accumulator -= Math.floor(reward.accumulator);
                } else {
                    while (reward.accumulator > 1) {
                        reward.accumulator -= 1;
                        game.earn('collider');
                    }
                }
            }
        }, true),
    
    new Building("AutoUpgrade Hydrogen build", "Takes 134 Atoms of Hydrogen and makes Helium, Carbon, Neon, Oxygen, Silicon and Iron", {
            amount: 25,
            type: 'Hydrogen',
            inflation: 1.09
        },
        {perSec: 1.0/7.0, type: "Hydrogen"},
        {
            type: "Hydrogen",
            rewardPerSecondString: (owned) => {
                return 'Around ' + (owned/7 * 6) + ' Atoms/sec';
            },
            func: (value, delta, reward, destination) => {
                if (destination.Hydrogen <= 134 * value * delta) return;
                
                destination.Hydrogen -= 134 * value * delta;
                destination.Helium += value * delta;
                destination.Carbon += value * delta;
                destination.Neon += value * delta;
                destination.Oxygen += value * delta;
                destination.Silicon += value * delta;
                destination.Iron += value * delta;
            }
        }, false)
];