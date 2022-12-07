const schedule = require('node-schedule');
const https = require('https');
const fs = require('fs');
const { app } = require('./app');
const { connectToDatabase, disconnectFromDatabase } = require('./database');
const {
  PORT,
  HTTPS_KEY,
  HTTPS_CERT,
  HTTPS_CA,
  HTTPS_PORT,
  CLEAN_UP_SCHEDULE,
  MONGODB_URI
} = require('./config');
const logger = require('./services/logger');
const {
  DocumentationS3GarbageCollector
} = require('./controllers/documentations');
const {
  ThreadS3GarbageCollector
} = require('./controllers/documents_modification');

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
  // setInterval(foo, 1000 * 100);

  //   *    *    *    *    *    *
  //   ┬    ┬    ┬    ┬    ┬    ┬
  //   │    │    │    │    │    │
  //   │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
  //   │    │    │    │    └───── month (1 - 12)
  //   │    │    │    └────────── day of month (1 - 31)
  //   │    │    └─────────────── hour (0 - 23)
  //   │    └──────────────────── minute (0 - 59)
  //   └───────────────────────── second (0 - 59, OPTIONAL)
  //  ex:  '42 * * * *',: Execute a cron job when the minute is 42 (e.g. 19:42, 20:42, etc.).

  // every 1. of month clean up the documents screenshots, redundant attachment.
  logger.info(CLEAN_UP_SCHEDULE);
  const job = schedule.scheduleJob(
    CLEAN_UP_SCHEDULE,
    DocumentationS3GarbageCollector
  );

  // every 1. of month clean up the redundant screenshots,for thg thread.
  const job2 = schedule.scheduleJob(CLEAN_UP_SCHEDULE, ThreadS3GarbageCollector);

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
