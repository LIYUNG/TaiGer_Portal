const morgan = require('morgan');
const logger = require('./logger');

const httpLogger = morgan((tokens, req, res) => {
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const status = tokens.status(req, res);
  const contentLength = tokens.res(req, res, 'content-length');
  const responseTime = tokens['response-time'](req, res);

  logger.info('HTTP Access Log', {
    timestamp: new Date().toString(),
    method,
    url,
    status: Number(status),
    contentLength,
    responseTime: Number(responseTime)
  });
});


module.exports = httpLogger;
