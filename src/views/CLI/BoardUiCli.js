'use strict';

const {table, getBorderCharacters} = require('table'),
    clear = require('cli-clear'),
    format = require('util').format,
    constants = require('./consts'),
    logger = require('../../utils/logger');

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
        logger.debug(format("BoardUiCli ctor. input-> data: %s", data));
        this.UpdateBoard(data)
    }

    UpdateBoard(data) {
        logger.debug(format("BoardUiCli UpdateBoard. input-> data: %s", data));
        if (!BoardUiCli.isValidData(data)) {
            logger.error(format("BoardUiCli UpdateBoard. input-> data: %s", data));
            throw new Error(constants.ERROR_INVALID_BOARD_DATA)
        }
        this.board = data;
    }

    printBoard() {
        logger.debug("BoardUiCli printBoard. input-> void");
        clear();
        console.log(table(this.board, config));
    }

    static isValidData(data) {
        logger.debug(format("BoardUiCli isValidData. input-> data: %s", data));
        let answer;
        if (Array.isArray(data) && data.length > 0) {
            answer = true;
            data.forEach((row) => {
                answer = answer && Array.isArray(row);
            })
        } else {
            answer = false;
        }
        return answer;
    }
}

module.exports = BoardUiCli;