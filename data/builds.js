g.b.list = [
    new Building("Hydrogen build", "Create some hydrogen", {
            amount: 10,
            type: 'Hydrogen',
            inflation: 1.5
        },
        {perSec: 1, type: "Hydrogen"},
        {
            type: "Hydrogen",
            func: (value, delta) => {
                game.ressources.owned.Hydrogen += value * delta * (g.u.owned["Building_Test"] ? g.ressources.perClick.Hydrogen.amount : 1);
            },
        }),
    new Building("Oxygen build", "Create some oxygen", {
            amount: 25,
            type: 'Oxygen',
            inflation: 1.15
        },
        {perSec: 1, type: "Oxygen"},
        {
            type: "Oxygen",
            func: (value, delta) => {
                game.ressources.owned.Oxygen += value * delta;
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
            func: (value, delta) => {
                game.ressources.owned.Energy += value * delta;
            },
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
            func: (value, delta, obj) => {
                obj.accumulator += value * delta;
                
                if (obj.accumulator < 1) return;
                
                if (g.ressources.perClick.Collider.can(g.ressources.owned, Math.floor(obj.accumulator))) {
                    g.ressources.perClick.Collider.click(g.ressources.owned, obj.accumulator);
                    obj.accumulator -= Math.floor(obj.accumulator);
                } else {
                    while (obj.accumulator > 1) {
                        obj.accumulator -= 1;
                        game.earn('collider');
                    }
                }
            }
        })
];