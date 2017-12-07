#!/usr/bin/env node

const CLIcontroller = require('./controllers/cli-controller');

let controller = new CLIcontroller();

controller.startGame();