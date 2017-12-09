'use strict';

const should = require('should'),
    format = require('util').format;

const predefinedGames = require('../../../src/models/predefinedGames');


describe('Predefined games unit tests', () => {
    describe('for getGamesName function', () => {
        const expected = ['Blinker', 'Beacon', 'Glider', 'Gosper Glider Gun'];
        let answer = predefinedGames.getGamesNames();
        answer.should.deepEqual(expected);
    });

    describe('for getGameByName function', () => {
        [
            {
                name: 'Glider',
                game: {
                    rows: 20,
                    cols: 20,
                    intervals: 0.3,
                    livingCells: [
                        {row: 1, col: 0},
                        {row: 2, col: 1},
                        {row: 0, col: 2},
                        {row: 1, col: 2},
                        {row: 2, col: 2},
                    ],
                    generations: 50
                },
            },
            {
                name: 'Gosper Glider Gun',
                game: {
                    rows: 40,
                    cols: 40,
                    intervals: 0.2,
                    livingCells: [
                        {row: 5, col: 1},
                        {row: 5, col: 2},
                        {row: 6, col: 1},
                        {row: 6, col: 2},
                        {row: 5, col: 11},
                        {row: 6, col: 11},
                        {row: 7, col: 11},
                        {row: 4, col: 12},
                        {row: 3, col: 13},
                        {row: 3, col: 14},
                        {row: 8, col: 11},
                        {row: 9, col: 13},
                        {row: 9, col: 14},
                        {row: 6, col: 15},
                        {row: 5, col: 16},
                        {row: 6, col: 17},
                        {row: 7, col: 17},
                        {row: 6, col: 18},
                        {row: 8, col: 16},
                        {row: 3, col: 21},
                        {row: 4, col: 21},
                        {row: 5, col: 21},
                        {row: 3, col: 22},
                        {row: 4, col: 22},
                        {row: 5, col: 22},
                        {row: 2, col: 23},
                        {row: 6, col: 23},
                        {row: 1, col: 25},
                        {row: 2, col: 25},
                        {row: 6, col: 25},
                        {row: 7, col: 25},
                        {row: 3, col: 35},
                        {row: 4, col: 35},
                        {row: 3, col: 36},
                        {row: 4, col: 36},
                        {row: 6, col: 17},
                        {row: 7, col: 17},
                        {row: 6, col: 18},
                        {row: 8, col: 16},
                        {row: 3, col: 21},
                    ],
                    generations: 300
                }
            }
        ].forEach((testCase) => {
            it(format('should return the predefined game for the requested name', testCase.name), () => {
                let answer = predefinedGames.getGameByName(testCase.name);
                answer.should.deepEqual(testCase.game);
            });
        });


    });

});
