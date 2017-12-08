'use strict';
const {getBorderCharacters} = require('table');

module.exports = {
    border: getBorderCharacters('void'),
    columnDefault: {
        paddingLeft:1,
        paddingRight: 1,
        alignment: 'center'
    },

};