const aws = require('aws-sdk');
const {
  S3Client,
  NoSuchKey,
  S3ServiceException,
  GetObjectCommand
} = require('@aws-sdk/client-s3');

const {
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  isProd
} = require('../config');
const logger = require('../services/logger');

const s3 = isProd()
  ? new aws.S3({})
  : new aws.S3({
      credentials: {
        accessKeyId: AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: AWS_S3_ACCESS_KEY
      }
    });

const s3Client = isProd()
  ? new S3Client({ region: 'us-west-2' })
  : new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: AWS_S3_ACCESS_KEY
      }
    });

const getS3Object = async (bucketName, objectKey) => {
  try {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucketName,
        Key: objectKey
      })
    );
    const str = await response.Body.transformToByteArray();
    return str;
  } catch (caught) {
    if (caught instanceof NoSuchKey) {
      logger.error(
        `Error from S3 while getting object "${objectKey}" from "${bucketName}". No such key exists.`
      );
    } else if (caught instanceof S3ServiceException) {
      logger.error(
        `Error from S3 while getting object from ${bucketName}.  ${caught.name}: ${caught.message}`
      );
    } else {
      throw caught;
    }
  }
};

module.exports = {
  s3,
  s3Client,
  getS3Object
};
