const {
  S3Client,
  NoSuchKey,
  S3ServiceException,
  GetObjectCommand,
  DeleteObjectCommand,
  waitUntilObjectNotExists,
  DeleteObjectsCommand,
  paginateListObjectsV2,
  PutObjectCommand
} = require('@aws-sdk/client-s3');

const {
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  isProd,
  AWS_REGION
} = require('../config');
const logger = require('../services/logger');

const s3Client = isProd()
  ? new S3Client({ region: AWS_REGION })
  : new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: AWS_S3_ACCESS_KEY
      }
    });

const putS3Object = async ({ bucketName, key, Body, ContentType }) => {
  const client = new S3Client({});
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body,
    ContentType
  });

  try {
    const response = await client.send(command);
    logger.log(response);
  } catch (caught) {
    if (
      caught instanceof S3ServiceException &&
      caught.name === 'EntityTooLarge'
    ) {
      logger.error(
        `Error from S3 while uploading object to ${bucketName}. \
The object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) \
or the multipart upload API (5TB max).`
      );
    } else if (caught instanceof S3ServiceException) {
      logger.error(
        `Error from S3 while uploading object to ${bucketName}.  ${caught.name}: ${caught.message}`
      );
    } else {
      throw caught;
    }
  }
};
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

const deleteS3Object = async (bucketName, objectKey) => {
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: objectKey
      })
    );
    await waitUntilObjectNotExists(
      { client: s3Client },
      { Bucket: bucketName, Key: objectKey }
    );
    // A successful delete, or a delete for a non-existent object, both return
    // a 204 response code.
    logger.info(
      `The object "${objectKey}" from bucket "${bucketName}" was deleted, or it didn't exist.`
    );
  } catch (caught) {
    if (
      caught instanceof S3ServiceException &&
      caught.name === 'NoSuchBucket'
    ) {
      logger.error(
        `Error from S3 while deleting object from ${bucketName}. The bucket doesn't exist.`
      );
    } else if (caught instanceof S3ServiceException) {
      logger.error(
        `Error from S3 while deleting object from ${bucketName}.  ${caught.name}: ${caught.message}`
      );
    } else {
      throw caught;
    }
  }
};

const deleteS3Objects = async ({ bucketName, objectKeys }) => {
  try {
    const { Deleted } = await s3Client.send(
      new DeleteObjectsCommand({
        Bucket: bucketName,
        Delete: {
          Objects: objectKeys.map((objectKey) => ({ Key: objectKey }))
        }
      })
    );
    await Promise.all(
      objectKeys.map((objectKey) =>
        waitUntilObjectNotExists(
          { client: s3Client },
          { Bucket: bucketName, Key: objectKey }
        )
      )
    );

    logger.info(
      `Successfully deleted ${Deleted.length} objects from S3 bucket. Deleted objects:`
    );
    logger.info(Deleted.map((d) => ` • ${d.Key}`).join('\n'));
  } catch (caught) {
    if (
      caught instanceof S3ServiceException &&
      caught.name === 'NoSuchBucket'
    ) {
      logger.error(
        `Error from S3 while deleting objects from ${bucketName}. The bucket doesn't exist.`
      );
    } else if (caught instanceof S3ServiceException) {
      logger.error(
        `Error from S3 while deleting objects from ${bucketName}.  ${caught.name}: ${caught.message}`
      );
    } else {
      throw caught;
    }
  }
};

const listS3ObjectsV2 = async ({ bucketName, Delimiter, pageSize, Prefix }) => {
  try {
    const objects = [];
    const paginator = paginateListObjectsV2(
      {
        client: s3Client,
        /* Max items per page */ pageSize: parseInt(pageSize, 10)
      },
      { Bucket: bucketName }
    );

    for await (const page of paginator) {
      objects.push(page.Contents.map((o) => o.Key));
    }
    objects.forEach((objectList, pageNum) => {
      logger.info(
        `Page ${pageNum + 1}\n------\n${objectList
          .map((o) => `• ${o}`)
          .join('\n')}\n`
      );
    });
  } catch (caught) {
    if (
      caught instanceof S3ServiceException &&
      caught.name === 'NoSuchBucket'
    ) {
      logger.error(
        `Error from S3 while deleting objects from ${bucketName}. The bucket doesn't exist.`
      );
    } else if (caught instanceof S3ServiceException) {
      logger.error(
        `Error from S3 while deleting objects from ${bucketName}.  ${caught.name}: ${caught.message}`
      );
    } else {
      throw caught;
    }
  }
};

module.exports = {
  s3Client,
  putS3Object,
  getS3Object,
  deleteS3Object,
  deleteS3Objects,
  listS3ObjectsV2
};
