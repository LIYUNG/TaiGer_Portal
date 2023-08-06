const aws = require('aws-sdk');
const {
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  isProd
} = require('../config');

const s3 = isProd()
  ? new aws.S3()
  : new aws.S3({
      accessKeyId: AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: AWS_S3_ACCESS_KEY
    });
const ses = isProd()
  ? new aws.SES({
      region: 'us-west-2'
    })
  : new aws.SES({
      region: 'us-west-2',
      accessKeyId: AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: AWS_S3_ACCESS_KEY
    });

module.exports = {
  s3,
  ses
};
