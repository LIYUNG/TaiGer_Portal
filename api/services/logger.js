const winston = require('winston');
const WinstonCloudWatch = require('winston-cloudwatch');
const {
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  isProd,
  AWS_REGION
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

const logger = isProd()
  ? winston.createLogger({
      transports: [
        new WinstonCloudWatch({
          logGroupName: 'taiger-portal-dev',
          logStreamName: 'backend-log-dev',
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
