'use strict';

const bunyan = require('bunyan'),
constants = require('./consts');

const logger = bunyan.createLogger(
    {
        name: constants.GAME_NAME,
        src: true,
        level: constants.LOG_LEVEL,
        streams: [
            {
                level: constants.LOG_LEVEL,
                stream: process.stdout
            },
            {
                level: 'fatal',
                stream: process.stderr
            }
        ]
    });

module.exports = logger;