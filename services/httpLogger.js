const morgan = require('morgan');
const logger = require('./logger');

const httpLogger = morgan((tokens, req, res) => {
  const logData = {
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    contentLength: tokens.res(req, res, 'content-length'),
    headers: req.headers,
    ipAddress: req.ip,
    body: req.body,
    responseTime: tokens['response-time'](req, res)
    // Additional context as needed
  };
  logger.log('info', `${JSON.stringify(logData)}`);
});

module.exports = httpLogger;
