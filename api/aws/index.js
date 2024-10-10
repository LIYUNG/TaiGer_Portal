const axios = require('axios');
const { SES } = require('@aws-sdk/client-ses');
const { STS } = require('@aws-sdk/client-sts');
const { Sha256 } = require('@aws-crypto/sha256-browser');

const Bottleneck = require('bottleneck/es5');

const {
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  isProd,
  isTest
} = require('../config');
const logger = require('../services/logger');
const { SignatureV4 } = require('@aws-sdk/signature-v4');

// AWS configuration
const region = 'us-east-1'; // Replace with your AWS region
const roleToAssume = 'arn:aws:iam::669131042313:role/AuthorizedClientRole'; // Replace with your role ARN
const apiGatewayUrl =
  'https://lr2g2exm26.execute-api.us-east-1.amazonaws.com/prod/analyze'; // Replace with your API Gateway URL

const ses = isProd()
  ? new SES({
      region: 'us-west-2'
    })
  : new SES({
      region: 'us-west-2',

      credentials: {
        accessKeyId: AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: AWS_S3_ACCESS_KEY
      }
    });

const limiter = new Bottleneck({
  minTime: 1100 / 14
});

const sts = new STS();

async function getTemporaryCredentials() {
  return new Promise((resolve, reject) => {
    const params = {
      RoleArn: roleToAssume,
      RoleSessionName: 'AssumeRoleSession',
      DurationSeconds: 900 // 15 minutes
    };

    sts.assumeRole(params, (err, data) => {
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

async function callApiGateway(credentials) {
  const signer = new SignatureV4({
    credentials,
    region,
    service: 'execute-api',
    sha256: Sha256
  });

  const url = new URL(apiGatewayUrl);
  const signedRequest = await signer.sign({
    method: 'GET',
    hostname: url.hostname,
    path: url.pathname,
    protocol: url.protocol,
    headers: {
      host: url.hostname
    }
  });

  try {
    const response = await axios({
      ...signedRequest,
      url: apiGatewayUrl,
      method: signedRequest.method,
      headers: signedRequest.headers,
      data: signedRequest.body
    });

    return response.data;
  } catch (error) {
    logger.error('Error calling API Gateway:', error);
    throw error;
  }
}

module.exports = {
  ses,
  limiter,
  getTemporaryCredentials,
  callApiGateway
};
