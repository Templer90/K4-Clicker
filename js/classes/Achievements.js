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