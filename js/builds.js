g.builds = g.b = {};
g.b.owned = [];
g.b.multiplier = [];

game.builds.init = () => {
    const panel = document.getElementById('builds-panelbody');
    g.b.list.forEach((b, i) => {
        g.b.owned.push(0);
        g.b.multiplier.push(1);
        b.index = i;
        panel.append(b.genHTML(i));
    });
};
game.builds.checkBuyStatus = () => {
    g.b.list.forEach((obj) => {
        obj.buttons.forEach((button) => {
            if (obj.buyable()) {
                button.removeAttribute('disabled');
                button.classList.remove('disabled');
            } else {
                button.setAttribute('disabled', 'disabled');
                button.classList.add('disabled');
            }
        });
    });
};
game.builds.buy = (index) => {
    if (g.b.list[index].buyable()) {
        g.b.list[index].buy();
        g.b.owned[index]++;
        g.b.update();
    }
};
game.builds.earn = (times) => {
    const delta = times / g.options.fps;
    for (let i = 0; i < g.b.list.length; i++) {
        if (g.b.owned[i] > 0 && g.b.list[i].enabled) {
            const reward = g.b.list[i].reward;
            g.b.list[i].reward.func(g.b.list[i].valuePerSec.perSec * g.b.owned[i] * g.b.multiplier[i],
                delta,
                reward,
                game.resources.owned
            );
        }
    }
};
game.builds.checkSave = () => {
    if (g.b.owned.length !== g.b.list.length) {
        const a = (g.b.list.length - g.b.owned.length);
        for (let i = 0; i < a; i++)
            g.b.owned.push(0);
    }
};
game.builds.find = (name) => {
    const formattedName = helpers.formatName(name);
    return g.b.list.find((b) => (b.name === formattedName || b.name === name));
};
game.builds.updateCost = () => {
    g.b.list.forEach((build) => {
        build.updateCostStyle();
    });
};
game.builds.update = () => {
    g.b.list.forEach((build, i) => {
        const row = document.getElementById("builds-row-" + i);
        if (build.visible) {
            row.style.display = 'flex';
        } else {
            row.style.display = 'none';
        }

        build.update();
    });
};
game.builds.save = () => {
    return {
        owned: g.b.owned,
        multiplier: g.b.multiplier,
        data: g.b.list.map((b) => {
            return {
                visible: b.visible,
                perSec: b.valuePerSec.perSec,
                additions: b.additions
            }
        })
    };
};
game.builds.load = (saveObj) => {
    g.b.owned = saveObj.owned;
    g.b.multiplier = saveObj.multiplier;
    g.b.list.forEach((b, i) => {
        b.visible = saveObj.data[i].visible;
        b.valuePerSec.perSec = saveObj.data[i].perSec;
        if (saveObj.additions !== undefined) {
            b.additions = saveObj.additions;
        }
    });
};