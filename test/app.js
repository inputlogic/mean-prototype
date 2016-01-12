var expect = require('chai').expect;
var request = require('request');

describe('app.js', function(){

	it('should have configs', function(done){
		try{
			require('../config'); //TODO find out how to test app.config
			done();
		} catch(err){
			done(err);
		}
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
