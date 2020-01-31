jQuery.fn.typed = function (options) {
    let obj = jQuery(this[0]);
    obj.html(options.strings.join());
    options.callback();
    return this;
};