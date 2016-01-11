var winston = require('winston');

/**
 * This is attached to the app global at app.log. Use that instead.
 *
 * Ex: app.log.info('foo');
 */
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
