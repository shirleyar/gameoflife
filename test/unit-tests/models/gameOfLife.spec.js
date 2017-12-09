'use strict';

const should = require('should'),
    sinon = require('sinon'),
    util = require('util'),
    events = require('events');

const GameOfLife = require('../../../src/models/GameOfLife'),
    constants = require('../../utils/consts'),
    N = 10;

describe('Unit tests for GameOfLife class', () => {
    let game, sandbox;
    const rows = N,
        columns = N,
        generations = N,
        eventEmitter = new events.EventEmitter(),
        intervals = 0.5;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
        game = undefined; // fresh start for each test
    });

    describe('for constructor function', () => {
        let isValidGenerationsSpy, isValidIntervalsSpy;

        beforeEach(() => {
            isValidGenerationsSpy = sandbox.spy(GameOfLife, 'isValidGenerations');
            isValidIntervalsSpy = sandbox.spy(GameOfLife, 'isValidIntervals');
        });

        [
            {n: rows, m: columns, generations: generations, eventEmitter: eventEmitter, intervals: intervals},
            {n: 15, m: 3, generations: 0, eventEmitter: {}, intervals: 1},
            {n: 1, m: 21, generations: 3, eventEmitter: "test", intervals: 0.0001}
        ].forEach((testCase) => {
            it(util.format('should build an uninitialized board and initialized rows and cols properties successfully, intervals should remain undefined'), () => {
                game = new GameOfLife(testCase.n, testCase.m, testCase.generations, testCase.eventEmitter, testCase.intervals);
                game.rows.should.equal(testCase.n);
                game.cols.should.equal(testCase.m);
                game.generations.should.equal(testCase.generations);
                game.eventEmitter.should.equal(testCase.eventEmitter);
                game.intervals.should.equal(testCase.intervals);
                game.currentGeneration.should.equal(0, 'Current generation is supposed to be 0');
                isValidGenerationsSpy.calledOnce.should.be.true('isValidGenerations should be called once');
                isValidGenerationsSpy.returned(true).should.be.true('isValidGenerations should have returned true');
                isValidGenerationsSpy.calledWithExactly(testCase.generations).should.be.true('isValidGenerations should have been called with generations argument');
                isValidIntervalsSpy.calledOnce.should.be.true('isValidIntervals should be called once');
                isValidIntervalsSpy.returned(true).should.be.true('isValidIntervals should have returned true');
                isValidIntervalsSpy.calledWithExactly(testCase.intervals).should.be.true('isValidIntervalsSpy should have been called with intervals argument');

            });
        });

        [0, -5, undefined]
            .forEach((row) => {
                it(util.format('should throw an error for rows: %s', row), () => {
                    should(() => game = new GameOfLife(row, columns, generations, eventEmitter, intervals)).throw(constants.ERROR_MSG_BOARD_SCALES_INVALID);
                    should(game).be.undefined();
                    isValidGenerationsSpy.calledOnce.should.be.true('isValidGenerations should be called once');
                    isValidGenerationsSpy.returned(true).should.be.true('isValidGenerations should have returned true');
                    isValidGenerationsSpy.calledWithExactly(generations).should.be.true('isValidGenerations should have been called with generations argument');
                    isValidIntervalsSpy.calledOnce.should.be.true('isValidIntervals should be called once');
                    isValidIntervalsSpy.returned(true).should.be.true('isValidIntervals should have returned true');
                    isValidIntervalsSpy.calledWithExactly(intervals).should.be.true('isValidIntervalsSpy should have been called with intervals argument');
                });
            });
        [0, -2700, null]
            .forEach((col) => {
                it(util.format('should throw an error for columns: %s', col), () => {
                    should(() => game = new GameOfLife(rows, col, generations, eventEmitter, intervals)).throw(constants.ERROR_MSG_BOARD_SCALES_INVALID);
                    should(game).be.undefined();
                    isValidGenerationsSpy.calledOnce.should.be.true('isValidGenerations should be called once');
                    isValidGenerationsSpy.returned(true).should.be.true('isValidGenerations should have returned true');
                    isValidGenerationsSpy.calledWithExactly(generations).should.be.true('isValidGenerations should have been called with generations argument');
                    isValidIntervalsSpy.calledOnce.should.be.true('isValidIntervals should be called once');
                    isValidIntervalsSpy.returned(true).should.be.true('isValidIntervals should have returned true');
                    isValidIntervalsSpy.calledWithExactly(intervals).should.be.true('isValidIntervalsSpy should have been called with intervals argument');
                });
            });

        it('should throw an error for an invalid generations argument', () => {
            const invalidGenerations = -1;
            should(() => game = new GameOfLife(rows, columns, invalidGenerations, eventEmitter, intervals)).throw(constants.ERROR_MSG_INVALID_GENERATIONS);
            should(game).be.undefined();
            isValidGenerationsSpy.calledOnce.should.be.true('isValidGenerations should be called once');
            isValidGenerationsSpy.returned(false).should.be.true('isValidGenerations should have returned false');
            isValidGenerationsSpy.calledWithExactly(invalidGenerations).should.be.true('isValidGenerations should have been called with generations argument');
            isValidIntervalsSpy.called.should.be.false('isValidIntervals should be called once');
        });

        it('should throw an error for an invalid eventEmitter argument', () => {
            const invalidEventEmitter = null;
            should(() => game = new GameOfLife(rows, columns, generations, invalidEventEmitter, intervals)).throw(constants.ERROR_MSG_INVALID_EVENT_EMITTER);
            should(game).be.undefined();
            isValidGenerationsSpy.calledOnce.should.be.true('isValidGenerations should be called once');
            isValidGenerationsSpy.returned(true).should.be.true('isValidGenerations should have returned true');
            isValidGenerationsSpy.calledWithExactly(generations).should.be.true('isValidGenerations should have been called with generations argument');
            isValidIntervalsSpy.calledOnce.should.be.true('isValidIntervals should be called once');
            isValidIntervalsSpy.returned(true).should.be.true('isValidIntervals should have returned true');
            isValidIntervalsSpy.calledWithExactly(intervals).should.be.true('isValidIntervalsSpy should have been called with intervals argument');
        });

        it('should throw an error for an invalid intervals argument', () => {
            const invalidIntervals = 0;
            should(() => game = new GameOfLife(rows, columns, generations, eventEmitter, invalidIntervals)).throw(constants.ERROR_MSG_INVALID_INTERVAL);
            should(game).be.undefined();
            isValidGenerationsSpy.calledOnce.should.be.true('isValidGenerations should be called once');
            isValidGenerationsSpy.returned(true).should.be.true('isValidGenerations should have returned true');
            isValidGenerationsSpy.calledWithExactly(generations).should.be.true('isValidGenerations should have been called with generations argument');
            isValidIntervalsSpy.calledOnce.should.be.true('isValidIntervals should be called once');
            isValidIntervalsSpy.returned(false).should.be.true('isValidIntervals should have returned false');
            isValidIntervalsSpy.calledWithExactly(invalidIntervals).should.be.true('isValidIntervalsSpy should have been called with intervals argument');
        });
    });

    describe('for setNextGeneration function', () => {
        let countNeigborsStub, decideCellNextStateSpy;

        beforeEach(() => {
            game = new GameOfLife(rows, columns, generations, eventEmitter, intervals);
            game.board.init();
        });

        it('should execute countNeighbors and decideCellNextState for each cell in board', () => {
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

        it('when countNeighbors throws an error should be able to re-throw it', () => {
            countNeigborsStub = sandbox.stub(game.board, "countNeighbors").throws(new Error('error'));
            decideCellNextStateSpy = sandbox.spy(game, "decideCellNextState");
            should(() => game.setNextGeneration()).throw('error');
            countNeigborsStub.callCount.should.be.exactly(1);
            decideCellNextStateSpy.callCount.should.be.exactly(0);
        });

        it('when decideCellNextState throws an error should be able to re-throw it', () => {
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
            game = new GameOfLife(rows, columns, generations, eventEmitter, intervals);
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
        ].forEach((testCase) => {
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
        let eventEmitterSpy;

        beforeEach(() => {
            game = new GameOfLife(rows, columns, generations, eventEmitter, intervals);
            eventEmitterSpy = sandbox.spy(game.eventEmitter, 'emit')
        });

        it('should set cells next state and update the board', () => {
            let setNextGenerationStub = sandbox.stub(game, "setNextGeneration");
            let updateCellsStub = sandbox.stub(game.board, "updateCells");
            game.updateGeneration();
            game.currentGeneration.should.equal(1, 'current generation should have benn increased by 1');
            setNextGenerationStub.calledOnce.should.be.true('setNextGeneration should be called exactly once');
            setNextGenerationStub.calledWithExactly().should.be.true('setNextGeneration should be called with 0 arguments');
            updateCellsStub.calledOnce.should.be.true('updateCellsStub should be called exactly once');
            updateCellsStub.calledWithExactly().should.be.true('updateCellsStub should be called with 0 arguments');
            eventEmitterSpy.calledOnce.should.be.true('One event should have been fired');
            eventEmitterSpy.calledWithExactly(constants.EVENT_UPDATED_GENERATION);
        });

        it('should throw an event when current generation equals number of generations', () => {
            let setNextGenerationStub = sandbox.stub(game, "setNextGeneration");
            let updateCellsStub = sandbox.stub(game.board, "updateCells");
            game.currentGeneration = generations - 1;
            game.updateGeneration();
            game.currentGeneration.should.equal(generations, 'current generation should have benn increased by 1');
            setNextGenerationStub.calledOnce.should.be.true('setNextGeneration should be called exactly once');
            setNextGenerationStub.calledWithExactly().should.be.true('setNextGeneration should be called with 0 arguments');
            updateCellsStub.calledOnce.should.be.true('updateCellsStub should be called exactly once');
            updateCellsStub.calledWithExactly().should.be.true('updateCellsStub should be called with 0 arguments');
            eventEmitterSpy.calledTwice.should.be.true('Two events should have been fired once');
            eventEmitterSpy.calledWith(constants.EVENT_UPDATED_GENERATION);
            eventEmitterSpy.calledWith(constants.EVENT_STOPPED);
        });
    });

    describe('for stop function', () => {
        beforeEach(() => {
            game = new GameOfLife(rows, columns, generations, eventEmitter, intervals);
        });

        it('should stop and reset intervals to undefined', () => {
            game.intervals = setInterval(() => console.log('setInterval started'), 100);
            game.stop();
            should(game.intervals).be.undefined();
        })
    });

    describe('for init function', () => {
        beforeEach(() => {
            game = new GameOfLife(rows, columns, generations, eventEmitter, intervals);
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
            let livingCells = [{row: -1, col: 0}];
            should(() => game.init(livingCells)).throw(constants.ERROR_MSG_CELL_OUT_BOUNDARIES);
        });

        [undefined, "'not array'"].forEach((input) => {
            it(util.format('should throw an error for an invalid input: %s', input), () => {
                should(() => game.init(input)).throw(constants.ERROR_MSG_INVALID_INPUT_INIT);
            });
        })
    });

    describe('for start function', () => {
        let initStub;
        let livingCells = [];
        let intervals = 30;

        beforeEach(() => {
            game = new GameOfLife(rows, columns, generations, eventEmitter, intervals);
            game.board.init();
        });

        it('should call init successfully', () => {
            initStub = sandbox.stub(game, 'init');
            game.start(livingCells, intervals);
            initStub.calledWithExactly(livingCells).should.be.true('init should be called with the alive cells locations array and no other arguments');
            initStub.calledOnce.should.be.true('init should be called only once');
            clearInterval(game.intervals);
        });

        it('should catch any error from init and re-throw it', () => {
            initStub = sandbox.stub(game, 'init').throws(new Error('error'));
            should(() => game.start(livingCells, intervals)).throw('error');
            initStub.calledWithExactly(livingCells).should.be.true('init should be called with the alive cells locations array and no other arguments');
            initStub.calledOnce.should.be.true('init should be called only once');
        });
    });
});