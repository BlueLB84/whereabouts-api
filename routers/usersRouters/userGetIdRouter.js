const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { User } = require('../../user-model');

module.exports = function(req, res) {
	User
		.findById(req.params.userid)
		.then(user => res.json(user.userApiRep()))
		.then(res.status(200))
		.catch(err => {
			console.error(err);
				res.status(500).json({message: 'Internal server error /users/:username'});
		});
};
