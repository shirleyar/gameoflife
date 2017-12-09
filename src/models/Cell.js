'use strict';

const _ = require('lodash'),
    format = require('util').format;

const constants = require('../utils/consts'),
    logger = require('../utils/logger');

class Cell {
    constructor() {
        logger.debug("Cell ctor. input-> void");
        this.currentState = constants.CELL_DEAD;
        this.nextState = undefined;
    }

    Die() {
        logger.debug("Cell Die. input-> void");
        this.nextState = constants.CELL_DEAD;
    }

    Live() {
        logger.debug("Cell Live. input-> void");
        this.nextState = constants.CELL_ALIVE;
    }

    StayTheSame() {
        logger.debug("Cell StayTheSame. input-> void");
        if (_.isNil(this.currentState)) {
            logger.error(format("Cell StayTheSame. error: %s, input-> void", constants.ERROR_MSG_NIL));
            throw new Error(constants.ERROR_MSG_NIL);
        }
        this.nextState = this.currentState;
    }

    isAlive() {
        logger.debug("Cell isAlive. input-> void");
        if (_.isNil(this.currentState)) {
            logger.error(format("Cell isAlive. error: %s, input-> void", constants.ERROR_MSG_NIL));
            throw new Error(constants.ERROR_MSG_NIL)
        }
        return this.currentState === constants.CELL_ALIVE;
    }

    updateCurrentState() {
        logger.debug("Cell updateCurrentState. input-> void");
        if (_.isNil(this.nextState)) {
            this.currentState = constants.CELL_DEAD;
            logger.error(format("Cell updateCurrentState. error: %s, input-> void", constants.ERROR_MSG_NEXT_STATE_UNDEFINED));
            throw new Error(constants.ERROR_MSG_NEXT_STATE_UNDEFINED);
        }
        this.currentState = this.nextState;
        this.nextState = undefined;
    }
}

module.exports = Cell;