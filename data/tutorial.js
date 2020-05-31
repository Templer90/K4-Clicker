game.t.tutorialMessages = [
    {
        header: "Welcome to [GAME_NAME]",
        desc: "Welcome to [GAME_NAME]<br>Do you wish to see the tutorial? <br><div class='row'>" +
            '<a id="tut-start" type="button" class="col-md-8 btn btn-sm btn-success" onClick="game.t.startTutorial();"> Yes </a>' +
            '<a id="tut-end" type="button" class="col-md-4 btn btn-sm btn-danger" onClick="game.t.endTutorial();"> No </a>' +
            '</div>',
        test: () => {
            return false;
        }
    },
    {
        header: "Tutorial",
        desc: "This Tutorial will give you a rundown of all the features of [GAME_NAME].<br>",
        test: () => {
            return true;
        }
    },
    {
        header: "Tutorial Goal #1",
        desc: "The most simplest way of obtaining Atoms is to create/find them in the wild.<br>Click on the 'Create Hydrogen'-Button and get 20 Hydrogen",
        test: () => {
            return game.resources.owned.Hydrogen >= 20;
        }
    },
    {
        header: "Tutorial Goal #2",
        desc: "Of course with just some Atoms you can not do much.<br>Click on the 'Create Energy'-Button and get <br>20 Energy",
        test: () => {
            return game.resources.owned.Energy >= 20;
        }
    },
    {
        header: "Tutorial Goal #3",
        desc: "Now click on Stash and see what you have gathered up to now.<br>Also try clicking on an Element and see some information about it.<br>Come back after.",
        test: () => {
            return game.currentTab === 'stash';
        }
    },
    {
        header: "Tutorial Goal #4",
        desc: "Now we use these Atoms and Energy. Click on 'Upgrades' and buy one of the 2 available Upgrades: 'Energy I' or 'Hydrogen I'<br>",
        test: () => {
            return game.upgrades.owned['Hydrogen_I'] || game.upgrades.owned['Energy_I'];
        }
    },
    {
        header: "Collider Info",
        desc: "Click and hold the Left Mousebutton to create an Emmiter.<br>Move the small circle (or the Emitter itself) to reorintate the trajectory of the emitted Atom.<br>Click on an Emitter to select it. You can change the energy of the emitted Atom.<br>Overlay the pathes to fuse the Atoms (if they have the energy).<br>",
        test: () => {
            return true;
        }
    },
    {
        header: "Tutorial Goal #5",
        desc: "Create 2 Deuterium.",
        test: () => {
            if (game.resources.owned.Deuterium >= 2) {
                game.collider.options.inputEfficiency = 1;
                return true;
            } else {
                game.collider.options.inputEfficiency = 30;
                return false;
            }
        }
    },
    {
        header: "Done",
        desc: "Have fun with [GAME_NAME]",
        test: () => {
            game.t.done = true;
            return false;
        }
    }
];

game.t.messages = {
    "noTutorial": {
        header: "Have Fun Playing [GAME_NAME]",
        desc: "Have Fun Playing [GAME_NAME]<br><br>"
    },
    "welcomeBack": {
        header: "Welcome Back to [GAME_NAME]",
        desc: "You were gone for [timeString], in total [seconds] seconds."
    },
};
