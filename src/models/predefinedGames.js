'use strict';

const _ = require('lodash');

const UNDERSCORE = '_', SPACE = ' ';

const games = {
    Blinker: {
        rows: 3,
        cols: 3,
        intervals: 1,
        livingCells: [
            {row: 0, col: 1},
            {row: 1, col: 1},
            {row: 2, col: 1},
        ],
        generations: 20
    },
    Beacon: {
        rows: 6,
        cols: 6,
        intervals: 1,
        livingCells: [
            {row: 1, col: 1},
            {row: 2, col: 1},
            {row: 1, col: 2},
            {row: 4, col: 3},
            {row: 3, col: 4},
            {row: 4, col: 4}
        ],
        generations: 20
    },
    Glider: {
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
    Gosper_Glider_Gun: {
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
};

function getGamesNames () {
    let names = Object.keys(games);
    return beautifyNames(names);
}

function beautifyNames(names) {
    names.forEach((name, index, namesArray) => {
       namesArray[index] = name.split(UNDERSCORE).join(SPACE)
    });
    return names;
}

function getGameByName (name) {
    if (_.includes(name, SPACE)) {
        name = name.split(SPACE).join(UNDERSCORE);
    }
    return games[name];
}

module.exports = {
  getGamesNames,
  getGameByName
};