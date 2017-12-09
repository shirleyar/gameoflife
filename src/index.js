#!/usr/bin/env node

const CLIcontroller = require('./controllers/controller');

let controller = new CLIcontroller();

controller.startGame();