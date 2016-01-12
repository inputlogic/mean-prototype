module.exports = {
  middleware: ['passport'],
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
    winston: {
      level: 'warn'
    }
  }
};
