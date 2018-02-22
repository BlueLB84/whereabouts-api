const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { Team } = require('../../team-model');

module.exports = function(req, res) {
	Team
	.findByIdAndRemove(req.params.teamid)
	.then(user => res.status(204).end())
	.catch(err => res.status(500).json({message: 'Internal server error'}));
};