const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { Team } = require('../../team-model');

module.exports = function(req, res) {
	Team
		.findById(req.params.teamid)
		.then(team => res.json(team.teamApiRep()))
		.then(res.status(200))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error /users/:username'});
		});
};
