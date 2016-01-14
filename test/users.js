var expect = require('chai').expect;
var request = require('supertest');
const API_URL = "http://localhost:3000/api/users";

var agent = request.agent(API_URL);

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


	it('should logout user', function(done){
		agent
			.post("/logout")
			.expect(200, done);
	});

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

	it('should update user', function(done){
		var data = {name: 'Sir Butt Chicken'};

		agent
			.put("/me")
			.send(data)
			.expect(200, done);
	});

	it('should delete logged in user', function(done){
		agent
			.del("/me")
			.expect(200, done);
	});

	it("shouldn't update user that's been deleted", function(done){
		agent
			.put("/me")
			.expect(401, done);
	});

	it("shouldn't update user that isn't logged in", function(done){
		request(API_URL)
      .put("/me")
			.expect(401, done);
	});

});
