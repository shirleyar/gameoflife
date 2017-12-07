'use strict';

const util = require('util');

const Board = require('./Board'),
    constants = require('../utils/consts');

class GameOfLife {
    constructor(rows, columns, generations, eventEmitter) {
        try {
            this.board = new Board(rows, columns);
        } catch (error) {
            // todo: add log
            throw error;
        }
        this.rows = rows;
        this.cols = columns;
        this.intervals = undefined;
        this.initialized = false;
        this.generations = generations;
        this.currentGeneration = 0;
        this.eventEmitter = eventEmitter;
    }

    setNextGeneration() {
        // iterates over all cells and updates it according to rules
        let neighborsCount;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                try {
                    neighborsCount = this.board.countNeighbors(row, col);
                    this.decideCellNextState(neighborsCount, row, col);
                } catch (error) {
                    //todo: add log
                    throw (error);
                }
            }
        }
    }

    decideCellNextState(neighborsCount, row, col) {
        let nextState;
        switch (neighborsCount) {
            case constants.NEXT_THE_SAME: // stay the same => next state needs to be empty
                break;
            case constants.NEXT_ALIVE:
                nextState = constants.CELL_ALIVE;
                break;
            default:
                nextState = constants.CELL_DEAD;
                break;
        }
        try {
            this.board.setCell(row, col, nextState);
        } catch (error) {
            //todo: add log
            throw (error);
        }
    }

    updateGeneration() {
        this.setNextGeneration();
        this.board.updateCells();
        this.currentGeneration++;
        this.eventEmitter.emit(constants.EVENT_UPDATED_GENERATION);
        if (this.currentGeneration === this.generations) {
            this.stop();
            this.eventEmitter.emit(constants.EVENT_STOPPED);
        }
    }

    init(livingCellsArray) {  //input: array that each item is a location of a cell on the board
        this.board.init();
        if (!Array.isArray(livingCellsArray)){
            throw new Error(constants.ERROR_MSG_INVALID_INPUT_INIT);
        }
        livingCellsArray.forEach((cell) => {
            if (!this.board.isValidCellLocation(cell.row, cell.col)) {
                throw new Error (constants.ERROR_MSG_CELL_OUT_BOUNDARIES);
            }
            this.board.cells[cell.row][cell.col].currentState = constants.CELL_ALIVE;
        });
        this.initialized=true;
    }

    static isValidIntervals(interval) {  // game intervals can be up to a minute, not more
        return interval > 0 && interval <= constants.MAX_INTERVALS;
    }

    start(livingCellsArray, intervalsMs) {
        try {
            this.init(livingCellsArray);
            this.setIntervals(intervalsMs);
        } catch (error) {
            //todo: add logs
            throw error;
        }
    }

    setIntervals(intervalsMs) {
        // input: intervals in milliseconds
        if (!GameOfLife.isValidIntervals(intervalsMs)) {
            throw new Error(util.format(constants.ERROR_MSG_INVALID_INTERVAL, constants.MAX_INTERVALS));
        }
        if (!this.initialized) {
            throw new Error(constants.ERROR_MSG_UNINITIALIZED);
        }
        if (!this.intervals) {
            this.intervals = setInterval(this.updateGeneration.bind(this), intervalsMs * 1000);
            // todo: add log
        } else {
            // todo: add log
        }
    }

    stop() {
        clearInterval(this.intervals);
        this.intervals = undefined;
        //todo: add log
    }

    get Board() {
        return this.board;
    }

    get Generation() {
        return this.currentGeneration;
    }

}

module.exports = GameOfLife;