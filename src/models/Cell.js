'use strict';

const _ = require('lodash');

const constants = require('../utils/consts');

class Cell {
    constructor () {
        this.currentState = constants.CELL_DEAD;
        this.nextState = undefined;
    }

    Die() {
        // todo: add log-- if nextState was not undefined
        this.nextState = constants.CELL_DEAD;
    }

    Live() {
        // todo: add log-- if nextState was not undefined
        this.nextState = constants.CELL_ALIVE;
    }

    StayTheSame(){
        // todo: add log-- if nextState was not undefined
        if (_.isNil(this.currentState)) {
            throw new Error(constants.ERROR_MSG_NIL);
        }
        this.nextState = this.currentState;
    }

    isAlive() {
        if (_.isNil(this.currentState)) {
            throw new Error(constants.ERROR_MSG_NIL)
        }
        return this.currentState === constants.CELL_ALIVE;
    }

    updateCurrentState() {
        if(_.isNil(this.nextState)) {
            this.currentState = constants.CELL_DEAD;
            throw new Error (constants.ERROR_MSG_NEXT_STATE_UNDEFINED);
        }
        this.currentState = this.nextState;
        this.nextState = undefined;
    }
}

module.exports = Cell;