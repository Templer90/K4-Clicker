const numbers = {};
numbers.prefixes = ["million ", "billion ", "trillion ", "quadrillion ", "quintillion ", "sextillion ", "septillion ", "octillion ", "nonillion ",
    "decillion ", "undecillion ", "duodecillion ", "tredecillion ", "quattuordecillion ", "quindecillion ", "sexdecillion ", "septendecillion ", "octodecillion ", "novemdecillion ",
    "vigintillion ", "unvigintillion ", "duovigintillion ", "trevigintillion ", "quattuorvigintillion ", "quinvigintillion ", "sexvigintillion ", "septenvigintillion ", "octovigintillion ", "novemvigintillion ",
    "trigintillion ", "untrigintillion ", "duotrigintillion ", "tretrigintillion ", "quattuortrigintillion ", "quintrigintillion ", "sextrigintillion ", "septentrigintillion ", "octotrigintillion ", "novemtrigintillion ",
    "quadragintillion ", "unquadragintillion ", "duoquadragintillion ", "trequadragintillion ", "quattuorquadragintillion ", "quinquadragintillion ", "sexquadragintillion ", "septenquadragintillion ", "octoquadragintillion ", "novemquadragintillion ",
    "quinquagintillion "];
numbers.beautify = function beautify(x, n) {
    if (typeof x === 'string') return x;
    if (x >= 1e6) {
        const z = Math.floor(numbers.logFloor(x) / 3);

        const s = beautify(x / Math.pow(10, 3 * z), n);
        return s + " " + numbers.prefixes[z - 2];
    } else {
        return numbers.numberWithCommas(x.toFixed(n));
    }
};
numbers.massString = (mass, targetUnit, places = 22, pad = 20) => {
    return numbers.zeroPad(numbers.beautify(numbers.mass(mass, targetUnit, pad)), places) + ' ' + targetUnit;
};
numbers.temperature = (celsius, target) => {
    if (target === 'C') return celsius;
    if (target === 'F') return (9.0 / 5.0) * celsius + 32;
    if (target === 'K') return celsius + 273;
};
numbers.mass = (kg, target) => {
    if (target === 'kg') return kg;
    if (target === 'lbs') return 2.204622622 * kg;
};
numbers.zeroPad = (num, places) => {
    return String(num).padStart(places, '0');
};
numbers.numberWithCommas = function (n) {
    const parts = n.toString().split(".");
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
};
numbers.logFloor = function (x) {
    if (x < 10e40) {
        let count = 0;
        while (x >= 10) {
            count++;
            x /= 10;
        }
        return count;
    } else {

        return Math.floor(Math.log10(x));
    }
};
numbers.fix = function (x, n) {
    if (n === 3)
        return numbers.beautify(x, 3);
    if (n === 2)
        if (x >= 1e6)
            return numbers.beautify(x, 3);
        else
            return numbers.beautify(x, 2);
    if (n === 0)
        if (x >= 1e6)
            return numbers.beautify(x, 3);
        else
            return numbers.beautify(x, 0);
};
numbers.element = function (value) {
    return numbers.fix(value, 0) + ((value > elements.avogadro) ? " " + numbers.fix(value / elements.avogadro, 0) + " mol" : "");
};

numbers.secondsToFormat = function (interval) {
    const cbFun = (d, c) => {
        let bb = d[1] % c[0],
            aa = (d[1] - bb) / c[0];
        aa = aa > 0 ? aa + c[1] : '';

        return [d[0] + aa, bb];
    };

    const levels = {
        scale: [24, 60, 60, 1],
        units: ['d ', 'h ', 'm ', 's ']
    }

    const rslt = levels.scale.map(
        (d, i, a) =>
            a.slice(i).reduce((d, c) => d * c)
    )
        .map((d, i) => ([d, levels.units[i]]))
        .reduce(cbFun, ['', interval]);
    
    return rslt[0];
};
