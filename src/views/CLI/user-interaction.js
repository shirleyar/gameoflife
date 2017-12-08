'use strict';

const inquirer = require('inquirer'),
    figlet = require('figlet');

const constants = require('../../utils/consts');

class UserInteractionUi {
    static welcomeUser(msg) {
        console.log(figlet.textSync(constants.GAME_NAME, {horizontalLayout: 'full'}));
        console.log(msg);
    }

    static getUserPredefinedGame (gamesList) {
        let question = [{
            name: 'game',
            type: 'list',
            message: 'Please choose your game: ',
            choices: gamesList
        }];
        return inquirer.prompt(question)
            .then((answer) => {
            return Promise.resolve(answer.game);
            })
    }


    static printGeneration (gen){
        console.log('\nGeneration: ', gen);
    }

    static printFinished() {
        console.log('\nGAME OVER!\n');
    }
}

module.exports = UserInteractionUi;