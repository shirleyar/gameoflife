'use strict';

const should = require('should'),
    _ = require('lodash'),
    sinon = require('sinon'),
    util = require('util');

const GameOfLife = require('../models/GameOfLife'),
    UserInteractionUi = require('../views/CLI/user-interaction'),
    BoardUI = require('../views/CLI/board-ui'),
    predefinedGames = require('../models/predefinedGames'),
    constantsGeneral = require('../../utils/'),
    constantsUI = require('../views/CLI/consts');