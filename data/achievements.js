g.achievements.list = [
    new Achievement('Test 1', 'test', () => game.resources.total.Hydrogen >= 1000, () => {
        console.log("Yay 1000 Hydrogen");
    }),
];