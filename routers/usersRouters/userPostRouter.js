const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const { User } = require('../../user-model');
module.exports = function(req, res) {
	const requiredFields = ['usrrname'];
	const missingField = requiredFields.find(field => !(field in req.body));

	if (missingField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Missing field',
			location: missingField
		});
	}

	const stringFields = ['usrname', 'firstName', 'lastName', 'imgSrc'];
	const nonStringField = stringFields.find(field => field in req.body && typeof req.body[field] !== 'string');

	if (nonStringField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Incorrect field type: expected string',
			location: nonStringField
		});
	}

	const explicitlyTrimmedFields = ['usrname'];
	const nonTrimmedField = explicitlyTrimmedFields.find(field => req.body[field].trim() !== req.body[field]);

	if (nonTrimmedField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Cannot start or end with whitespace',
			location: nonTrimmedField
		});
	}

	const sizedFields = {usrname: {min: 3}};
	const tooSmallField = Object.keys(sizedFields).find(
		field =>
			'min' in sizedFields[field] &&
			req.body[field].trim().length < sizedFields[field].min
	);
	const tooLargeField = Object.keys(sizedFields).find(
		field =>
			'max' in sizedFields[field] &&
			req.body[field].trim().length > sizedFields[field].max
	);

	if (tooSmallField || tooLargeField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: tooSmallField
				? `must be at least ${sizedFields[tooSmallField].min} characters long`
				: `must be at most ${sizedFields[tooLargeField].max} characters long`,
			location: tooSmallField || tooLargeField
		});
	}

	let {usrname, firstName = '', lastName = '', imgSrc = ''} = req.body;

	firstName = firstName.trim();
	lastName = lastName.trim();
	imgSrc = imgSrc.trim();

	return User.find({usrname})
		.count()
		.then(count => {
			if (count > 0) {
				return Promise.reject({
					code: 422,
					reason: 'ValidationError',
					message: 'username is already taken.',
					location: 'usrname'
				});
			}
			return User;
		})
		.then(User => {
			return User.create({
				usrname,
				firstName,
				lastName,
				imgSrc
			});
		})
		.then(user => {
			return res.status(201).json(user.userApiRep());
		})
		.catch(err => {
			if (err.reason === 'ValidationError') {
				return res.status(err.code).json(err);
			}
			res.status(500).json({code: 500, message: 'Internal server error'});
		});
};