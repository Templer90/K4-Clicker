//https://github.com/Bowserinator/Periodic-Table-JSON/blob/master/PeriodicTableJSON.json
const elements = e = {};
elements.avogadro = 6.02214076e+23;
elements.amu = 1.66054e-27; // Atomic Mass Unit per kg
elements.list = [
    //FAKE Elements VVVVVVVVV
    {
        "name": "Energy",
        "atomic_mass": '&nbsp;',
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 0,
        "number": '&nbsp;',
        "period": '&nbsp;',
        "symbol": "eV",
        "xpos": -1,
        "ypos": -1
    },
    {
        "name": "Neutron",
        "atomic_mass": 1.008,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 1,
        "number": 0,
        "period": 0,
        "symbol": "n",
        "xpos": 0,
        "ypos": 0
    },
    //REAL Elements VVVVVVVVV
    {
        "name": "Hydrogen",
        "atomic_mass": 1.008,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 28.836,
        "number": 1,
        "period": 1,
        "symbol": "H",
        "xpos": 1,
        "ypos": 1
    },
    {
        "name": "Deuterium",
        "atomic_mass": 2.014,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 1,
        "period": 1,
        "symbol": "D",
        "xpos": 1,
        "ypos": 1
    },
    {
        "name": "Tritium",
        "atomic_mass": 3.016,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 1,
        "period": 1,
        "symbol": "T",
        "xpos": 1,
        "ypos": 1
    },
    {
        "name": "Helium",
        "atomic_mass": 4.0026022,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 2,
        "period": 1,
        "symbol": "He",
        "xpos": 18,
        "ypos": 1
    }, {
        "name": "Lithium",
        "atomic_mass": 6.94,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 24.86,
        "number": 3,
        "period": 2,
        "symbol": "Li",
        "xpos": 1,
        "ypos": 2
    }, {
        "name": "Beryllium",
        "atomic_mass": 9.01218315,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 16.443,
        "number": 4,
        "period": 2,
        "symbol": "Be",
        "xpos": 2,
        "ypos": 2
    }, {
        "name": "Boron",
        "atomic_mass": 10.81,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 11.087,
        "number": 5,
        "period": 2,
        "symbol": "B",
        "xpos": 13,
        "ypos": 2
    }, {
        "name": "Carbon",
        "atomic_mass": 12.011,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 8.517,
        "number": 6,
        "period": 2,
        "symbol": "C",
        "xpos": 14,
        "ypos": 2
    }, {
        "name": "Nitrogen",
        "atomic_mass": 14.007,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 7,
        "period": 2,
        "symbol": "N",
        "xpos": 15,
        "ypos": 2
    }, {
        "name": "Oxygen",
        "atomic_mass": 15.999,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 8,
        "period": 2,
        "symbol": "O",
        "xpos": 16,
        "ypos": 2
    }, {
        "name": "Fluorine",
        "atomic_mass": 18.9984031636,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 9,
        "period": 2,
        "symbol": "F",
        "xpos": 17,
        "ypos": 2
    }, {
        "name": "Neon",
        "atomic_mass": 20.17976,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 10,
        "period": 2,
        "symbol": "Ne",
        "xpos": 18,
        "ypos": 2
    }, {
        "name": "Sodium",
        "atomic_mass": 22.989769282,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 28.23,
        "number": 11,
        "period": 3,
        "symbol": "Na",
        "xpos": 1,
        "ypos": 3
    }, {
        "name": "Magnesium",
        "atomic_mass": 24.305,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 24.869,
        "number": 12,
        "period": 3,
        "symbol": "Mg",
        "xpos": 2,
        "ypos": 3
    }, {
        "name": "Aluminium",
        "atomic_mass": 26.98153857,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 24.2,
        "number": 13,
        "period": 3,
        "symbol": "Al",
        "xpos": 13,
        "ypos": 3
    }, {
        "name": "Silicon",
        "atomic_mass": 28.085,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 19.789,
        "number": 14,
        "period": 3,
        "symbol": "Si",
        "xpos": 14,
        "ypos": 3
    }, {
        "name": "Phosphorus",
        "atomic_mass": 30.9737619985,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 23.824,
        "number": 15,
        "period": 3,
        "symbol": "P",
        "xpos": 15,
        "ypos": 3
    }, {
        "name": "Sulfur",
        "atomic_mass": 32.06,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 22.75,
        "number": 16,
        "period": 3,
        "symbol": "S",
        "xpos": 16,
        "ypos": 3
    }, {
        "name": "Chlorine",
        "atomic_mass": 35.45,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 17,
        "period": 3,
        "symbol": "Cl",
        "xpos": 17,
        "ypos": 3
    }, {
        "name": "Argon",
        "atomic_mass": 39.9481,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 18,
        "period": 3,
        "symbol": "Ar",
        "xpos": 18,
        "ypos": 3
    }, {
        "name": "Potassium",
        "atomic_mass": 39.09831,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 29.6,
        "number": 19,
        "period": 4,
        "symbol": "K",
        "xpos": 1,
        "ypos": 4
    }, {
        "name": "Calcium",
        "atomic_mass": 40.0784,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 25.929,
        "number": 20,
        "period": 4,
        "symbol": "Ca",
        "xpos": 2,
        "ypos": 4
    }, {
        "name": "Scandium",
        "atomic_mass": 44.9559085,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 25.52,
        "number": 21,
        "period": 4,
        "symbol": "Sc",
        "xpos": 3,
        "ypos": 4
    }, {
        "name": "Titanium",
        "atomic_mass": 47.8671,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 25.06,
        "number": 22,
        "period": 4,
        "symbol": "Ti",
        "xpos": 4,
        "ypos": 4
    }, {
        "name": "Vanadium",
        "atomic_mass": 50.94151,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 24.89,
        "number": 23,
        "period": 4,
        "symbol": "V",
        "xpos": 5,
        "ypos": 4
    }, {
        "name": "Chromium",
        "atomic_mass": 51.99616,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 23.35,
        "number": 24,
        "period": 4,
        "symbol": "Cr",
        "xpos": 6,
        "ypos": 4
    }, {
        "name": "Manganese",
        "atomic_mass": 54.9380443,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 26.32,
        "number": 25,
        "period": 4,
        "symbol": "Mn",
        "xpos": 7,
        "ypos": 4
    }, {
        "name": "Iron",
        "atomic_mass": 55.8452,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 25.1,
        "number": 26,
        "period": 4,
        "symbol": "Fe",
        "xpos": 8,
        "ypos": 4
    }, {
        "name": "Cobalt",
        "atomic_mass": 58.9331944,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 24.81,
        "number": 27,
        "period": 4,
        "symbol": "Co",
        "xpos": 9,
        "ypos": 4
    }, {
        "name": "Nickel",
        "atomic_mass": 58.69344,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 26.07,
        "number": 28,
        "period": 4,
        "symbol": "Ni",
        "xpos": 10,
        "ypos": 4
    }, {
        "name": "Copper",
        "atomic_mass": 63.5463,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 24.44,
        "number": 29,
        "period": 4,
        "symbol": "Cu",
        "xpos": 11,
        "ypos": 4
    }, {
        "name": "Zinc",
        "atomic_mass": 65.382,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 25.47,
        "number": 30,
        "period": 4,
        "symbol": "Zn",
        "xpos": 12,
        "ypos": 4
    }, {
        "name": "Gallium",
        "atomic_mass": 69.7231,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 25.86,
        "number": 31,
        "period": 4,
        "symbol": "Ga",
        "xpos": 13,
        "ypos": 4
    }, {
        "name": "Germanium",
        "atomic_mass": 72.6308,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 23.222,
        "number": 32,
        "period": 4,
        "symbol": "Ge",
        "xpos": 14,
        "ypos": 4
    }, {
        "name": "Arsenic",
        "atomic_mass": 74.9215956,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 24.64,
        "number": 33,
        "period": 4,
        "symbol": "As",
        "xpos": 15,
        "ypos": 4
    }, {
        "name": "Selenium",
        "atomic_mass": 78.9718,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 25.363,
        "number": 34,
        "period": 4,
        "symbol": "Se",
        "xpos": 16,
        "ypos": 4
    }, {
        "name": "Bromine",
        "atomic_mass": 79.904,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 35,
        "period": 4,
        "symbol": "Br",
        "xpos": 17,
        "ypos": 4
    }, {
        "name": "Krypton",
        "atomic_mass": 83.7982,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 36,
        "period": 4,
        "symbol": "Kr",
        "xpos": 18,
        "ypos": 4
    }, {
        "name": "Rubidium",
        "atomic_mass": 85.46783,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 31.06,
        "number": 37,
        "period": 5,
        "symbol": "Rb",
        "xpos": 1,
        "ypos": 5
    }, {
        "name": "Strontium",
        "atomic_mass": 87.621,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 26.4,
        "number": 38,
        "period": 5,
        "symbol": "Sr",
        "xpos": 2,
        "ypos": 5
    }, {
        "name": "Yttrium",
        "atomic_mass": 88.905842,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 26.53,
        "number": 39,
        "period": 5,
        "symbol": "Y",
        "xpos": 3,
        "ypos": 5
    }, {
        "name": "Zirconium",
        "atomic_mass": 91.2242,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 25.36,
        "number": 40,
        "period": 5,
        "symbol": "Zr",
        "xpos": 4,
        "ypos": 5
    }, {
        "name": "Niobium",
        "atomic_mass": 92.906372,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 24.6,
        "number": 41,
        "period": 5,
        "symbol": "Nb",
        "xpos": 5,
        "ypos": 5
    }, {
        "name": "Molybdenum",
        "atomic_mass": 95.951,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 24.06,
        "number": 42,
        "period": 5,
        "symbol": "Mo",
        "xpos": 6,
        "ypos": 5
    }, {
        "name": "Technetium",
        "atomic_mass": 98,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 24.27,
        "number": 43,
        "period": 5,
        "symbol": "Tc",
        "xpos": 7,
        "ypos": 5
    }, {
        "name": "Ruthenium",
        "atomic_mass": 101.072,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 24.06,
        "number": 44,
        "period": 5,
        "symbol": "Ru",
        "xpos": 8,
        "ypos": 5
    }, {
        "name": "Rhodium",
        "atomic_mass": 102.905502,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 24.98,
        "number": 45,
        "period": 5,
        "symbol": "Rh",
        "xpos": 9,
        "ypos": 5
    }, {
        "name": "Palladium",
        "atomic_mass": 106.421,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 25.98,
        "number": 46,
        "period": 5,
        "symbol": "Pd",
        "xpos": 10,
        "ypos": 5
    }, {
        "name": "Silver",
        "atomic_mass": 107.86822,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 25.35,
        "number": 47,
        "period": 5,
        "symbol": "Ag",
        "xpos": 11,
        "ypos": 5
    }, {
        "name": "Cadmium",
        "atomic_mass": 112.4144,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 26.02,
        "number": 48,
        "period": 5,
        "symbol": "Cd",
        "xpos": 12,
        "ypos": 5
    }, {
        "name": "Indium",
        "atomic_mass": 114.8181,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 26.74,
        "number": 49,
        "period": 5,
        "symbol": "In",
        "xpos": 13,
        "ypos": 5
    }, {
        "name": "Tin",
        "atomic_mass": 118.7107,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 27.112,
        "number": 50,
        "period": 5,
        "symbol": "Sn",
        "xpos": 14,
        "ypos": 5
    }, {
        "name": "Antimony",
        "atomic_mass": 121.7601,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 25.23,
        "number": 51,
        "period": 5,
        "symbol": "Sb",
        "xpos": 15,
        "ypos": 5
    }, {
        "name": "Tellurium",
        "atomic_mass": 127.603,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 25.73,
        "number": 52,
        "period": 5,
        "symbol": "Te",
        "xpos": 16,
        "ypos": 5
    }, {
        "name": "Iodine",
        "atomic_mass": 126.904473,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 53,
        "period": 5,
        "symbol": "I",
        "xpos": 17,
        "ypos": 5
    }, {
        "name": "Xenon",
        "atomic_mass": 131.2936,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 54,
        "period": 5,
        "symbol": "Xe",
        "xpos": 18,
        "ypos": 5
    }, {
        "name": "Cesium",
        "atomic_mass": 132.905451966,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 32.21,
        "number": 55,
        "period": 6,
        "symbol": "Cs",
        "xpos": 1,
        "ypos": 6
    }, {
        "name": "Barium",
        "atomic_mass": 137.3277,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 28.07,
        "number": 56,
        "period": 6,
        "symbol": "Ba",
        "xpos": 2,
        "ypos": 6
    }, {
        "name": "Lanthanum",
        "atomic_mass": 138.905477,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 27.11,
        "number": 57,
        "period": 6,
        "symbol": "La",
        "xpos": 3,
        "ypos": 9
    }, {
        "name": "Cerium",
        "atomic_mass": 140.1161,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 26.94,
        "number": 58,
        "period": 6,
        "symbol": "Ce",
        "xpos": 4,
        "ypos": 9
    }, {
        "name": "Praseodymium",
        "atomic_mass": 140.907662,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 27.2,
        "number": 59,
        "period": 6,
        "symbol": "Pr",
        "xpos": 5,
        "ypos": 9
    }, {
        "name": "Neodymium",
        "atomic_mass": 144.2423,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 27.45,
        "number": 60,
        "period": 6,
        "symbol": "Nd",
        "xpos": 6,
        "ypos": 9
    }, {
        "name": "Promethium",
        "atomic_mass": 145,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 61,
        "period": 6,
        "symbol": "Pm",
        "xpos": 7,
        "ypos": 9
    }, {
        "name": "Samarium",
        "atomic_mass": 150.362,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 29.54,
        "number": 62,
        "period": 6,
        "symbol": "Sm",
        "xpos": 8,
        "ypos": 9
    }, {
        "name": "Europium",
        "atomic_mass": 151.9641,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 27.66,
        "number": 63,
        "period": 6,
        "symbol": "Eu",
        "xpos": 9,
        "ypos": 9
    }, {
        "name": "Gadolinium",
        "atomic_mass": 157.253,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 37.03,
        "number": 64,
        "period": 6,
        "symbol": "Gd",
        "xpos": 10,
        "ypos": 9
    }, {
        "name": "Terbium",
        "atomic_mass": 158.925352,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 28.91,
        "number": 65,
        "period": 6,
        "symbol": "Tb",
        "xpos": 11,
        "ypos": 9
    }, {
        "name": "Dysprosium",
        "atomic_mass": 162.5001,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 27.7,
        "number": 66,
        "period": 6,
        "symbol": "Dy",
        "xpos": 12,
        "ypos": 9
    }, {
        "name": "Holmium",
        "atomic_mass": 164.930332,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 27.15,
        "number": 67,
        "period": 6,
        "symbol": "Ho",
        "xpos": 13,
        "ypos": 9
    }, {
        "name": "Erbium",
        "atomic_mass": 167.2593,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 28.12,
        "number": 68,
        "period": 6,
        "symbol": "Er",
        "xpos": 14,
        "ypos": 9
    }, {
        "name": "Thulium",
        "atomic_mass": 168.934222,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 27.03,
        "number": 69,
        "period": 6,
        "symbol": "Tm",
        "xpos": 15,
        "ypos": 9
    }, {
        "name": "Ytterbium",
        "atomic_mass": 173.0451,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 26.74,
        "number": 70,
        "period": 6,
        "symbol": "Yb",
        "xpos": 16,
        "ypos": 9
    }, {
        "name": "Lutetium",
        "atomic_mass": 174.96681,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 26.86,
        "number": 71,
        "period": 6,
        "symbol": "Lu",
        "xpos": 17,
        "ypos": 9
    }, {
        "name": "Hafnium",
        "atomic_mass": 178.492,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 25.73,
        "number": 72,
        "period": 6,
        "symbol": "Hf",
        "xpos": 4,
        "ypos": 6
    }, {
        "name": "Tantalum",
        "atomic_mass": 180.947882,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 25.36,
        "number": 73,
        "period": 6,
        "symbol": "Ta",
        "xpos": 5,
        "ypos": 6
    }, {
        "name": "Tungsten",
        "atomic_mass": 183.841,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 24.27,
        "number": 74,
        "period": 6,
        "symbol": "W",
        "xpos": 6,
        "ypos": 6
    }, {
        "name": "Rhenium",
        "atomic_mass": 186.2071,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 25.48,
        "number": 75,
        "period": 6,
        "symbol": "Re",
        "xpos": 7,
        "ypos": 6
    }, {
        "name": "Osmium",
        "atomic_mass": 190.233,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 24.7,
        "number": 76,
        "period": 6,
        "symbol": "Os",
        "xpos": 8,
        "ypos": 6
    }, {
        "name": "Iridium",
        "atomic_mass": 192.2173,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 25.1,
        "number": 77,
        "period": 6,
        "symbol": "Ir",
        "xpos": 9,
        "ypos": 6
    }, {
        "name": "Platinum",
        "atomic_mass": 195.0849,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 25.86,
        "number": 78,
        "period": 6,
        "symbol": "Pt",
        "xpos": 10,
        "ypos": 6
    }, {
        "name": "Gold",
        "atomic_mass": 196.9665695,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 25.418,
        "number": 79,
        "period": 6,
        "symbol": "Au",
        "xpos": 11,
        "ypos": 6
    }, {
        "name": "Mercury",
        "atomic_mass": 200.5923,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 27.983,
        "number": 80,
        "period": 6,
        "symbol": "Hg",
        "xpos": 12,
        "ypos": 6
    }, {
        "name": "Thallium",
        "atomic_mass": 204.38,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 26.32,
        "number": 81,
        "period": 6,
        "symbol": "Tl",
        "xpos": 13,
        "ypos": 6
    }, {
        "name": "Lead",
        "atomic_mass": 207.21,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 26.65,
        "number": 82,
        "period": 6,
        "symbol": "Pb",
        "xpos": 14,
        "ypos": 6
    }, {
        "name": "Bismuth",
        "atomic_mass": 208.980401,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 25.52,
        "number": 83,
        "period": 6,
        "symbol": "Bi",
        "xpos": 15,
        "ypos": 6
    }, {
        "name": "Polonium",
        "atomic_mass": 209,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 26.4,
        "number": 84,
        "period": 6,
        "symbol": "Po",
        "xpos": 16,
        "ypos": 6
    }, {
        "name": "Astatine",
        "atomic_mass": 210,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 85,
        "period": 6,
        "symbol": "At",
        "xpos": 17,
        "ypos": 6
    }, {
        "name": "Radon",
        "atomic_mass": 222,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 86,
        "period": 6,
        "symbol": "Rn",
        "xpos": 18,
        "ypos": 6
    }, {
        "name": "Francium",
        "atomic_mass": 223,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 87,
        "period": 7,
        "symbol": "Fr",
        "xpos": 1,
        "ypos": 7
    }, {
        "name": "Radium",
        "atomic_mass": 226,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 88,
        "period": 7,
        "symbol": "Ra",
        "xpos": 2,
        "ypos": 7
    }, {
        "name": "Actinium",
        "atomic_mass": 227,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 27.2,
        "number": 89,
        "period": 7,
        "symbol": "Ac",
        "xpos": 3,
        "ypos": 10
    }, {
        "name": "Thorium",
        "atomic_mass": 232.03774,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 26.23,
        "number": 90,
        "period": 7,
        "symbol": "Th",
        "xpos": 4,
        "ypos": 10
    }, {
        "name": "Protactinium",
        "atomic_mass": 231.035882,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 91,
        "period": 7,
        "symbol": "Pa",
        "xpos": 5,
        "ypos": 10
    }, {
        "name": "Uranium",
        "atomic_mass": 238.028913,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 27.665,
        "number": 92,
        "period": 7,
        "symbol": "U",
        "xpos": 6,
        "ypos": 10
    }, {
        "name": "Neptunium",
        "atomic_mass": 237,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 29.46,
        "number": 93,
        "period": 7,
        "symbol": "Np",
        "xpos": 7,
        "ypos": 10
    }, {
        "name": "Plutonium",
        "atomic_mass": 244,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 35.5,
        "number": 94,
        "period": 7,
        "symbol": "Pu",
        "xpos": 8,
        "ypos": 10
    }, {
        "name": "Americium",
        "atomic_mass": 243,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": 62.7,
        "number": 95,
        "period": 7,
        "symbol": "Am",
        "xpos": 9,
        "ypos": 10
    }, {
        "name": "Curium",
        "atomic_mass": 247,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 96,
        "period": 7,
        "symbol": "Cm",
        "xpos": 10,
        "ypos": 10
    }, {
        "name": "Berkelium",
        "atomic_mass": 247,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 97,
        "period": 7,
        "symbol": "Bk",
        "xpos": 11,
        "ypos": 10
    }, {
        "name": "Californium",
        "atomic_mass": 251,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 98,
        "period": 7,
        "symbol": "Cf",
        "xpos": 12,
        "ypos": 10
    }, {
        "name": "Einsteinium",
        "atomic_mass": 252,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 99,
        "period": 7,
        "symbol": "Es",
        "xpos": 13,
        "ypos": 10
    }, {
        "name": "Fermium",
        "atomic_mass": 257,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 100,
        "period": 7,
        "symbol": "Fm",
        "xpos": 14,
        "ypos": 10
    }, {
        "name": "Mendelevium",
        "atomic_mass": 258,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 101,
        "period": 7,
        "symbol": "Md",
        "xpos": 15,
        "ypos": 10
    }, {
        "name": "Nobelium",
        "atomic_mass": 259,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 102,
        "period": 7,
        "symbol": "No",
        "xpos": 16,
        "ypos": 10
    }, {
        "name": "Lawrencium",
        "atomic_mass": 266,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 103,
        "period": 7,
        "symbol": "Lr",
        "xpos": 17,
        "ypos": 10
    }, {
        "name": "Rutherfordium",
        "atomic_mass": 267,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 104,
        "period": 7,
        "symbol": "Rf",
        "xpos": 4,
        "ypos": 7
    }, {
        "name": "Dubnium",
        "atomic_mass": 268,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 105,
        "period": 7,
        "symbol": "Db",
        "xpos": 5,
        "ypos": 7
    }, {
        "name": "Seaborgium",
        "atomic_mass": 269,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 106,
        "period": 7,
        "symbol": "Sg",
        "xpos": 6,
        "ypos": 7
    }, {
        "name": "Bohrium",
        "atomic_mass": 270,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 107,
        "period": 7,
        "symbol": "Bh",
        "xpos": 7,
        "ypos": 7
    }, {
        "name": "Hassium",
        "atomic_mass": 269,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 108,
        "period": 7,
        "symbol": "Hs",
        "xpos": 8,
        "ypos": 7
    }, {
        "name": "Meitnerium",
        "atomic_mass": 278,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 109,
        "period": 7,
        "symbol": "Mt",
        "xpos": 9,
        "ypos": 7
    }, {
        "name": "Darmstadtium",
        "atomic_mass": 281,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 110,
        "period": 7,
        "symbol": "Ds",
        "xpos": 10,
        "ypos": 7
    }, {
        "name": "Roentgenium",
        "atomic_mass": 282,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 111,
        "period": 7,
        "symbol": "Rg",
        "xpos": 11,
        "ypos": 7
    }, {
        "name": "Copernicium",
        "atomic_mass": 285,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 112,
        "period": 7,
        "symbol": "Cn",
        "xpos": 12,
        "ypos": 7
    }, {
        "name": "Nihonium",
        "atomic_mass": 286,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 113,
        "period": 7,
        "symbol": "Nh",
        "xpos": 13,
        "ypos": 7
    }, {
        "name": "Flerovium",
        "atomic_mass": 289,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 114,
        "period": 7,
        "symbol": "Fl",
        "xpos": 14,
        "ypos": 7
    }, {
        "name": "Moscovium",
        "atomic_mass": 289,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 115,
        "period": 7,
        "symbol": "Mc",
        "xpos": 15,
        "ypos": 7
    }, {
        "name": "Livermorium",
        "atomic_mass": 293,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 116,
        "period": 7,
        "symbol": "Lv",
        "xpos": 16,
        "ypos": 7
    }, {
        "name": "Tennessine",
        "atomic_mass": 294,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 117,
        "period": 7,
        "symbol": "Ts",
        "xpos": 17,
        "ypos": 7
    }, {
        "name": "Oganesson",
        "atomic_mass": 294,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 118,
        "period": 7,
        "symbol": "Og",
        "xpos": 18,
        "ypos": 7
    }, {
        "name": "Ununennium",
        "atomic_mass": 315,
        "stashLink": undefined,
        "stashPanel": undefined,
        "molar_heat": null,
        "number": 119,
        "period": 8,
        "symbol": "Uue",
        "xpos": 1,
        "ypos": 8
    }];
elements.init = () => {
    elements.map = new Map();
    elements.list.forEach((value) => {
        elements.map.set(value.name, value);
        elements.map.set(value.symbol, value);
    });
};
elements.combine = (a, b) => {
    if ((a === undefined) || (b === undefined)) return undefined;

    let elementA = a;
    let elementB = b;
    if (a.symbol !== undefined) elementA = a.symbol;
    if (b.symbol !== undefined) elementB = b.symbol;

    let foundA = elements.map.get(elementA);
    let foundB = elements.map.get(elementB);

    if (foundA === null || foundB === null) return undefined;
    if (foundA === undefined && foundB === undefined) return undefined;
    if (foundA === undefined && foundB !== undefined) {
        foundA = foundB;
    } else if (foundB === undefined && foundA !== undefined) {
        foundB = foundA;
    }

    let mass = Math.floor(foundA.atomic_mass + foundB.atomic_mass);
    return elements.list.find((value) => {
        return Math.floor(value.atomic_mass) === mass;
    });
};
elements.getHTML = (elementInput, style= undefined) => {
    if (style === undefined) {
        style = game.options.elemental.toLowerCase();
    } else {
        style = style.toLowerCase();
    }
    const element = elements.map.get(elementInput);
    if (element === undefined) {
        if (elementInput === 'Energy') {
            switch (style) {
                case 'short':
                    return 'eV';
                case 'name':
                case 'long':
                    return 'Energy';
                case 'aze-short':
                case 'aze':
                    const main = document.createElement('span');
                    main.classList.add('aze-main');
                    const spanAZ = document.createElement('span');
                    spanAZ.classList.add('aze-span');
                    main.append(spanAZ);

                    const mass = document.createElement('sup');
                    mass.innerHTML = '&nbsp;';
                    mass.classList.add('aze');

                    const number = document.createElement('sub');
                    number.innerHTML = '&nbsp;';
                    number.classList.add('aze');

                    spanAZ.append(mass);
                    spanAZ.append(document.createElement('br'));
                    spanAZ.append(number);

                    main.append('eV');
                    return main;
            }
        }else{
            return '';
        }
    }

    switch (style) {
        case 'short':
            return element.symbol;
        case 'name':
            return element.name;
        case 'long':
            if (element.symbol === 'eV') {
                return element.name;
            } else {
                return element.name + '-' + Math.floor(element.atomic_mass);
            }
        case 'aze-short':
        case 'aze':
            const main = document.createElement('span');
            main.classList.add('aze-main');
            const spanAZ = document.createElement('span');
            spanAZ.classList.add('aze-span');
            main.append(spanAZ);

            const mass = document.createElement('sup');//total number of nucleons
            if (element.symbol === 'eV') {
                mass.innerHTML = '&nbsp;';
            } else {
                mass.innerHTML = Math.floor(element.atomic_mass);
            }
            mass.classList.add('aze');

            const number = document.createElement('sub'); //Index-number
            if (style === 'aze') {
                number.innerHTML = element.number;
            } else {
                number.innerHTML = '&nbsp;';
            }
            number.classList.add('aze');

            spanAZ.append(mass);
            spanAZ.append(document.createElement('br'));
            spanAZ.append(number);

            //A budge because I treat Deuterium and Tritium as separate Elements from Hydrogen
            if (element.symbol === 'D' || element.symbol === 'T') {
                main.append('H');
            } else {
                main.append(element.symbol);
            }

            return main;
    }
};
elements.find = (a) => {
    if (a === undefined) return undefined;
    if (typeof a === 'string') return elements.map.get(a);
    if (a.name !== undefined) return elements.map.get(a.name);
    if (a.symbol !== undefined) return elements.map.get(a.symbol);

    return undefined;
};