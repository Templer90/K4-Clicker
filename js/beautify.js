var numbers = {};
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
