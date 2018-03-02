const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
	userUID: {type: String, default: ''},
	usrname: {
		type: String,
		required: true,
		unique: true
	},
	firstName: {type: String, default: ''},
	lastName: {type: String, default: ''},
	email: {type: String, default: ''},
	imgSrc: {type: String, default: 'https://picsum.photos/150'},
	whereabouts: {
		location: String,
		activity: String
	}
});

userSchema.methods.userApiRep = function() {
	return {
		userId: this._id,
		userUID: this.userUID,
		usrname: this.usrname,
		firstName: this.firstName,
		lastName: this.lastName,
		email: this.email,
		imgSrc: this.imgSrc,
		whereabouts: this.whereabouts
	};
};

const User = mongoose.model('User', userSchema);

module.exports = { User };