const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const cors = require('cors');
const { CLIENT_ORIGIN, PORT, DATABASE_URL } = require('./config');
const app = express();

const usersRouter = require('./routers/usersRouter');
const teamsRouter = require('./routers/teamsRouter');

mongoose.Promise = global.Promise;

app.use(morgan('common'));
app.use(
	cors({
		origin: CLIENT_ORIGIN
	})
);

// Routers
app.use('/api/users', usersRouter);
app.use('/api/teams', teamsRouter);

app.get('/api/*', (req, res) => {
	res.json({ok: true}); // change to send to client root url?
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
	runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
