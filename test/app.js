var expect = require('chai').expect;
var request = require('supertest');
require('../app.js');

describe('app.js', function() {
	it('should have global configs, models, and logger', function(done) {
		expect(app).to.have.property('config');
		expect(app).to.have.property('models');
		expect(app).to.have.property('log');
		return done();
	});

	it('should respond to http request (app is running)', function(done) {
		request(app)
			.get('/')
			.expect(function(res){
				return res.statusCode !== 500;
			})
			.end(done);
	});
});
