g.achievements.list = [
    new Achievement('First Steps', 'test', () => game.resources.total.Hydrogen >= 1000, () => {
        console.log("Yay 1000 Hydrogen");
    }),
    new Achievement('Avogadro', `More than ${elements.avogadro} Atoms`, () => game.resources.total.Hydrogen >= elements.avogadro, () => {
        console.log("avogadro");
    }),
];