'use strict';

const inquirer = require('inquirer'),
    figlet = require('figlet'),
    format = require('util').format;

const constants = require('../../utils/consts'),
    logger = require('../../utils/logger');

class UserInteractionUi {
    static welcomeUser(msg) {
        logger.debug(format("UserInteractionUi welcomeUser"));
        console.log(figlet.textSync(constants.GAME_NAME, {horizontalLayout: 'full'}));
        console.log(msg);
    }

    static getUserPredefinedGame(gamesList) {
        logger.debug(format("UserInteractionUi getUserPredefinedGame. input-> gamesList: %s", gamesList));
        let question = [{
            name: 'game',
            type: 'list',
            message: 'Please choose your game: ',
            choices: gamesList
        }];
        return inquirer.prompt(question)
            .then((answer) => {
                return Promise.resolve(answer.game);
            }).catch((error => {
                logger.error(format("UserInteractionUi getUserPredefinedGame. error: %s. input-> gamesList: %s", error, gamesList));
                return Promise.reject(error);
            }));
    }


    static printGeneration(gen) {
        console.log('\nGeneration: ', gen);
    }

    static printFinished() {
        console.log('\nGAME OVER!\n');
    }
}

module.exports = UserInteractionUi;