//https://github.com/Bowserinator/#mic-Table-JSON/blob/master/#micTableJSON.json
//https://physics.nist.gov/cgi-bin/Compositions/stand_alone.pl?ele=&all=all&ascii=ascii2&isotype=all
const elements = e = {};
elements.ProtonMass = 1.007825;
elements.NeutronMass = 1.00866491595;
elements.avogadro = 6.02214076e+23;
elements.amu = 1.66054e-27; // Atomic Mass Unit per kg
elements.meVPerU = 931.494; // MeV/c^2
elements.MeV = 931494102.4228; // MeV/c^2
elements.c = 299792458; // Lightspeed m/s
elements.c2 = elements.c * elements.c; // Lightspeed Squared
elements.longNameSeperator = '-';

elements.list = [];


// Initial Loading of elements
fetch('data/elements.json')
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        elements.list = data.data;
        elements.map = new Map();
        elements.list.forEach((element) => {
            elements.map.set(element.name, element);
            elements.map.set(element.symbol, element);

            element.stashLink = undefined;
            element.stashPanel = undefined;
        });
    });


elements.getStats = (name) => {
    const elem = elements.find(name);
    if (elem === undefined) return undefined;

    const num = elem['#m'];
    const neu = Math.floor(elem['atomic_mass']) - num;

    const realEn = (elem['atomic_mass']) / elements.MeV;
    const theoEn = ((num + neu)) / elements.MeV;

    return {
        number: num,
        protons: num,
        neutrons: neu,
        combined: num + neu,
        diff: (theoEn / realEn) * 100
    }
};
elements.init = () => {
    //elements.map = new Map();
    //elements.list.forEach((element) => {
    //    elements.map.set(element.name, element);
    //    elements.map.set(element.symbol, element);
    //    element.stashLink = undefined;
    //    element.stashPanel = undefined;
    //});
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
elements.getHTML = (elementInput, style = undefined) => {
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
        } else {
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
                return element.name + elements.longNameSeperator + Math.floor(element.atomic_mass);
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

elements.findIsotope = (a) => {
    if (a === undefined) return new Invalid();
    if (a instanceof Isotope) {
        return new Isotope(a.protons, a.neutrons);
    }
    
    let atomicIndex = '';

    let name = '';
    if (a.includes(elements.longNameSeperator)) {
        const split = a.split(elements.longNameSeperator);
        name = split[0];
        atomicIndex = split[1];
    } else {
        name = a;
    }

    const element = elements.map.get(name);
    if (element === undefined) return new Invalid();
    if (atomicIndex === '') {
        return new Isotope(element);
    }
    
    const iso = element.isotopes.find((e) => e['#m'] == atomicIndex)
    if (iso === undefined) {
        return new Invalid();
    }else{
        return new Isotope(element, iso['#m']);
    }
};