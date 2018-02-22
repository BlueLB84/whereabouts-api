const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
	usrname: {
		type: String,
		required: true,
		unique: true
	},
	firstName: {type: String, default: ''},
	lastName: {type: String, default: ''},
	imgSrc: {type: String, default: 'https://picsum.photos/150'},
	whereabouts: {
		location: {type: String, default: ''},
		activity: {type: String, default: ''}
	}
});

userSchema.methods.userApiRep = function() {
	return {
		userId: this._id,
		usrname: this.username,
		firstName: this.firstName,
		lastName: this.lastName,
		imgSrc: this.imgSrc,
		whereabouts: this.whereabouts
	};
};

const User = mongoose.model('User', userSchema);

module.exports = { User };