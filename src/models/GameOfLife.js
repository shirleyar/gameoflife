'use strict';

const Board = require('./Board');

class GameOfLife {
    constructor(rows, columns) {
        this.rows = rows;
        this.cols = columns;
        this.board = new Board(rows,columns);
        this.board.init();
        this.intervals = undefined;
    }

    setNextGeneration() {
        // iterates over all cells and updates it according to rules
        let neighborsCount;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; row < this.cols; col++) {
                neighborsCount = this.board.countNeighbors(row, col);
                switch (neighborsCount) {
                    case 2:
                        this.board.setCellTheSame(row, col);
                        break;
                    case 3:
                        this.board.setCellAlive(row, col);
                        break;
                    default:
                        this.board.setCellDead(row, col);
                        break;
                }
            }
        }
    }

    updateGeneration() {
        this.setNextGeneration();
        for (let row =0; row<this.rows;rows++) {
            for (let col = 0; col < this.cols; col ++) {
                this.board.
            }
        }
    }

    init () {
        // todo: implement
    }

     start (intervalsMs){
        // input: intervals in milliseconds
       this.intervals = setInterval(this.setNextGeneration(), intervalsMs);
     }

     stop() {
         clearInterval(this.intervals);
     }

}

