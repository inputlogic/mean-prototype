var expect = require('chai').expect;
var request = require('request');

describe('users', function(){
	it('should create user', function(done){
		var user = {
			name: 'James Doe',
			email: 'james@example.com',
			password: 'password'
		};
		request({
			method: "POST",
			json: true,
			body: user,
			url: "http://localhost:3000/api/users/create"
		}, function(err, res){
			if(err) {
				done(err);
			}
			else {
				done();
			}
		});
	});
});
