const axios = require('axios');
const { STSClient } = require('@aws-sdk/client-sts');
const { Sha256 } = require('@aws-crypto/sha256-browser');

const logger = require('../services/logger');
const { SignatureV4 } = require('@aws-sdk/signature-v4');

// AWS configuration
const region = 'us-east-1'; // Replace with your AWS region
const roleToAssume = 'arn:aws:iam::669131042313:role/AuthorizedClientRole'; // Replace with your role ARN
const apiGatewayUrl =
  'https://lr2g2exm26.execute-api.us-east-1.amazonaws.com/prod/analyze'; // Replace with your API Gateway URL

const stsClient = new STSClient({ region: 'us-west-2' });

async function getTemporaryCredentials() {
  return new Promise((resolve, reject) => {
    const params = {
      RoleArn: roleToAssume,
      RoleSessionName: 'AssumeRoleSession',
      DurationSeconds: 900 // 15 minutes
    };

    stsClient.assumeRole(params, (err, data) => {
      if (err) {
        logger.error('Error assuming role:', err);
        reject(err);
      } else {
        resolve({
          accessKeyId: data.Credentials.AccessKeyId,
          secretAccessKey: data.Credentials.SecretAccessKey,
          sessionToken: data.Credentials.SessionToken
        });
      }
    });
  });
}

module.exports = {
  getTemporaryCredentials
};
