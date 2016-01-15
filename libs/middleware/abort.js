module.exports = function (req, res, next) {
	res.abort = function abort(code, msg) {
		if (isApiRequest(req)) {
			var response = {'statusCode': code}
			if(msg) response.message = msg;
			return res.status(code).send(response);
		}

		else {
			var viewPath = 'errors/'+code+'.html';
			res.status(code);
			return res.render(viewPath, {message: msg});
		}

		function isApiRequest(req) {
			return req.path.slice(0,5) == '/api/';
		};
	}

	return next();
}
