module.exports = {
  db: {
    client: 'mysql2',
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "password",
      database: "prototype"
    },
    debug: false
  },
	logging:{
		morgan: 'dev',
		winston: {
			level: 'debug'
		}
	}
};
