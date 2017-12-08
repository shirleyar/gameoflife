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
    EVENT_UPDATED_GENERATION: "updated",
    EVENT_STOPPED: 'stopped',
};