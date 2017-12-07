'use strict';

const {table, getBorderCharacters} = require('table'),
    clear = require('cli-clear');

const config = {
    border: getBorderCharacters('void'),
    columnDefault: {
        paddingLeft: 1,
        paddingRight: 1,
        alignment: 'center'
    }
};

class BoardUiCli {
    constructor(data) {
        this.board = data;
//todo: add log
    }

    UpdateBoard(data) {
        this.board = data;
    }

    printBoard() {
        clear();
        console.log(table(this.board, config));
        // todo: add log
    }
}

module.exports = BoardUiCli;