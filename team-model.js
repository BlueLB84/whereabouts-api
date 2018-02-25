const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
	name: {type: String, required: true, unique: true},
	motto: {type: String, default: ''},
	imgSrc: {type: String, default: 'https://picsum.photos/150'},	
	bulletins: [
		{
			id: false,
			_id: false,
			userId: {type: String},
			text: {type: String}
		}
	],
	users: Array
});

teamSchema.methods.teamApiRep = function() {
	return {
		teamId: this._id,
		name: this.name,
		motto: this.motto,
		imgSrc: this.imgSrc,
		bulletins: this.bulletins,
		users: this.users
	};
}

const Team = mongoose.model('Team', teamSchema);

module.exports = { Team };



