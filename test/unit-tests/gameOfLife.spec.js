'use strict';

const should = require('should'),
    sinon = require('sinon'),
    util = require('util'),
    sleep = require('sleep').msleep;

const GameOfLife = require('../../src/models/GameOfLife'),
    constants = require('../utils/consts'),
    N = 10;

describe('Unit tests for GameOfLife class', function () {
    let game, sandbox;

    before(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
        game = undefined; // fresh start for each test
    });

    describe('for constructor function', function () {
        // todo: add logs tests
        [
            {n: 12, m: 12},
            {n: 15, m: 3},
            {n: 1, m: 21}
        ].forEach(function (scale) {
            it(util.format('should build an uninitialized board and initialized rows and cols properties successfully, intervals should remain undefined'), function () {
                game = new GameOfLife(scale.n, scale.m);
                game.rows.should.equal(scale.n);
                game.cols.should.equal(scale.m);
                should(game.intervals).be.undefined();
                game.initialized.should.be.false('initialized should be false');
            });
        });

        [
            {n: 0, m: 0},
            {n: -5, m: 3},
            {n: 1, m: -6},
            {n: undefined, m: 6}
        ].forEach(function (scale) {
            it(util.format('should throw an error for rows: %s and columns: %s, game is not supposed to be created', scale.n, scale.m), function () {
                should(() => game = new GameOfLife(scale.n, scale.m)).throw(constants.ERROR_MSG_BOARD_SCALES_INVALID);
                should(game).be.undefined();
            });
        })
    });

    describe('for setNextGeneration function', function () {
        let countNeigborsStub, decideCellNextStateSpy;

        it('should execute countNeighbors and decideCellNextState for each cell in board', function () {
            game = new GameOfLife(N, N);
            game.board.init();
            countNeigborsStub = sandbox.stub(game.board, "countNeighbors").returns(0);
            decideCellNextStateSpy = sandbox.spy(game, "decideCellNextState");
            game.setNextGeneration();
            for (let i = 0; i < N; i++) {
                for (let j = 0; j < N; j++) {
                    countNeigborsStub.calledWith(i, j);
                    decideCellNextStateSpy.calledWith(0, i, j);
                }
            }
            countNeigborsStub.callCount.should.be.exactly(N * N);
            decideCellNextStateSpy.callCount.should.be.exactly(N * N);
        });

        it('when countNeighbors throws an error should be able to re-throw it', function () {
            game = new GameOfLife(N, N);
            game.board.init();
            countNeigborsStub = sandbox.stub(game.board, "countNeighbors").throws(new Error('error'));
            decideCellNextStateSpy = sandbox.spy(game, "decideCellNextState");
            should(() => game.setNextGeneration()).throw('error');
            countNeigborsStub.callCount.should.be.exactly(1);
            decideCellNextStateSpy.callCount.should.be.exactly(0);
        });

        it('when decideCellNextState throws an error should be able to re-throw it', function () {
            game = new GameOfLife(N, N);
            game.board.init();
            countNeigborsStub = sandbox.stub(game.board, "countNeighbors");
            let decideCellNextStateStub = sandbox.stub(game, "decideCellNextState").throws(new Error('error'));
            should(() => game.setNextGeneration()).throw('error');
            countNeigborsStub.callCount.should.be.exactly(1);
            decideCellNextStateStub.callCount.should.be.exactly(1);
        });
    });

    describe('for decideCellNextState function', () => {
        let setCellStub;
        beforeEach(() => {
            game = new GameOfLife(N, N);
            game.board.init();
        });

        [
            {
                name: constants.CELL_ALIVE,
                next: constants.CELL_ALIVE,
                neighbors: constants.NEXT_ALIVE,
                row: 0,
                col: 1
            },
            {
                name: constants.CELL_DEAD,
                next: constants.CELL_DEAD,
                neighbors: 0,
                row: 8,
                col: 9
            },
            {
                name: constants.CELL_DEAD,
                next: constants.CELL_DEAD,
                neighbors: 5,
                row: 5,
                col: 2
            },
            {
                name: "the same",
                next: undefined,
                neighbors: constants.NEXT_THE_SAME
            },
        ].forEach(function (testCase) {
            it(util.format('should set cell to be %s for %s neighbors', testCase.next, testCase.neighbors), () => {
                setCellStub = sandbox.stub(game.board, 'setCell');
                game.decideCellNextState(testCase.neighbors, testCase.row, testCase.col);
                setCellStub.calledOnce.should.be.true('setCell should be called exactly once');
                setCellStub.calledWithExactly(testCase.row, testCase.col, testCase.next).should.be.true();
            })
        });

        it('should throw an error when set cell throws an error', () => {
            setCellStub = sandbox.stub(game.board, 'setCell').throws(new Error('error'));
            should(() => game.decideCellNextState(0, 0, 0)).throw('error');
            setCellStub.calledOnce.should.be.true('setCell should be called exactly once');
        });
    });

    describe('for updateGeneration function', () => {
        it('should set cells next state and update the board', () => {
            game = new GameOfLife(N, N);
            let setNextGenerationStub = sandbox.stub(game, "setNextGeneration");
            let updateCEllsStub = sandbox.stub(game.board, "updateCells");
            game.updateGeneration();
            setNextGenerationStub.calledOnce.should.be.true('setNextGeneration should be called exactly once');
            setNextGenerationStub.calledWithExactly().should.be.true('setNextGeneration should be called with 0 arguments');
            updateCEllsStub.calledOnce.should.be.true('updateCEllsStub should be called exactly once');
            updateCEllsStub.calledWithExactly().should.be.true('updateCEllsStub should be called with 0 arguments');
        })
    });

    describe('for setIntervals function', () => {
        beforeEach(() => {
            game = new GameOfLife(N, N);
        });

        [0, undefined, -1, 100].forEach(function (interval) {
            it(util.format('should throw an error for an invalid interval %s', interval), () => {
                game.initialized = true;
                should(() => game.setIntervals(interval)).throw(util.format(constants.ERROR_MSG_INVALID_INTERVAL, constants.MAX_INTERVALS));
            });
        });

        it('should throw an error for an uninitialized game', () => {
            let interval = 30;
            should(() => game.setIntervals(interval)).throw(constants.ERROR_MSG_UNINITIALIZED);
        });

        it('should not change intervals if it is not Nil', () => {
            game.initialized = true;
            let interval = 30;
            game.intervals = 'something';
            game.setIntervals(interval);
            game.intervals.should.equal('something');
        });

        it('should set intervals if intervals is undefined', () => {
            game.initialized = true;
            let interval = 1;
            game.intervals = undefined;
            game.setIntervals(interval);
            game.intervals.should.not.be.undefined();
            clearInterval(game.intervals);
        });
    });

    describe('for stop function', () => {
        beforeEach(() => {
            game = new GameOfLife(N, N);
        });

        it('should stop and reset intervals to undefined', function () {
            game.intervals = setInterval(() => console.log('setInterval started'), 100);
            game.stop();
            should(game.intervals).be.undefined();
        })
    });

    describe('for init function', () => {
        beforeEach(() => {
            game = new GameOfLife(N, N);
        });

        it('should set cells in array to be alive', () => {
            let livingCells = [];
            for (let i = 0; i < N; i++) {
                for (let j = 0; j < N; j++) {
                    livingCells.push({row: i, col: j});
                }
            }
            game.init(livingCells);
            for (let i = 0; i < N; i++) {
                for (let j = 0; j < N; j++) {
                    game.board.cells[i][j].isAlive().should.be.true('All cells should alive');
                }
            }
        });

        it('should throw error for an invalid cell location', () => {
            let livingCells =[{row: -1, col: 0}];
            should(()=>game.init(livingCells)).throw(constants.ERROR_MSG_CELL_OUT_BOUNDARIES);
        });

        [undefined, "'not array'"].forEach((input)=>{
            it(util.format('should throw an error for an invalid input: %s',input), ()=> {
                should(()=>game.init(input)).throw(constants.ERROR_MSG_INVALID_INPUT_INIT);
            });
        })
    });

    describe('for start function', function () {
        let initStub, setIntervalsStub;
        let livingCells =[];
        let intervals = 30;

        beforeEach(() => {
            game = new GameOfLife(N, N);
        });

        it('should call init and setInterval successfully', ()=>{
            initStub = sandbox.stub(game, 'init');
            setIntervalsStub = sandbox.stub(game,'setIntervals');
            game.start(livingCells, intervals);
            initStub.calledWithExactly(livingCells).should.be.true('init should be called with the alive cells locations array and no other arguments');
            initStub.calledOnce.should.be.true('init should be called only once');
            setIntervalsStub.calledWithExactly(intervals).should.be.true('setIntervals should be called with the requested interval and no other arguments');
            setIntervalsStub.calledOnce.should.be.true('setIntervals should be called only once');
        });

        it ('should catch any error from init and re-throw it', ()=>{
            initStub = sandbox.stub(game, 'init').throws(new Error('error'));
            setIntervalsStub = sandbox.stub(game, 'setIntervals');
            should(()=>game.start(livingCells, intervals)).throw('error');
            initStub.calledWithExactly(livingCells).should.be.true('init should be called with the alive cells locations array and no other arguments');
            initStub.calledOnce.should.be.true('init should be called only once');
            setIntervalsStub.called.should.be.false('setIntervals should not be called');
        });

        it ('should catch any error from setIntervals and re-throw it', ()=> {
            initStub = sandbox.stub(game, 'init');
            setIntervalsStub = sandbox.stub(game, 'setIntervals').throws(new Error('error'));
            should(()=>game.start(livingCells, intervals)).throw('error');
            setIntervalsStub.calledWithExactly(intervals).should.be.true('setIntervals should be called with the requested interval and no other arguments');
            setIntervalsStub.calledOnce.should.be.true('setIntervals should be called only once');
            initStub.calledWithExactly(livingCells).should.be.true('init should be called with the alive cells locations array and no other arguments');
            initStub.calledOnce.should.be.true('init should be called only once');
        });
    });
});