const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

mongoose.Promise = global.Promise;

const teamsGetRouter = require('./teamsRouters/teamsGetRouter');
const teamGetIdRouter = require('./teamsRouters/teamGetIdRouter');
const teamPostRouter = require('./teamsRouters/teamPostRouter');
const teamPutRouter = require('./teamsRouters/teamPutRouter');
const teamDeleteRouter = require('./teamsRouters/teamDeleteRouter');

router.get('/', jsonParser, teamsGetRouter);
router.get('/:teamid', teamGetIdRouter);
router.post('/', jsonParser, teamPostRouter);
router.put('/:teamid', jsonParser, teamPutRouter);
router.delete('/:teamid', teamDeleteRouter);

module.exports = router;
