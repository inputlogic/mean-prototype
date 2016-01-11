var winston = require('winston');
var config = require('../../config');

module.exports = (function logger() {
	if(logger.instance == undefined) {
		logger.instance = new winston.Logger({
			level: config.logging.winston.level || 'info',
			transports: [
				new winston.transports.Console({
					colorize: true
				})
			]
		})
	}
	return logger.instance;
})();
