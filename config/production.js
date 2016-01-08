module.exports = {
  db: {
    client: 'mysql2',
    connection: {
      host: null,
      user: null,
      password: null,
      database: null
    },
    debug: true
  },
	logging: {
		morgan: 'combined',
		winston: {
			level: process.env.LOG_LEVEL || 'warn'
		}
	}
};
