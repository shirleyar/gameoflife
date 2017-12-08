'use strict';

const should = require('should'),
    _ = require('lodash'),
    sinon = require('sinon'),
    util = require('util');

const Board = require('../../../src/models/Board'),
    Cell = require('../../../src/models/Cell'),
    constants = require('../../utils/consts');

describe('Unit tests for Board class', () => {
    let board, sandbox;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('for constructor function', () => {
        [
            {n: 12, m: 12},
            {n: 15, m: 3},
            {n: 1, m: 21}
        ].forEach(function (scale) {
            it(util.format('should build an uninitialized %sx%s board successfully', scale.n, scale.m), () => {
                board = new Board(scale.n, scale.m);
                board.rows.should.equal(scale.n);
                board.cols.should.equal(scale.m);
                board.cells.length.should.equal(scale.n);
                for (let i = 0; i < scale.n; i++) {
                    board.cells[i].should.deepEqual([]);
                }
            });
        });

        [
            {n: 0, m: 0},
            {n: 0, m: 10},
            {n: 10, m: 0},
            {n: undefined, m: undefined},
            {n: 10, m: null},
            {n: null, m: 15}
        ].forEach(function (scale) {
            it(util.format('should throw an error for rows: %s and columns: %s', scale.n, scale.m), () => {
                board = null;
                should(() => new Board(scale.n, scale.m)).throw(constants.ERROR_MSG_BOARD_SCALES_INVALID);
                should(board).equal(null);
            })
        })
    });

    describe('for init function', () => {
        let rows = 10, cols = 15;
        let dummyCell = new Cell();

        before(() => {
            board = new Board(rows, cols);
            board.init();
        });

        it('cells should be a two dimensional array row x cols', () => {
            for (let i = 0; i < rows; i++) {
                board.cells[i].should.be.Array();
                board.cells[i].length.should.equal(cols);
            }
        });

        it('should initialize board with dead cells', () => {
            dummyCell = new Cell();
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    board.cells[i][j].should.deepEqual(dummyCell);
                }
            }
        });
    });

    describe('for setCell function', () => {
        let liveSpy, dieSpy, staySpy;

        before(() => {
            board = new Board(10, 10);
            board.init();
        });

        [
            {row: 0, col: 0},
            {row: 5, col: 2},
            {row: 3, col: 8}
        ].forEach(function (location) {
            it(util.format('should set the given cell[%s][%s] to be dead on next generation', location.row, location.col), () => {
                liveSpy = sandbox.spy(board.cells[location.row][location.col], "Live");
                staySpy = sandbox.spy(board.cells[location.row][location.col], 'StayTheSame');
                dieSpy = sandbox.spy(board.cells[location.row][location.col], 'Die');
                board.setCell(location.row, location.col, constants.CELL_DEAD);
                dieSpy.calledOnce.should.equal(true, "Die should have been called once only");
                staySpy.called.should.equal(false, "StayTheSame should not be called");
                liveSpy.called.should.equal(false, "Live should not be called");
            });
        });

        [
            {row: 0, col: 0},
            {row: 5, col: 2},
            {row: 3, col: 8}
        ].forEach(function (location) {
            it(util.format('should set the given cell[%s][%s] to be alive on next generation', location.row, location.col), () => {
                liveSpy = sandbox.spy(board.cells[location.row][location.col], "Live");
                staySpy = sandbox.spy(board.cells[location.row][location.col], 'StayTheSame');
                dieSpy = sandbox.spy(board.cells[location.row][location.col], 'Die');
                board.setCell(location.row, location.col, constants.CELL_ALIVE);
                liveSpy.calledOnce.should.equal(true, "Live should have been called once only");
                dieSpy.called.should.equal(false, "Die should not be called");
                staySpy.called.should.equal(false, "StayTheSame should not be called");
            });
        });

        [
            {row: 0, col: 0},
            {row: 5, col: 2},
            {row: 3, col: 8}
        ].forEach(function (location) {
            it(util.format('should set the given cell[%s][%s] to be the same on next generation', location.row, location.col), () => {
                liveSpy = sandbox.spy(board.cells[location.row][location.col], "Live");
                dieSpy = sandbox.spy(board.cells[location.row][location.col], 'Die');
                staySpy = sandbox.spy(board.cells[location.row][location.col], 'StayTheSame');
                board.setCell(location.row, location.col);
                liveSpy.called.should.equal(false, "Live should not be called");
                dieSpy.called.should.equal(false, "Die should not be called");
                staySpy.called.should.equal(true, "StayTheSame should have been called once");
            });
        });


        [
            {row: -1, col: -1},
            {row: 9, col: -3},
            {row: -3, col: 9},
            {row: undefined, col: null},
            {row: null, col: -3},
            {row: -3, col: undefined},
            {row: 9, col: undefined},
            {row: undefined, col: 9}
        ].forEach(function (location) {
            it(util.format('should throw an error when setting cell[%s][%s]', location.row, location.col), () => {
                should(() => board.setCell(location.row, location.col)).throw(constants.ERROR_MSG_CELL_OUT_BOUNDARIES);
            })
        })
    });

    describe('for countNeighbors function', () => {
        let rows = 10, cols = 10;

        before(() => {
            board = new Board(rows, cols);
        });

        beforeEach(() => {
            board.init();
        });

        [
            {
                row: 5,
                col: 5,
                neighbors: [{row: 4, col: 4}, {row: 5, col: 6}, {row: 6, col: 4}],
                expected: 3,
            },
            {
                row: 0,
                col: 0,
                neighbors: [],
                expected: 0,
            },
            {
                row: 9,
                col: 9,
                neighbors: [{row: 8, col: 9}],
                expected: 1,
            },
            {
                row: 5,
                col: 5,
                neighbors: [
                    {row: 4, col: 4}, {row: 4, col: 5}, {row: 4, col: 6},
                    {row: 5, col: 4}, {row: 5, col: 5}, {row: 5, col: 6},
                    {row: 6, col: 4}, {row: 6, col: 5}, {row: 6, col: 6}
                ], // (5,5) is there to check that is not counted
                expected: 8,
            },
        ].forEach(function (cell) {
            it(util.format('should return the number of living neighbors of cell[%s][%s]', cell.row, cell.col), () => {
                cell.neighbors.forEach(function (neighbor) {
                    board.cells[neighbor.row][neighbor.col].currentState = constants.CELL_ALIVE;
                });
                board.countNeighbors(cell.row, cell.col).should.equal(cell.expected);

            });
        });

        it('should throw an error for at least one undefined neighbors', () => {
            let row = 2, col = 2;
            let zombieCell = board.cells[row - 1][col];
            let dieSpy = sandbox.spy(zombieCell, "Die");
            [
                {row: row - 1, col: col - 1},
                {row: row + 1, col: col + 1}
            ].forEach(function (neighbor) {
                board.cells[neighbor.row][neighbor.col].currentState = constants.CELL_ALIVE;
            });
            zombieCell.currentState = undefined;
            board.countNeighbors(row, col).should.equal(2);
            dieSpy.calledOnce.should.equal(true, "Only one cell's status is undefined, need to kill only that cell");
        });

        it('should throw an error when setting cell[undefined][3]', () => {
            should(() => board.countNeighbors(undefined, 3)).throw(constants.ERROR_MSG_CELL_OUT_BOUNDARIES);
        });
    });

    describe('for updateCells functions', () => {
        let rows = 3, cols = 3;

        before(() => {
            board = new Board(rows, cols);
        });

        beforeEach(() => {
            board.init();
        });

        it('should update the cells current state', () => {
            let currentPosition;
            let toBeAlive = [
                {row: 2, col: 2},
                {row: 1, col: 1},
                {row: 0, col: 0}
            ];

            for (let i = 0; i < rows; i++) {  // prepare next states
                for (let j = 0; j < cols; j++) {
                    currentPosition = {row: i, col: j};
                    _.includes(toBeAlive, currentPosition) ? board.cells[i][j].Live() : board.cells[i][j].Die();
                }
            }

            board.updateCells();
            for (let i = 0; i < rows; i++) {  // prepare next states
                for (let j = 0; j < 0; j++) {
                    currentPosition = {row: i, col: j};
                    _.includes(toBeAlive, currentPosition) ?
                        board.cells[i][j].isAlive().should.equal(true, "should be alive") :
                        board.cells[i][j].isAlive().should.equal(false, "should be dead");
                }
            }
        })
    });

    describe('for isCellAlive function', () => {
        let rows = 3, cols = 3, isAliveStub, isValidCellLocationStub;
        let row = 0, col = 0;

        before(() => {
            board = new Board(rows, cols);
        });

        beforeEach(() => {
            board.init();
        });

        [
            {
                state: 'alive',
                expected: true
            },
            {
                state: 'dead',
                expected: false
            }
        ].forEach((testCase) => {
            it(util.format('should return %s is the cell is %s',testCase.expected, testCase.state), () => {
                isAliveStub = sandbox.stub(board.cells[row][col], "isAlive").returns(testCase.expected);
                isValidCellLocationStub = sandbox.stub(board, "isValidCellLocation").returns(true);
                board.isCellAlive(row,col).should.equal(testCase.expected, "isCellAlive should return the answer from isAlive");
                isAliveStub.calledOnce.should.be.true('isAlive is supposed to be called once');
                isAliveStub.calledWith().should.be.true('isAlive is supposed to be called without arguments');
                isValidCellLocationStub.calledOnce.should.be.true('isValidCellLocationStub is supposed to called once');
                isValidCellLocationStub.calledWithExactly(row,col).should.be.true('isValidCellLocationStub is supposed to be called with row and col');
            });
        });

        it('should throw an error when isValidCellLocation throws an error', ()=>{
            isAliveStub = sandbox.stub(board.cells[row][col], "isAlive");
            isValidCellLocationStub = sandbox.stub(board, "isValidCellLocation").returns(false);
            should(()=>board.isCellAlive(row,col)).throw(constants.ERROR_MSG_CELL_OUT_BOUNDARIES);
            isAliveStub.called.should.be.false("isAlive is not supposed to be called");
            isValidCellLocationStub.calledOnce.should.be.true('isValidCellLocationStub is supposed to called once');
            isValidCellLocationStub.calledWithExactly(row,col).should.be.true('isValidCellLocationStub is supposed to be called with row and col');
        });

        it('should throw an error when isAlive throws an error', ()=>{
            isAliveStub = sandbox.stub(board.cells[row][col], "isAlive").throws(new Error(constants.ERROR_MSG_NIL));
            isValidCellLocationStub = sandbox.stub(board, "isValidCellLocation").returns(true);
            should(()=>board.isCellAlive(row,col)).throw(constants.ERROR_MSG_NIL);
            isAliveStub.calledOnce.should.be.true('isAlive is supposed to be called once');
            isAliveStub.calledWith().should.be.true('isAlive is supposed to be called without arguments');
            isValidCellLocationStub.calledOnce.should.be.true('isValidCellLocationStub is supposed to called once');
            isValidCellLocationStub.calledWithExactly(row,col).should.be.true('isValidCellLocationStub is supposed to be called with row and col');
        });
    });
});