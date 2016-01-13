var expect = require('chai').expect;
var request = require('supertest');
const API_URL = "http://localhost:3000/api/users";

describe('users', function(){
	it('should create user', function(done){
		var user = {
			name: 'Butt Chicken',
			email: 'buttchicken@example.com',
			password: 'password'
		};

		request(API_URL)
			.post("/create")
			.send(user)
			.expect(200, done);
	});

	var agent = request.agent(API_URL);
	it('should login user', function(done){
		var user = {
			email: 'buttchicken@example.com',
			password: 'password'
		};

		agent
			.post("/login")
			.send(user)
			.expect(200, done);
	});

	it('should authenticate logged in user', function(done){
		agent
			.get("/me")
			.expect(200, done);
	});

});
