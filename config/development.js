module.exports = {
  db: {
    path: 'mongodb://localhost:27017/prototype',
    options: null
  },
	logging:{
		morgan: 'dev',
		winston: {
			level: 'debug'
		}
	}
};
