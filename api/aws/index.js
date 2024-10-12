const axios = require('axios');
const { Sha256 } = require('@aws-crypto/sha256-browser');

const logger = require('../services/logger');
const { SignatureV4 } = require('@aws-sdk/signature-v4');
const { ses, limiter, SendRawEmailCommand } = require('./ses');
const { s3Client } = require('./s3');

// AWS configuration
const region = 'us-east-1'; // Replace with your AWS region
const roleToAssume = 'arn:aws:iam::669131042313:role/AuthorizedClientRole'; // Replace with your role ARN
const apiGatewayUrl =
  'https://lr2g2exm26.execute-api.us-east-1.amazonaws.com/prod/analyze'; // Replace with your API Gateway URL

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
  s3Client,
  ses,
  SendRawEmailCommand,
  limiter,
  callApiGateway
};
