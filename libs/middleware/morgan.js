var morgan = require('morgan');
var config = require('../../config');

module.exports = morgan(config.logging.morgan);
