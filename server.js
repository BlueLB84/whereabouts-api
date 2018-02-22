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




app.get('/api/*', (req, res) => {
	res.json({ok: true});
});

// app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

module.exports = {app};