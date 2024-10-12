const axios = require('axios');
const { Sha256 } = require('@aws-crypto/sha256-browser');
const { SignatureV4 } = require('@aws-sdk/signature-v4');

const logger = require('../services/logger');
const { ses, limiter, SendRawEmailCommand } = require('./ses');
const { s3Client } = require('./s3');
const { getTemporaryCredentials } = require('./sts');

// AWS configuration
const region = 'us-east-1'; // Replace with your AWS region
const apiGatewayUrl =
  'https://lr2g2exm26.execute-api.us-east-1.amazonaws.com/prod/analyze'; // Replace with your API Gateway URL

const callApiGateway = async (credentials) => {
  try {
    const signer = new SignatureV4({
      credentials: {
        accessKeyId: credentials.AccessKeyId,
        secretAccessKey: credentials.SecretAccessKey,
        sessionToken: credentials.SessionToken
      },
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
};

module.exports = {
  s3Client,
  ses,
  SendRawEmailCommand,
  limiter,
  getTemporaryCredentials,
  callApiGateway
};
