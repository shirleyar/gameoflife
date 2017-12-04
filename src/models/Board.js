'use strict';

const Cell = require('./Cell'),
    constants = require('../utils/consts');

class Board {  // multi dimensional array rows x columns
    constructor(rows, cols) {
        if (!this.isValidScales(rows, cols)) {
            throw new Error (constants.ERROR_MSG_BOARD_SCALES_INVALID);
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

    setCellDead(row, col) {
        this.cells[row][col].Die()
    }

    setCellAlive(row, col) {
        this.cells[row][col].Live();
    }

    setCellTheSame (row, col) {
        this.cells[row][col].StayTheSame();
    }

    countNeighbors(row, col) {
        let count = 0;
        for (let i = row - 1; i <= row + 1; i++) {
            for (let j = col - 1; j <= col + 1; j + 1) {
                if (i === row && j === col) {
                    try {
                        count += this.cells[i][j].isAlive() ? 1 : 0;
                    }
                    catch (err) {  // an error was caught, set cell to dead and log error & do not change count
                        // todo: add here log
                        this.cells[i][j].Die();
                    }
                }
            }
        }
        return count;
    }

    updateCells() {
        for (let row = 0)
    }


    static isValidScales(rows, cols) {
        let result = false;
        if (rows > 0 && cols > 0) {
            result = true;
        }
        return result;
    }
}

module.exports = Board;