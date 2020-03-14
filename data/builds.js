g.b.list = [
    new Building("Hydrogen build", "Create some hydrogen", {
            startCost: {'Hydrogen': 1,'Energy': 1},
            inflation: {'Hydrogen': 2,'Energy': 3},
        },
        {perSec: 1, type: "Hydrogen"},
        {
            type: "Hydrogen",
            func: (value, delta, reward, destination) => {
                destination[reward.type] += value * delta * (g.u.owned["Building_Test"] ? g.resources.perClick.Hydrogen.amount : 1);
            }
        }),
    new Building("Energy build", "Create some Energy", {
            startCost: {'Energy': 25},
            inflation: 1.15
        },
        {perSec: 1, type: "Energy"},
        {
            type: "Energy",
            func: (value, delta, reward, destination) => {
                destination[reward.type] += value * delta * (g.u.owned["Building_Test"] ? g.resources.perClick.Energy.amount : 1)
            }
        }),
    new ColliderBuilding("Autonomous Collider", "Run the Collider", {
            startCost: {'Hydrogen': 1},
            inflation: 1.23
        },
        {perSec: 1, type: "Collider.click"},
        {
            type: "Collider",
            accumulator: 0,
            rewardPerSecondString: (owned, element) => {
                const statistic = g.collider.statistic[0];
                element.removeAttribute('title');
                element.removeAttribute('data-original-title');
               
                let tooltip = 'Input:\n';
                tooltip += '\tEnergy: ' + Math.round(statistic.inputEnergy * owned) + '\n\t';
                tooltip += statistic.inputElements.map((output) => output.element + " " + (output.value * owned)).join('\n\t');
                tooltip += '\nOutput:\n';
                tooltip += '\tEnergy: ' + Math.round(statistic.outputEnergy * owned) + '\n\t';
                tooltip += statistic.outputElements.map((output) => output.element + ": " + (output.value * owned)).join('\n\t');

                element.setAttribute('data-original-title', tooltip);
                $(element).tooltip('update');
                element.dataset.toggle = 'tooltip';
                element.dataset.placement = 'top';

                return statistic.outputElements.map((output) => elements.find(output.element).symbol + (output.value * owned)).join(" & ") + ' /sec';
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
            startCost: {'Hydrogen': 25},
            inflation: 1.09
        },
        {perSec: 1.0/7.0, type: "Hydrogen"},
        {
            type: "Hydrogen",
            rewardPerSecondString: (owned) => {
                return 'Around ' + (owned/7 * 6) + ' Atoms/sec';
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
        }, false)
];