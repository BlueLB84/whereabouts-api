const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { Team } = require('../../team-model');

module.exports = function(req, res) {
	Team
		.find()
		.then(teams => {
			res.json({
				teams: teams.map(
					(team) => team.teamApiRep())
			});
			res.status(200);
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'});
		});
};


