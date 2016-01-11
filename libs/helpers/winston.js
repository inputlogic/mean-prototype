var winston = require('winston');

module.exports = (function logger() {
	if(logger.instance == undefined) {
		logger.instance = new winston.Logger({
			level: app.config.logging.winston.level || 'info',
			transports: [
				new winston.transports.Console({
					colorize: true
				})
			]
		})
	}
	return logger.instance;
})();
