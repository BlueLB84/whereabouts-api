const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const app = express();

mongoose.Promise = global.Promise;

const authGetRouter = require('./authRouters/authGetRouter');

router.get('/:useruid', authGetRouter);

module.exports = router;

