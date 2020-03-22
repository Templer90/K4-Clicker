game.resources.specialInit = () => {
    g.resources.perClick.Hydrogen.click = function (owned, multi) {
        owned["Hydrogen"] += this.amount;
        owned["Deuterium"] += g.u.owned["Hydrogen_Isotopes"] * (0.000115 * g.resources.perClick.Deuterium.amount * this.amount * multi);
        return owned["Hydrogen"];
    };

    g.resources.perClick.Collider = {
        amount: 1,
        can: function (owned, multi, colliderIndex= 0) {
            const statistic = g.collider.statistic[colliderIndex];
            const perClick = this.amount * multi;

            if (statistic.unstable) return false;
            if (owned.Energy <= statistic.inputEnergy * multi) return false;
            let found = statistic.inputElements.find((obj) => {
                return owned[obj.element] <= obj.value * perClick;
            });

            return found === undefined;
        },
        click: function (owned, multi, colliderIndex= 0) {
            const statistic = g.collider.statistic[colliderIndex];
            const perClick = this.amount * multi;

            owned.Energy -= statistic.inputEnergy * multi;
            statistic.inputElements.forEach((obj) => {
                owned[obj.element] -= obj.value * perClick;
            });
            statistic.outputElements.forEach((obj) => {
                owned[obj.element] += obj.value * perClick;
            });

            return this.amount;
        }
    };

    g.resources.perClick.Water = {
        amount: 1,
        can: function (owned) {
            return owned.Hydrogen >= 20 * g.buyMultiplier && owned.Oxygen >= 10 * g.buyMultiplier;
        },
        click: function (owned) {
            this.amount = 0;
            if (g.buyMultiplier > 1) {
                for (let i = 0; i < g.buyMultiplier; i++) {
                    if (owned.Hydrogen >= 20 && owned.Oxygen >= 10) {
                        owned.Hydrogen -= 20;
                        owned.Oxygen -= 10;
                        owned.Water++;
                        this.amount++;
                    }
                }
            } else {
                owned.Hydrogen -= 20;
                owned.Oxygen -= 10;
                owned.Water++;
                this.amount++;
            }
        }
    };
};