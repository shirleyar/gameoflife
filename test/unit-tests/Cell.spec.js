'use strict';

const should = require('should'),
    sinon = require('sinon');

const Cell = require('../../src/models/Cell'),
    constants = require('../utils/consts');

describe('Unit tests for Cell class', function () {
    let cell = new Cell();
    describe('for constructor function', function () {
        it('should return an typeof "Cell"', function () {
            should(cell instanceof Cell).equal(true, "cell should be an instance of Cell, but returned false");
        });
        it("should set cell's currentState to be dead", function () {
            cell.currentState.should.equal(constants.CELL_DEAD);
        });

        it('should have only currentState property', function () {
            let keys = ['status'];
            Object.keys(cell).should.deepEqual(keys);
        })
    });

    describe('for isAlive function', function () {
        it('should return true when the cell is alive', function () {
            cell.currentState = constants.CELL_ALIVE;
            cell.isAlive().should.equal(true, "isAlive did not return true");
        });

        it('should return false when the cell is alive', function () {
            cell.currentState = constants.CELL_DEAD;
            cell.isAlive().should.equal(false, "isAlive did not return false");
        });

        it('should throw an error when the cell is null or undefined', function () {
            cell.currentState = null;
            should(() => cell.isAlive()).throw(constants.ERROR_MSG_NIL);
        })
    });

    describe('for Die function', function () {
        it("should change cell's currentState to dead when is alive", function () {
            cell.currentState = constants.CELL_ALIVE;
            cell.Die();
            cell.currentState.should.equal(constants.CELL_DEAD);
        });

        it("cell's currentState should remain dead when is dead", function () {
            cell.currentState = constants.CELL_DEAD;
            cell.Die();
            cell.currentState.should.equal(constants.CELL_DEAD);
        });

        it("should change cell's currentState to dead when is null\\undefined", function () {
            cell.currentState = undefined;
            cell.Die();
            cell.currentState.should.equal(constants.CELL_DEAD);
        });
    });

    describe('for Live function', function () {
        it("should change cell's currentState to alive when is dead", function () {
            cell.currentState = constants.CELL_DEAD;
            cell.Live();
            cell.currentState.should.equal(constants.CELL_ALIVE);
        });

        it("cell's currentState should remain alive when is alive", function () {
            cell.currentState = constants.CELL_ALIVE;
            cell.Live();
            cell.currentState.should.equal(constants.CELL_ALIVE);
        });

        it("should change cell's currentState to alive when is null\\undefined", function () {
            cell.currentState = undefined;
            cell.Live();
            cell.currentState.should.equal(constants.CELL_ALIVE);
        });
    });

});