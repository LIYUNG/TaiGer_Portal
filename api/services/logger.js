const winston = require('winston');
const WinstonCloudWatch = require('winston-cloudwatch');
const {
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  isProd,
  AWS_REGION,
  AWS_LOG_GROUP
} = require('../config');

const options = {
  file: {
    level: 'info',
    filename: './logs/app.log',
    handleExceptions: true,
    format: winston.format.json(),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }
};

const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Adding 1 as months are zero-based
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const logger = isProd()
  ? winston.createLogger({
      transports: [
        new WinstonCloudWatch({
          logGroupName: AWS_LOG_GROUP,
          logStreamName: `api-log-${`backend-log-dev-${getCurrentDate()}`}`,
          awsRegion: AWS_REGION,
          awsAccessKeyId: AWS_S3_ACCESS_KEY_ID,
          awsSecretKey: AWS_S3_ACCESS_KEY
        })
      ]
    })
  : winston.createLogger({
      levels: winston.config.npm.levels,
      transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
      ],
      exitOnError: false
    });

module.exports = logger;
