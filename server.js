'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

const cors = require('cors');
const { DATABASE_URL, CLIENT_ORIGIN, PORT,  } = require('./config');
const app = express();

const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const usersRouter = require('./routers/usersRouter');
const teamsRouter = require('./routers/teamsRouter');

mongoose.Promise = global.Promise;

app.use(morgan('common'));
app.use(
	cors({
		origin: CLIENT_ORIGIN
	})
);

passport.use(localStrategy);
passport.use(jwtStrategy);

const jwtAuth = passport.authenticate('jwt', { session: false });

// Routers
app.use('/api/auth', authRouter);
app.use('/api/users', jwtauth, usersRouter);
app.use('/api/teams', jwtauth, teamsRouter);

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
	return new Promise((resolve, reject) => {
		mongoose.connect(databaseUrl, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(port, () => {
				console.log(`Your app is listening on port ${port}`);
				resolve();
			})
			.on('error', err => {
				mongoose.disconnect();
				reject(err);
			});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	runServer(DATABASE_URL).catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
