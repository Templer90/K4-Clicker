g.b.list = [
    new Building("Hydrogen build", "Create some hydrogen", {
            amount: 10,
            type: 'Hydrogen',
            inflation: 1.5
        },
        {perSec: 1, type: "Hydrogen"},
        {
            type: "Hydrogen",
            func: (value, delta, obj, destination) => {
                destination[obj.type] += value * delta * (g.u.owned["Building_Test"] ? g.resources.perClick.Hydrogen.amount : 1);
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
            func: (value, delta, obj, destination) => {
                destination[obj.type] += value * delta * (g.u.owned["Building_Test"] ? g.resources.perClick.Oxygen.amount : 1);
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
            func: (value, delta, obj, destination) => {
                destination[obj.type] += value * delta * (g.u.owned["Building_Test"] ? g.resources.perClick.Energy.amount : 1)
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
            func: (value, delta, obj) => {
                obj.accumulator += value * delta;

                if (obj.accumulator < 1) return;

                if (g.resources.perClick.Collider.can(g.resources.owned, Math.floor(obj.accumulator))) {
                    g.resources.perClick.Collider.click(g.resources.owned, Math.floor(obj.accumulator));
                    obj.accumulator -= Math.floor(obj.accumulator);
                } else {
                    while (obj.accumulator > 1) {
                        obj.accumulator -= 1;
                        game.earn('collider');
                    }
                }
            }
        }, true)
];