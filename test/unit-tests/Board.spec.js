'use strict';

const should = require('should'),
    sinon = require('sinon'),
    util = require('util');

const Board = require('../../src/models/Board'),
    constants = require('../utils/consts');

describe('Unit tests for Cell class', function () {
    let board;

    describe('for constructor function', function () {
        [
            {n: 12, m: 12},
            {n: 15, m: 3},
            {n: 1, m: 21}
        ].forEach(function (scale) {
            it(util.format('should build an uninitialized %sx%s board successfully', scale.n, scale.m), function () {
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
            it(util.format('should throw an error for rows: %s and columns: %s', scale.n, scale.m), function () {
                board = null;
                should(() => new Board(scale.n, scale.m)).throw(constants.ERROR_MSG_BOARD_SCALES_INVALID);
                should(board).equal(null);
            })
        })
    });

    describe('for init function', function () {

    });
});