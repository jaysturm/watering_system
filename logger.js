var logger = require('winston');

logger.configure({
    transports: [
      new (logger.transports.Console)(),
      new (logger.transports.File)({ filename: './wonka_api.log' })
    ]
  }
);

module.exports = logger;