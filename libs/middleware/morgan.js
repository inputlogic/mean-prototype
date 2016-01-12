var morgan = require('morgan');

module.exports = morgan(app.config.logging.morgan);
