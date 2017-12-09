'use strict';

module.exports = {
    CELL_DEAD: "dead",
    CELL_ALIVE: "alive",

    NEXT_THE_SAME: 2,
    NEXT_ALIVE: 3,

    MAX_INTERVALS: 60,

    ERROR_MSG_NIL: "Cell's currentState is undefined or null, perhaps a zombie? ;) ",
    ERROR_MSG_BOARD_SCALES_INVALID: "Invalid scales (rows or columns) were provided for board size",
    ERROR_MSG_NEXT_STATE_UNDEFINED: "Cell's next state is undefined",
    ERROR_MSG_CELL_OUT_BOUNDARIES: "Cell is out of boundaries",
    ERROR_MSG_INVALID_INTERVAL: "Intervals should be larger than 0",
    ERROR_MSG_UNINITIALIZED: "Trying to start an uninitialized game",
    ERROR_MSG_INVALID_INPUT_INIT: "Invalid arguments in init function",
    ERROR_MSG_INVALID_GENERATIONS: "Invalid generations. Should be an int larger or equal to 0",
    ERROR_MSG_INVALID_EVENT_EMITTER: "Invalid eventEmitter",

    WELCOME_MSG:"Welcome User! This is Conway's Game Of Life. The rules are simple:" +
    "\nThere is a board. Each place on the board is a cell." +
    "\nA cell can be either alive or dead, not both (zombie fan?)" +
    "\nIf the cell has %s living neighbors, it's state will remain." +
    "\nIf the cell has %s living neighbors, it will come to life." +
    "\nAny other number of neighbors the cell will die.",

    EVENT_UPDATED_GENERATION: "updated",
    EVENT_STOPPED: 'stopped',

    LOG_LEVEL: process.env.LOG_LEVEL || 'info',

    GAME_NAME: "Conway's Game Of Life",

    ERROR_CODE: 1,
};