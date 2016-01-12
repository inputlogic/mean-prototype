var expect = require('chai').expect;
var request = require('request');
require('../app.js');

describe('app.js', function(){

	it('should have global configs, models, and logger', function(done){
		expect(app).to.have.property('config');
		expect(app).to.have.property('models');
		expect(app).to.have.property('log');
		done();
	});

	it('should respond to http request (is running)', function(done){
		request({
			method: "GET",
			json: true,
			url: "http://localhost:3000/"
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
