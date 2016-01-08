module.exports = {
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "password",
    database: "prototype"
  },
	logging:{
		morgan: 'dev',
		winston: {
			level: 'debug'
		}
	}
};
