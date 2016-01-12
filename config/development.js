module.exports = {
  db: {
    client: 'mysql2',
    connection: {
      host: "127.0.0.1",
      user: "express",
      password: "express",
      database: "prototype"
    },
    debug: true
  },
	logging:{
		morgan: 'dev',
		winston: {
			level: 'debug'
		}
	}
};
