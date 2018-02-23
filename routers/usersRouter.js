const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const app = express();

mongoose.Promise = global.Promise;

const usersGetRouter = require('./usersRouters/usersGetRouter');
const userGetIdRouter = require('./usersRouters/userGetIdRouter');
const userPostRouter = require('./usersRouters/userPostRouter');
const userPutRouter = require('./usersRouters/userPutRouter');
const userDeleteRouter = require('./usersRouters/userDeleteRouter');


router.get('/', jsonParser, usersGetRouter);
router.get('/:userid', userGetIdRouter);
router.post('/', jsonParser, userPostRouter);
router.put('/:userid', jsonParser, userPutRouter);
router.delete('/:userid', userDeleteRouter);

module.exports = router;
