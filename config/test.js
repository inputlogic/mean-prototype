module.exports = {
  middleware: ['passport'],
  db: {
    path: 'mongodb://localhost:27017/prototype',
    options: null
  },
  logging:{
    winston: {
      level: 'warn'
    }
  }
};
