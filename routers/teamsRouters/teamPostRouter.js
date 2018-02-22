const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { Team } = require('../../team-model');
module.exports = function(req, res) {
	const requiredFields = ['name'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
	Team
		.create({
			name: req.body.name,
			motto: req.body.motto,
			imgSrc: req.body.imgSrc,
		})
		.then(
			team => res.status(201).json(team.teamApiRep()))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'});
		});
};
