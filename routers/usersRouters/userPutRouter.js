const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { User } = require('../../user-model');

module.exports = function(req, res) {
	const requiredField = 'userId';
	if (!('userId' in req.body)) {
		const message = `Missing user ID in request body`;
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
	const updateableFields = ['imgSrc', 'whereabouts', 'email'];

	updateableFields.forEach(field => {
		if (field in req.body) {
			toUpdate[field] = req.body[field];
		}
	});
	
	User
		.findByIdAndUpdate(req.params.userid, toUpdate)
		.then(user => User.findById(req.params.userid))
		.then(user => res.status(202).json(user.userApiRep()))
		.catch(err => res.status(500).json({message: 'Internal server error'}));
};

