game.tutorial = game.t = {};
game.t.counter = 0;
game.t.done = false;
game.t.tutorialMessages = [];
game.t.messages = {};
game.t.standartTemplates = {"[GAME_NAME]": game.gameName};

templateFormatter = (input, replacementArray = undefined) => {
    if (replacementArray === undefined) replacementArray = game.t.standartTemplates;
    Object.keys(replacementArray).forEach((replacementKey) => {
        input = input.replace(replacementKey, replacementArray[replacementKey]);
    });
    return input
}

game.tutorial.startTutorial = function () {
    document.getElementById("tut-start").remove();
    document.getElementById("tut-end").remove();

    game.tutorial.next();
};
game.tutorial.endTutorial = function () {
    document.getElementById("tut-start").remove();
    document.getElementById("tut-end").remove();

    game.tutorial.genMessageText("noTutorial");
    
    game.t.counter = game.t.tutorialMessages.length;
    game.t.done = true;
};
game.tutorial.next = function () {
    game.t.counter++;
    game.tutorial.tutorial();
};
game.tutorial.tutorial = function () {
    if ((game.t.counter === game.t.tutorialMessages.length) || (game.t.done === true)) {
        return;
    }
    const data = game.t.tutorialMessages[game.t.counter];
    game.tutorial.genText(data.header, data.desc);
};

game.tutorial.genMessageText = (MessageKey) => {
    const message=game.t.messages[MessageKey]
    game.tutorial.genText(message.header, message.desc);
};

game.tutorial.genText = (title, text, func) => {
    let main = document.createElement('div');
    main.setAttribute('id', 'tutorial-' + title.replace(' ', '_'));
    main.setAttribute('class', 'row bottom-spacer outlined');

    let infoBox = document.createElement('p');
    infoBox.setAttribute('class', 'col-md-12 text-center');
    infoBox.innerHTML = templateFormatter(title);
    main.append(infoBox);

    let paragraph = document.createElement('p');
    paragraph.setAttribute('class', 'col-md-12');
    paragraph.innerHTML =  templateFormatter(text);
    main.append(paragraph);

    document.getElementById('log-well').appendChild(main);
    main.scrollIntoView();
};
game.tutorial.check = () => {
    if (game.t.tutorialMessages[game.t.counter].test()) {
        game.tutorial.next();
    }
};
game.tutorial.checkSave = function () {
    if ( game.t.counter === game.t.tutorialMessages.length) {
        game.t.done = true;
        return;
    }

    for (let i = 1; i < game.t.counter; i++) {
        const data = game.t.tutorialMessages[i];
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