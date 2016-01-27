module.exports = {
  middleware: ['passport'],
  db: 'mongodb://localhost:27017/prototype-test',
  logging:{
    winston: {
      level: 'warn'
    }
  }
};
