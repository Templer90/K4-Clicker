g.achievements.list = [
    new Achievement('First Steps', '1024 Hydrogen', () => game.resources.total.Hydrogen >= 1024),
    new Achievement('Second Steps', 'Page size of an Intel x86-compatible processor: 4096 Bits', () => game.resources.total.Hydrogen >= 4096),
    new Achievement('Fermat Prime (65537)', 'Largest known Fermat Prime of Hydrogen Atoms', () => game.resources.total.Hydrogen >= 65537),
    new Achievement('1073741824 Step', 'First power of 2 greater than one million', () => game.resources.total.Hydrogen >= 1073741824),
    new Achievement('Avogadro', `More than ${elements.avogadro} Atoms`, () => game.resources.total.Hydrogen >= elements.avogadro),
];