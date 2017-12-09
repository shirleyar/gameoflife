'use strict';

const should = require('should'),
    _ = require('lodash'),
    sinon = require('sinon'),
    util = require('util'),
    clear = require('cli-clear');

const BoardUi = require('../../../src/views/CLI/BoardUiCli'),
    constants = require('../../utils/constsUI-cli');

describe('BoardUi unit tests', () => {
    let board, sandbox;

    before(() => {
        sandbox = sinon.sandbox.create();
    });

    afterEach(() => {
        sandbox.restore();
        board = undefined;
    });

    describe('for constructor function', () => {
        it('should initialize the board with the data', () => {
            let data = [["a"], ["b"]];
            let isValidSpy = sandbox.spy(BoardUi, 'isValidData');
            board = new BoardUi(data);
            data.should.deepEqual(data);
            isValidSpy.calledOnce.should.be.true('isValidData supposed to be called once');
            isValidSpy.calledWithExactly(data).should.be.true('isValidData supposed to get only data');
            isValidSpy.returned(true).should.be.true('isValidData supposed to return true for valid data');
        });

        [undefined, "dummy", []].forEach((data) => {
            it(util.format('should throw an error for data input: %s', data), () => {
                let isValidSpy = sandbox.spy(BoardUi, 'isValidData');
                should(() => board = new BoardUi(data)).throw(constants.ERROR_INVALID_BOARD_DATA);
                should(board).be.undefined();
                isValidSpy.calledOnce.should.be.true('isValidData supposed to be called once');
                isValidSpy.calledWithExactly(data).should.be.true('isValidData supposed to get only data');
                isValidSpy.returned(false).should.be.true('isValidData supposed to return true for invalid data');
            })
        })
    })
});