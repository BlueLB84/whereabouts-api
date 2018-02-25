const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { Team } = require('../../team-model');

module.exports = function(req, res) {
	const requiredField = 'name';
	if (!('name' in req.body)) {
		const message = `Missing team name in request body`;
		console.error(message);
		return res.status(400).send(message);
	}
	
	if (req.params.teamid !== req.body.teamId) {
		const message = (`Request path team ID (${req.params.teamid}) and request body team ID(${req.body.teamId}) must match`);
		console.error(message);
		return res.status(400).send(message);
	}

	console.log(`Updating team with team ID: ${req.params.teamid}`);
	const toUpdate = {};
	const updateableFields = ['motto', 'imgSrc', 'bulletins', 'users'];

	updateableFields.map((field, index) => {
		if (field in req.body) {
			toUpdate[field] = req.body[field];
		}
	})
	
	if (toUpdate.bulletins) {
		Team.findByIdAndUpdate(req.params.teamid, { $addToSet: { bulletins: toUpdate.bulletins } })
		.then(team => res.status(204).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}));
	} else if (toUpdate.users) {
		Team.findByIdAndUpdate(req.params.teamid, { $addToSet: { users: toUpdate.users } })
		.then(team => res.status(204).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}));
	} else {
		Team
		.findByIdAndUpdate(req.params.teamid, toUpdate)
		.then(team => res.status(204).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}));
	}	
};

