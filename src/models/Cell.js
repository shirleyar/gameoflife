'use strict';

const _ = require('lodash');

const constants = require('../utils/consts');

class Cell {
    constructor () {
        this.currentState = constants.CELL_DEAD;
        this.nextState = undefined;
    }

    Die() {
        this.nextState = constants.CELL_DEAD;
    }

    Live() {
        this.nextState = constants.CELL_ALIVE;
    }

    StayTheSame(){
        if (_.isNil(this.currentState)) {
            throw new Error(constants.ERROR_MSG_NIL)
        }
        this.nextState = this.currentState;
    }

    isAlive() {
        if (_.isNil(this.currentState)) {
            throw new Error(constants.ERROR_MSG_NIL)
        }
        return this.currentState;
    }

    updateCurrentState() {
        if(!this.nextState) {
            throw (constants.ERROR_MSG_NEXT_STATE_UNDEFINED);
        }
        this.currentState = this.nextState;
        this.nextState = undefined;
    }
}

module.exports = Cell;