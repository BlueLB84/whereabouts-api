const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { User } = require('../../user-model');

module.exports = function(req, res) {
	const requiredField = 'usrname';
	if (!('usrname' in req.body)) {
		const message = `Missing username in request body`;
		console.error(message);
		return res.status(400).send(message);
	}
	
	if (req.params.userid !== req.body.userId) {
		const message = (`Request path user ID (${req.params.userid}) and request body user ID(${req.body.userId}) must match`);
		console.error(message);
		return res.status(400).send(message);
	}

	console.log(`Updating user with user ID: ${req.params.userid}`);
	const toUpdate = {};
	const updateableFields = ['imgSrc', 'whereabouts'];

	updateableFields.map((field, index) => {
		if (field in req.body) {
			toUpdate[field] = req.body[field];
		}
	})
	
	
	User
		.findByIdAndUpdate(req.params.userid, {$set: toUpdate, $push: {Users: req.body.userId}})
		.then(user => res.status(204).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}));
};

