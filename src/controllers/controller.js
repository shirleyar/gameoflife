'use strict';

const GameOfLife = require('../models/GameOfLife'),
    UserInteractionUi = require('../views/CLI/user-interaction'),
    BoardUI = require('../views/CLI/BoardUiCli'),
    predefinedGames = require('../models/predefinedGames'),
    constantsGeneral = require('../utils/consts'),
    constantsUI = require('../views/CLI/consts'),
    logger = require('../utils/logger');

const events = require('events'),
    util = require('util');

class ControllerGameOfLife {
    constructor() {
        this.game = undefined;
        this.boardUi = undefined;
        this.rows = undefined;
        this.cols = undefined;
        this.eventEmitter = new events.EventEmitter();
    }

    startGame() {
        UserInteractionUi.welcomeUser(util.format(constantsGeneral.WELCOME_MSG, constantsGeneral.NEXT_THE_SAME, constantsGeneral.NEXT_ALIVE));
        const gameNames = predefinedGames.getGamesNames();
        return UserInteractionUi.getUserPredefinedGame(gameNames)
            .then((name) => {
                try {
                    let game = predefinedGames.getGameByName(name);
                    this.rows = game.rows;
                    this.cols = game.cols;
                    this.game = new GameOfLife(game.rows, game.cols, game.generations, this.eventEmitter, game.intervals);
                    this.game.init(game.livingCells);
                    this.boardUi = new BoardUI(this.convertGameBoardToUiData());
                    this.boardUi.printBoard();
                    UserInteractionUi.printGeneration(this.game.Generation);
                    this.eventEmitter.on(constantsGeneral.EVENT_UPDATED_GENERATION, this.onGenerationUpdate.bind(this));
                    this.eventEmitter.on(constantsGeneral.EVENT_STOPPED, ControllerGameOfLife.onStop);
                    this.game.start(game.livingCells);
                } catch (error) {
                    return Promise.reject(error);
                }
            }).catch((err) => {
                logger.fatal('Error has occurred and forced the app to shut down: ' + err);
                process.exit(constantsGeneral.ERROR_CODE);
            });
    }

    convertGameBoardToUiData() {
        let data = [];
        for (let i = 0; i < this.rows; i++) {
            data.push([]);
        }
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.game.Board.isCellAlive(row, col) ?
                    data[row].push(constantsUI.CELL_ALIVE_UI) :
                    data[row].push(constantsUI.CELL_DEAD_UI);
            }
        }
        return data;
    }

    onGenerationUpdate() {
        this.boardUi.UpdateBoard(this.convertGameBoardToUiData());
        this.boardUi.printBoard();
        UserInteractionUi.printGeneration(this.game.Generation);
    }

    static onStop() {
        UserInteractionUi.printFinished();
    }

}

module.exports = ControllerGameOfLife;