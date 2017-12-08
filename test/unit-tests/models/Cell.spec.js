'use strict';

const should = require('should');

const Cell = require('../../../src/models/Cell'),
    constants = require('../../utils/consts');

describe('Unit tests for Cell class', function () {
    let cell = new Cell();
    describe('for constructor function', function () {
        it('should return an typeof "Cell"', function () {
            should(cell instanceof Cell).equal(true, "cell should be an instance of Cell, but returned false");
        });
        it("should set cell's currentState to be dead and nextState to be undefined", function () {
            cell.currentState.should.equal(constants.CELL_DEAD);
            should(cell.nextState).equal(undefined);
        });

        it('should have only currentState and nextState properties', function () {
            let keys = ['currentState', 'nextState'];
            Object.keys(cell).should.deepEqual(keys);
        })
    });

    describe('for isAlive function', function () {
        //todo: add tests and assertions that logs were printed
        it('should return true when the cell is alive', function () {
            cell.currentState = constants.CELL_ALIVE;
            cell.nextState = undefined;
            cell.isAlive().should.equal(true, "isAlive did not return true");
            cell.currentState.should.equal(constants.CELL_ALIVE, "isAlive does suppose to change currentState");
            should(cell.nextState).equal(undefined, "isAlive does not suppose to change nextState");
        });

        it('should return false when the cell is alive', function () {
            cell.currentState = constants.CELL_DEAD;
            cell.isAlive().should.equal(false, "isAlive did not return false");
            cell.currentState.should.equal(constants.CELL_DEAD, "isAlive does suppose to change currentState");
            should(cell.nextState).equal(undefined, "isAlive does not suppose to change nextState");
        });

        it('should throw an error when the cell is null or undefined', function () {
            cell.currentState = null;
            should(() => cell.isAlive()).throw(constants.ERROR_MSG_NIL);
            should(cell.currentState).equal(null, "isAlive does suppose to change currentState");
            should(cell.nextState).equal(undefined, "isAlive does not suppose to change nextState");
        })
    });

    describe('for Die function', function () {
        //todo: add tests and assertions that logs were printed
        it("should change cell's nextState to dead when currentState is alive", function () {
            cell.currentState = constants.CELL_ALIVE;
            cell.nextState = undefined;
            cell.Die();
            cell.nextState.should.equal(constants.CELL_DEAD);
            cell.isAlive().should.equal(true, "Die does not suppose to change current state");
        });

        it("cell's nextState should set dead when currentState is dead", function () {
            cell.currentState=constants.CELL_DEAD;
            cell.nextState = undefined;
            cell.Die();
            cell.nextState.should.equal(constants.CELL_DEAD);
            cell.isAlive().should.equal(false, "Die does not suppose to change current state");
        });

        it("should change cell's nextState to dead when currentState is null\\undefined", function () {
            cell.currentState = undefined;
            cell.nextState = undefined;
            cell.Die();
            cell.nextState.should.equal(constants.CELL_DEAD);
            should(cell.currentState).equal(undefined);
        });
    });

    describe('for Live function', function () {
        //todo: add tests and assertions that logs were printed
        it("should change cell's nextState to alive when currentState is dead", function () {
            cell.currentState = constants.CELL_ALIVE;
            cell.nextState = undefined;
            cell.Live();
            cell.nextState.should.equal(constants.CELL_ALIVE);
            cell.isAlive().should.equal(true, "Live does not suppose to change current state");
        });

        it("cell's nextState should set alive when currentState is alive", function () {
            cell.currentState = constants.CELL_ALIVE;
            cell.nextState = undefined;
            cell.Live();
            cell.nextState.should.equal(constants.CELL_ALIVE);
            cell.isAlive().should.equal(true, "Live does not suppose to change current state");
        });

        it("should change cell's nextState to alive when currentState is null\\undefined", function () {
            cell.currentState = undefined;
            cell.nextState = undefined;
            cell.Live();
            cell.nextState.should.equal(constants.CELL_ALIVE);
            should(cell.currentState).equal(undefined);
        });
    });

    describe('for StayTheSame function', function () {
        //todo: add tests and assertions that logs were printed
        it("should change cell's nextState to alive when currentState alive", function () {
            cell.currentState = constants.CELL_ALIVE;
            cell.nextState = undefined;
            cell.StayTheSame();
            cell.nextState.should.equal(constants.CELL_ALIVE);
            cell.currentState.should.equal(constants.CELL_ALIVE, "StayTheSame does not suppose to change current state");
        });

        it("cell's nextState should set dead when currentState is dead", function () {
            cell.currentState = constants.CELL_DEAD;
            cell.nextState = undefined;
            cell.StayTheSame();
            cell.nextState.should.equal(constants.CELL_DEAD);
            cell.currentState.should.equal(constants.CELL_DEAD, "StayTheSame does not suppose to change current state");
        });

        it('should throw an error when the cell is null or undefined', function () {
            cell.currentState = null;
            cell.nextState = undefined;
            should(() => cell.StayTheSame()).throw(constants.ERROR_MSG_NIL);
            should(cell.currentState).equal(null, "StayTheSame does suppose to change currentState");
            should(cell.nextState).equal(undefined, "StayTheSame does not suppose to change nextState");
        });

        describe('for updateCurrentState function', function () {
            //todo: add tests and assertions that logs were printed
            it("should change cell's currentState to alive when nextState is alive and set nextState to be undefined", function () {
                cell.nextState = constants.CELL_ALIVE;
                cell.currentState = undefined;
                cell.updateCurrentState();
                cell.currentState.should.equal(constants.CELL_ALIVE);
                should(cell.nextState).equal(undefined, "updateCurrentState is suppose to change next state to undefined");
            });

            it("should change cell's currentState to dead when nextState is dead and set nextState to be undefined", function () {
                cell.nextState = constants.CELL_DEAD;
                cell.currentState = undefined;
                cell.updateCurrentState();
                cell.currentState.should.equal(constants.CELL_DEAD);
                should(cell.nextState).equal(undefined, "updateCurrentState is suppose to change next state to undefined");
            });

            it('should throw an error when the cell is null or undefined', function () {
                cell.currentState = undefined;
                cell.nextState = null;
                should(() => cell.updateCurrentState()).throw(constants.ERROR_MSG_NEXT_STATE_UNDEFINED);
                should(cell.currentState).equal(constants.CELL_DEAD);
                should(cell.nextState).equal(null, "updateCurrentState does not suppose to change nextState");
            })
        })
    });
});