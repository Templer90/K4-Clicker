game.tutorial = game.t = {};
game.t.counter = 0;
game.t.done = false;
game.t.list = [
    {
        header: "Welcome to " + game.gameName,
        desc: "Welcome to " + game.gameName + "<br>Do you wish to see the tutorial? <br><div class='row'>" +
            '<a id="tut-start" type="button" class="col-md-8 btn btn-sm btn-success" onClick="game.t.startTutorial();"> Yes </a>' +
            '<a id="tut-end" type="button" class="col-md-4 btn btn-sm btn-danger" onClick="game.t.endTutorial();"> No </a>' +
            '</div>',
        test: () => {
            return false;
        }
    },
    {
        header: "Get",
        desc: "Get 10 Hydrogen",
        test: () => {
            return game.resources.owned.Hydrogen >= 10;
        }
    },
    {
        header: "Done",
        desc: "Have fun with " + game.gameName,
        test: () => {
            game.t.done = true;
            return false;
        }
    }
];
game.tutorial.startTutorial = function () {
    document.getElementById("tut-start").remove();
    document.getElementById("tut-end").remove();

    game.tutorial.next();
};
game.tutorial.endTutorial = function () {
    document.getElementById("tut-start").remove();
    document.getElementById("tut-end").remove();
    game.t.counter = game.t.list.length;
    game.t.done = true;
};
game.tutorial.next = function () {
    game.t.counter++;
    game.tutorial.tutorial();
};
game.tutorial.tutorial = function () {
    if ((game.t.counter === game.t.list.length) || (game.t.done === true)) {
        return;
    }
    const data = game.t.list[game.t.counter];
    game.tutorial.genText(data.header, data.desc);
};
game.tutorial.genText = (title, text, func) => {
    let main = document.createElement('div');
    main.setAttribute('id', 'tutorial-' + title.replace(' ', '_'));
    main.setAttribute('class', 'row bottom-spacer outlined');

    let infoBox = document.createElement('p');
    infoBox.setAttribute('class', 'col-md-12 text-center');
    infoBox.innerHTML = title;
    main.append(infoBox);

    let paragraph = document.createElement('p');
    paragraph.setAttribute('class', 'col-md-12');
    paragraph.innerHTML = text;
    main.append(paragraph);

    document.getElementById('log-well').appendChild(main);
};
game.tutorial.check = () => {
    if (game.t.list[game.t.counter].test()) {
        game.tutorial.next();
    }
};
game.tutorial.checkSave = function () {
    if ( game.t.counter === game.t.list.length) {
        game.t.done = true;
        return;
    }

    for (let i = 1; i < game.t.counter; i++) {
        const data = game.t.list[i];
        game.tutorial.genText(data.header, data.desc);
    }
    
    $("#btn-hydrogen, #btn-collider, #resources-well").fadeIn('slow');
    if (true) {
        $("#btn-2-1, #upgrades-nav").fadeIn('slow');

        $("#btn-energy, #btn-3-2, #btn-2-1, #upgrades-nav").fadeIn('slow');

        $("#btn-energy, #btn-3-2, #btn-2-1, #upgrades-nav, #btn-3-3").fadeIn('slow');

        $("#btn-energy, #btn-3-2, #btn-2-1, #upgrades-nav, #btn-3-1, #btn-buy-multiplier, #builds-nav, #dropdown-nav").fadeIn('slow');
        $("#btn-3-2").css('display', 'none');
        $("#log-well").append('<p class="no-margin"><span id="log-back"></span></p>');
        //$("#log-back").typed({
        //    strings: [game.t.back.string],
        //    typeSpeed: 1,
        //    callback: function () {
        //        h.removeCursor();
        //    }
        //});
    }
};