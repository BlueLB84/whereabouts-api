const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();
const expect = chai.expect;

const { User } = require('../user-model');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function seedUserData() {
	console.info('seeding user data');
	const seedData = [];

	for(let i=1; i<=5; i++) {
		seedData.push(generateUserData());
	}
	return User.insertMany(seedData);
}

function generateUserData() {

	return {
		usrname: faker.lorem.word(),
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
		imgSrc: faker.image.imageUrl(),
		whereabouts: {
			location: faker.lorem.sentence(),
			activity: faker.lorem.sentence()
		}
	}
}

function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}

/// TESTS ///
describe('Users API resource', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return seedUserData();
	});

	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});

	//  /api/users/:id GET
	describe('users GET endpoint', function() {

		it('should return 200 status on user id GET', function() {
			let user;
			
			return User
				.findOne()
				.then(function(_user) {
					user = _user;
					return chai.request(app).get(`/api/users/${user.id}`);
				})
				.then(function(res) {
					res.should.have.status(200);
				});
		});

		it('should return user with right fields', function() {
			let resUser;
			
			return User
				.findOne()
				.then(function(_resUser) {
					resUser = _resUser;
					return chai.request(app).get(`/api/users/${resUser.id}`);
				})
				.then(function(res) {
					res.should.be.json;
					res.body.should.be.a('object');

					res.body.should.include.keys(
						'userId', 'usrname', 'firstName', 'lastName', 'imgSrc', 'whereabouts');
				});	
		});
	});

	//  /api/users POST
	describe('users POST endpoint', function() {
		
		it('should add a new user', function() {
			const newUser = generateUserData();

			return chai.request(app)
				.post('/api/users')
				.send(newUser)
				.then(function(res) {
					res.should.have.status(201);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.include.keys(
						'userId', 'usrname', 'firstName', 'lastName', 'imgSrc', 'whereabouts');
					res.body.userId.should.not.be.null;
					res.body.usrname.should.equal(newUser.usrname);
					res.body.firstName.should.equal(newUser.firstName);
					res.body.lastName.should.equal(newUser.lastName);
					res.body.imgSrc.should.equal(newUser.imgSrc);
					res.body.whereabouts.should.equal(newUser.whereabouts);
					return User.findById(res.body.userId);
				})
				.then(function(user) {
					user.usrname.should.equal(newUser.usrname);
					user.firstName.should.equal(newUser.firstName);
					user.lastName.should.equal(newUser.lastName);
					user.imgSrc.should.equal(newUser.imgSrc);
					user.whereabouts.should.equal(newUser.whereabouts);
				});
		});
	});

	//  /api/users PUT
	describe('users PUT input', function() {

		it('should update field sent over', function() {
			const updateData = {
				whereabouts: {
					location: 'A desk. In a building.',
					activity: 'Testing this super awesome app.'
				}
			};

		return User
			.findOne()
			.then(function(user) {
				updateData.userId = user.id;
				updateData.usrname = user.usrname;
				return chai.request(app)
					.put(`/api/users/${user.id}`)
					.send(updateData);
			})
			.then(function(res) {
				res.should.have.status(204);
				return User.findById(updateData.userId);
			})
			.then(function(user) {
				user.whereabouts.should.equal(updateData.whereabouts);
			});
		});
	});

	//  /api/users DELETE
	describe('users DELETE endpoint', function() {

		it('should delete a user by id', function() {
			let user;

			return User
				.findOne()
				.then(function(_user) {
					user = _user;
					return chai.request(app).delete(`/api/users/${user.id}`);
				})
				.then(function(res) {
					res.should.have.status(204);
					return User.findById(user.id);
				})
				.then(function(_user) {
					should.not.exist(_user);
				});
		});
	});
});


