'use strict';

const _ = require('lodash');

const Cell = require('./Cell'),
    constants = require('../utils/consts');

class Board {  // multi dimensional array rows x columns
    constructor(rows, cols) {
        if (!Board.isValidScales(rows, cols)) {
            // todo: add log
            throw new Error(constants.ERROR_MSG_BOARD_SCALES_INVALID);
        }
        this.rows = rows;
        this.cols = cols;
        this.cells = [];
        for (let i = 0; i < this.rows; i++) {
            this.cells.push([]);
        }
    }

    init() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.cells[row][col] = new Cell();
            }
        }
    }

    setCell(row, col, next_state) {
        if (!this.isValidCellLocation(row, col)) {
            throw new Error(constants.ERROR_MSG_CELL_OUT_BOUNDARIES);
        }
        switch (next_state) {
            case constants.CELL_ALIVE:
                this.cells[row][col].Live();
                break;
            case constants.CELL_DEAD:
                this.cells[row][col].Die();
                break;
            default:
                this.cells[row][col].StayTheSame();
                break;
        }
    }

    isCellAlive(row, col) {
        if (!this.isValidCellLocation(row,col)) {
            //todo: add log
            throw new Error (constants.ERROR_MSG_CELL_OUT_BOUNDARIES);
        }
        try {
            return this.cells[row][col].isAlive();
        } catch (error) {
        // todo: add log
            throw (error)
        }
    }

    countNeighbors(row, col) {
        if (!this.isValidCellLocation(row, col)) {
            throw new Error(constants.ERROR_MSG_CELL_OUT_BOUNDARIES);
        }
        let count = 0;
        let bottomRow = row - 1 < 0 ? 0 : row - 1;
        let bottomCol = col - 1 < 0 ? 0 : col - 1;
        let topRow = row + 1 >= this.rows ? this.rows - 1 : row + 1;
        let topCol = col + 1 >= this.cols ? this.cols - 1 : col + 1;

        for (let i = bottomRow; i <= topRow; i++) {
            for (let j = bottomCol; j <= topCol; j++) {
                if (!(i === row && j === col)) {
                    try {
                        count += this.cells[i][j].isAlive() ? 1 : 0;
                    }
                    catch (err) {  // an error was caught, set cell to dead and log error & do not change count
                        // todo: add here log
                        this.cells[i][j].Die(); // if cell is not alive nor dead - kill him.
                    }
                }
            }
        }
        return count;
    }

    updateCells() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.cells[row][col].updateCurrentState()
            }
        }
    }

    static isValidScales(rows, cols) {
        let result = false;
        if (rows > 0 && cols > 0) {
            result = true;
        }
        return result;
    }

    isValidCellLocation(row, col) {
        return !(_.isNil(row) || _.isNil(col) ||
            row < 0 || row >= this.rows ||
            col >= this.cols || col < 0);
    }
}

module.exports = Board;