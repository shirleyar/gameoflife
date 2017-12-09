'use strict';

const format = require('util').format;

const Board = require('./Board'),
    constants = require('../utils/consts'),
    logger = require('../utils/logger');

class GameOfLife {
    constructor(rows, columns, generations, eventEmitter, intervals) {
        logger.debug(format("GameOfLife ctor. input-> rows: %s, columns: %s, generations: %s, eventEmitter: %s, intervals: %s", rows, columns, generations, eventEmitter, intervals));
        if (!GameOfLife.isValidGenerations(generations)) {
            logErrorCtor(rows, columns, generations, eventEmitter, intervals, constants.ERROR_MSG_INVALID_GENERATIONS);
            throw new Error(constants.ERROR_MSG_INVALID_GENERATIONS);
        }
        if (!GameOfLife.isValidIntervals(intervals)) {
            logErrorCtor(rows, columns, generations, eventEmitter, intervals, constants.ERROR_MSG_INVALID_INTERVAL);
            throw new Error(constants.ERROR_MSG_INVALID_INTERVAL);
        }
        if (!eventEmitter) {
            logErrorCtor(rows, columns, generations, eventEmitter, intervals, constants.ERROR_MSG_INVALID_EVENT_EMITTER);
            throw new Error(constants.ERROR_MSG_INVALID_EVENT_EMITTER);
        }
        try {
            this.board = new Board(rows, columns);
        } catch (error) {
            logErrorCtor(rows, columns, generations, eventEmitter, intervals, error);
            throw error;
        }

        this.rows = rows;
        this.cols = columns;
        this.intervals = intervals;
        this.generations = generations;
        this.currentGeneration = 0;
        this.eventEmitter = eventEmitter;
    }

    setNextGeneration() {
        // iterates over all cells and updates it according to rules
        logger.debug("GameOfLife setNextGeneration. input-> void");
        let neighborsCount;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                try {
                    neighborsCount = this.board.countNeighbors(row, col);
                    this.decideCellNextState(neighborsCount, row, col);
                } catch (error) {
                    logger.error(format("GameOfLife setNextGeneration. error: %s, input-> void", error));
                    throw (error);
                }
            }
        }
    }

    decideCellNextState(neighborsCount, row, col) {
        logger.debug(format("GameOfLife decideCellNextState. input-> neighborsCount: %s, row: %s, col: %s", neighborsCount, row, col));
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
            logger.error(format("GameOfLife decideCellNextState. error: %s, input-> neighborsCount: %s, row: %s, col: %s",error, neighborsCount, row, col));
            throw (error);
        }
    }

    updateGeneration() {
        logger.debug("GameOfLife updateGeneration. input-> void");
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
        logger.debug(format("GameOfLife init. input-> livingCellsArray: %s", livingCellsArray));
        this.board.init();
        if (!Array.isArray(livingCellsArray)) {
            logger.error(format("GameOfLife init. error: %s, input-> livingCellsArray", constants.ERROR_MSG_INVALID_INPUT_INIT,livingCellsArray));
            throw new Error(constants.ERROR_MSG_INVALID_INPUT_INIT);
        }
        livingCellsArray.forEach((cell) => {
            if (!this.board.isValidCellLocation(cell.row, cell.col)) {
                logger.error(format("GameOfLife init. error: %s, input-> livingCellsArray", constants.ERROR_MSG_CELL_OUT_BOUNDARIES,livingCellsArray));
                throw new Error(constants.ERROR_MSG_CELL_OUT_BOUNDARIES);
            }
            this.board.cells[cell.row][cell.col].currentState = constants.CELL_ALIVE;
        });
    }

    static isValidIntervals(interval) {  // game intervals can be up to a minute, not more
        logger.debug(format("GameOfLife isValidIntervals. input-> interval: %s", interval));
        return interval > 0 && interval <= constants.MAX_INTERVALS;
    }

    start(livingCellsArray) {
        logger.debug(format("GameOfLife livingCellsArray. input-> livingCellsArray: %s", livingCellsArray));
        try {
            this.init(livingCellsArray);
            this.intervals = setInterval(this.updateGeneration.bind(this), this.intervals * 1000);
        } catch (error) {
            logger.error(format("GameOfLife init. error: %s, input-> livingCellsArray", error,livingCellsArray));
            throw error;
        }
    }

    stop() {
        logger.debug("GameOfLife isValidIntervals. input-> void");
        clearInterval(this.intervals);
        this.intervals = undefined;
    }

    get Board() {
        return this.board;
    }

    get Generation() {
        return this.currentGeneration;
    }

    static isValidGenerations(generations) {
        logger.debug(format("GameOfLife isValidGenerations. input-> generations: %s", generations));
        return generations >= 0;
    }
}

function logErrorCtor(rows, columns, generations, eventEmitter, intervals, error) {
    logger.error(format("GameOfLife isValidGenerations. error: %s, input-> rows: %s, columns: %s, generations: %s, eventEmitter: %s, intervals: %s", error, rows, columns, generations, eventEmitter, intervals));
}

module.exports = GameOfLife;