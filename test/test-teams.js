const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();
const expect = chai.expect;
chai.use(require('chai-things'));

const { Team } = require('../team-model');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function seedTeamData() {
	console.info('seeding team data');
	const seedData = [];

	for(let i=1; i<=5; i++) {
		seedData.push(generateTeamData());
	}
	return Team.insertMany(seedData);
}

function generateTeamData() {

	return {
		name: faker.lorem.word(),
		motto: faker.lorem.sentence(),
		imgSrc: faker.image.imageUrl(),
		bulletins: [{
			userId: faker.random.number().toString(),
			text: faker.lorem.sentence()
		},
		{
			userId: faker.random.number().toString(),
			text: faker.lorem.sentence()
		}],
		users: [faker.random.number().toString(),faker.random.number().toString()]
	}
}

function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}

/// TESTS ///
describe('Teams API resource', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return seedTeamData();
	});

	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});

	//  /api/teams/:id GET
	describe('teams GET endpoint', function() {
		it('should return all existing teams', function() {
			let res;
			return chai.request(app)
				.get('/api/teams')
				.then(function(_res) {
					res = _res;
					res.should.have.status(200);
					res.body.teams.should.have.length.of.at.least(1);
					return Team.count();
				})
				.then(function(count) {
					res.body.teams.should.have.lengthOf(count);
				});
			});

		it('should return 200 status on team id GET', function() {
			let team;
			
			return Team
				.findOne()
				.then(function(_team) {
					team = _team;
					return chai.request(app).get(`/api/teams/${team.id}`);
				})
				.then(function(res) {
					res.should.have.status(200);
				});
		});

		it('should return team with right fields', function() {
			let resTeam;
			
			return Team
				.findOne()
				.then(function(_resTeam) {
					resTeam = _resTeam;
					return chai.request(app).get(`/api/teams/${resTeam.id}`);
				})
				.then(function(res) {
					res.should.be.json;
					res.body.should.be.a('object');

					res.body.should.include.keys(
						'teamId', 'name', 'motto', 'imgSrc', 'bulletins', 'users');
				});	
		});
	});

	//  /api/teams POST
	describe('teams POST endpoint', function() {
		
		it('should add a new team', function() {
			const newTeam = generateTeamData();

			return chai.request(app)
				.post('/api/teams')
				.send(newTeam)
				.then(function(res) {
					res.should.have.status(201);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.include.keys(
						'teamId', 'name', 'motto', 'imgSrc', 'bulletins', 'users');
					res.body.teamId.should.not.be.null;
					res.body.name.should.equal(newTeam.name);
					res.body.motto.should.equal(newTeam.motto);
					res.body.imgSrc.should.equal(newTeam.imgSrc);
					expect(res.body.bulletins).to.be.a('array');
					expect(res.body.users).to.deep.equal(newTeam.users);
					res.body.users.should.have.length.of.at.least(1);
					return Team.findById(res.body.teamId);
				})
				.then(function(team) {
					team.name.should.equal(newTeam.name);
					team.motto.should.equal(newTeam.motto);
					team.imgSrc.should.equal(newTeam.imgSrc);
					expect(team.bulletins).to.be.a('array');
					expect(team.users).to.deep.equal(newTeam.users);
				});
		});
	});

	//  /api/teams PUT
	describe('teams PUT input', function() {

		it('should update field sent over', function() {
			const updateData = {
				bulletins: {
					text: 'Testing this super awesome app with a new bulletin.'
				}
			};

		return Team
			.findOne()
			.then(function(team) {
				console.log(team);
				updateData.teamId = team.id;
				updateData.name = team.name;
				updateData.bulletins.userId = team.users[0];
				return chai.request(app)
					.put(`/api/teams/${team.id}`)
					.send(updateData);
			})
			.then(function(res) {
				res.should.have.status(204);
				return Team.findById(updateData.teamId);
			})
			.then(function(team) {
				expect(team.bulletins.toObject()).to.include.something.that.deep.equals(updateData.bulletins);
			});
		});
	});

	//  /api/teams DELETE
	describe('teams DELETE endpoint', function() {

		it('should delete a team by id', function() {
			let team;

			return Team
				.findOne()
				.then(function(_team) {
					team = _team;
					return chai.request(app).delete(`/api/teams/${team.id}`);
				})
				.then(function(res) {
					res.should.have.status(204);
					return Team.findById(team.id);
				})
				.then(function(_team) {
					should.not.exist(_team);
				});
		});
	});
});