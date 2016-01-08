module.exports = {
  db: {
    client: 'mysql2',
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "password",
      database: "prototype"
    }
  },
	logging:{
		morgan: 'dev'
	}
};
