class Achievement {
    constructor(name, desc, condition, reward = undefined) {
        this.name = name;
        this.desc = desc;
        this.con = condition;
        if (reward === undefined) {
            this.rew = () => {
            };
        } else {
            this.rew = reward;
        }
    }

    condition = () => {
        return this.con();
    };

    reward = () => {
        this.rew();
    };
}
g.achievements = g.a = {};
g.a.owned = [];
g.a.list = [];
game.achievements.init = () => {
    g.a.list.forEach((a, i) => {
        g.a.owned[i] = false;
    });
};
game.achievements.checkSave = () => {
    
};
game.achievements.checkLoop = () => {
    g.a.list.forEach((a, i) => {
        if ((g.a.owned[i] === false) && (g.a.list[i].condition())) {
            g.a.owned[i] = true;
            g.a.list[i].reward();
        }
    });
};
game.achievements.save = () => {
    return {
        owned: g.a.owned
    };
};
game.achievements.load = (saveObj) => {
    g.a.owned = saveObj.owned;
    g.a.owned.forEach((obj, i) => {});
};