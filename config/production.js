module.exports = {
  db: {
    path: 'mongodb://',
    options: null
  },
	logging: {
		morgan: 'combined',
		winston: {
			level: process.env.LOG_LEVEL || 'warn'
		}
	}
};
