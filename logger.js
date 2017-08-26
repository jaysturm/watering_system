var logger = require('winston');

logger.configure({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: './wonka_api.log' })
    ]
  }
);

module.exports = logger;