const { app } = require('./app');
const { connectToDatabase, disconnectFromDatabase } = require('./database');
const {
  PORT,
  HTTPS_KEY,
  HTTPS_CERT,
  HTTPS_CA,
  HTTPS_PORT,
  MONGODB_URI
} = require('./config');
const logger = require('./services/logger');

var https = require('https');
var fs = require('fs');

process.on('SIGINT', () => {
  disconnectFromDatabase(() => {
    logger.error('Database disconnected through app termination');
    process.exit(0);
  });
});

const launch = async () => {
  try {
    const conn = await connectToDatabase(MONGODB_URI, 5000);
    logger.info(`Database connected: ${conn.host}`);
  } catch (err) {
    logger.error('Failed to connect to database: ', err);
    process.exit(1);
  }
  // app.listen(PORT, () => {
  //    console.log(`Server running on port ${PORT}`);
  //  });
  // TODO: launch both http and https server?
  logger.info(`HTTPS_CA: ${HTTPS_CA}`);
  logger.info(`HTTPS_CERT: ${HTTPS_CERT}`);
  logger.info(`HTTPS_KEY: ${HTTPS_KEY}`);
  https
    .createServer(
      {
        key: fs.readFileSync(HTTPS_KEY, 'utf8'),
        cert: fs.readFileSync(HTTPS_CERT, 'utf8'),
        ca: fs.readFileSync(HTTPS_CA, 'utf8')
      },
      app
    )
    .listen(HTTPS_PORT, function () {
      logger.info(
        'Example app listening on port ' +
          HTTPS_PORT +
          ' ! Go to https://localhost:' +
          HTTPS_PORT +
          '/'
      );
    });
};

launch();
