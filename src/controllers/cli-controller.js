'use strict';

const GameOfLife = require('../models/GameOfLife'),
    UserInteractionUi = require('../views/CLI/user-interaction'),
    BoardUI = require('../views/CLI/board-ui'),
    predefinedGames = require('../models/predefinedGames'),
    constantsGeneral = require('../utils/consts'),
    constantsUI = require('../views/CLI/consts');

const events = require('events'),
    eventEmitter = new events.EventEmitter(),
    util = require('util');

class ControllerCliGameOfLife {
    constructor() {
        this.game = undefined;
        this.board = undefined;
        this.rows = undefined;
        this.cols = undefined;
    }

    startGame() {
        UserInteractionUi.welcomeUser(util.format(constantsGeneral.WELCOME_MSG, constantsGeneral.NEXT_THE_SAME, constantsGeneral.NEXT_ALIVE));
        const gameNames = predefinedGames.getGamesNames();
        return UserInteractionUi.getUserPredefinedGame(gameNames)
            .then((name) => {
                let game = predefinedGames.getGameByName(name);
                this.rows = game.rows;
                this.cols = game.cols;
                this.game = new GameOfLife(game.rows, game.cols, game.generations, eventEmitter, game.intervals);
                this.game.init(game.livingCells);
                this.board = new BoardUI(this.convertGameBoardToUiData());
                this.board.printBoard();
                UserInteractionUi.printGeneration(this.game.Generation);
                eventEmitter.on(constantsGeneral.EVENT_UPDATED_GENERATION, this.onGenerationUpdate.bind(this));
                eventEmitter.on(constantsGeneral.EVENT_STOPPED, ControllerCliGameOfLife.onStop);
                this.game.start(game.livingCells, game.intervals);
            }).catch ((err) => console.log(err));
    }

    convertGameBoardToUiData() {
        let data = [] ;
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
        this.board.UpdateBoard(this.convertGameBoardToUiData());
        this.board.printBoard();
        UserInteractionUi.printGeneration(this.game.Generation);
    }

    static onStop() {
        UserInteractionUi.printFinished();
    }

}

module.exports = ControllerCliGameOfLife;