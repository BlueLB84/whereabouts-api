const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { User } = require('../../user-model');

module.exports = function(req, res) {
	User
		.find()
		.then(users => {
			res.json({
				users: users.map(
					(user) => user.userApiRep())
			});
			res.status(200);
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'});
		});
};


