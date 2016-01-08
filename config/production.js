module.exports = {
	logging: {
		morgan: 'combined',
		winston: {
			level: process.env.LOG_LEVEL || 'warn'
		}
	}
};
