var fileExists = require('../helpers/fileExists.js');

module.exports = function (req, res, next){
	res.abort = function abort(code, msg){

		if(isApiRequest(req)){
			var response = {'statusCode': code, 'message': msg}
			if(msg)
				response.message = msg;
			res.status(code).send(response);
		}

		else {
			var viewPath = 'errors/'+code+'.html';
			var defaultPath = 'errors/500.html';
			res.status(code);
			fileExists(viewPath, function(exists){
				if(!exists) viewPath = defaultPath;
				res.render(viewPath, {message: msg})
			})
		}

		function isApiRequest(req){
			return req.path.slice(0,5) == '/api/';
		};
	}
	next();
}
