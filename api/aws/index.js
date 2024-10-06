const aws = require('aws-sdk');
const Bottleneck = require('bottleneck/es5');
const https = require('https');

const {
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_ACCESS_KEY,
  isProd,
  isTest
} = require('../config');
const logger = require('../services/logger');

// AWS configuration
const region = 'us-east-1'; // Replace with your AWS region
const roleToAssume = 'arn:aws:iam::669131042313:role/AuthorizedClientRole'; // Replace with your role ARN
const apiGatewayUrl =
  'https://lr2g2exm26.execute-api.us-east-1.amazonaws.com/prod/analyze'; // Replace with your API Gateway URL

const s3 = isProd()
  ? new aws.S3()
  : isTest()
  ? new aws.S3({
      accessKeyId: AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: AWS_S3_ACCESS_KEY
    })
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

const limiter = new Bottleneck({
  minTime: 1100 / 14
});

const sts = new aws.STS();

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
  return new Promise((resolve, reject) => {
    const endpoint = new aws.Endpoint(apiGatewayUrl);
    const request = new aws.HttpRequest(endpoint, region);

    request.method = 'GET';
    request.path = endpoint.pathname;
    request.headers['Host'] = endpoint.host;

    const signer = new aws.Signers.V4(request, 'execute-api');
    signer.addAuthorization(credentials, new Date());

    const client = new https.Agent();
    const req = https.request(
      {
        ...request,
        host: endpoint.host,
        agent: client
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP Status Code ${res.statusCode}: ${body}`));
          } else {
            resolve(JSON.parse(body));
          }
        });
      }
    );

    req.on('error', (error) => {
      logger.error('Error calling API Gateway:', error);
      reject(error);
    });

    req.end();
  });
}

module.exports = {
  s3,
  ses,
  limiter,
  getTemporaryCredentials,
  callApiGateway
};
