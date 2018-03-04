const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { User } = require('../../user-model');

module.exports = function(req, res) {
	User
		.findOne({'userUID' : req.params.useruid})
		.then(user => {
			if (!user) {
				res.redirect('/');
			}
			res.status(200).json(user.userApiRep());
		})
		.catch(err => {
			console.error(err);
				res.status(500).json({message: 'Internal server error /users/:username'});
		});
};