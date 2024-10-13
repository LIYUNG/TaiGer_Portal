const { STSClient, AssumeRoleCommand } = require('@aws-sdk/client-sts');

const logger = require('../services/logger');
const {
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  AWS_REGION,
  isProd
} = require('../config');

// AWS configuration
const roleToAssume = isProd()
  ? 'arn:aws:iam::669131042313:role/Prod-NA-LambdaStack-AuthorizedClientRoleProdNA32E8E-C6jpOkI8QTls'
  : 'arn:aws:iam::669131042313:role/Beta-FE-LambdaStack-AuthorizedClientRoleBetaFE1B184-7cxjOdtI3pLE'; // Replace with your role ARN

const stsClient = isProd()
  ? new STSClient({
      region: AWS_REGION
    })
  : new STSClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: AWS_S3_ACCESS_KEY
      }
    });

const getTemporaryCredentials = async () => {
  try {
    // Returns a set of temporary security credentials that you can use to
    // access Amazon Web Services resources that you might not normally
    // have access to.
    const command = new AssumeRoleCommand({
      // The Amazon Resource Name (ARN) of the role to assume.
      RoleArn: roleToAssume,
      // An identifier for the assumed role session.
      RoleSessionName: 'session2',
      // The duration, in seconds, of the role session. The value specified
      // can range from 900 seconds (15 minutes) up to the maximum session
      // duration set for the role.
      DurationSeconds: 900
    });
    const response = await stsClient.send(command);
    logger.info(response);
    return response;
  } catch (err) {
    logger.error(err);
  }
};

module.exports = {
  getTemporaryCredentials
};
