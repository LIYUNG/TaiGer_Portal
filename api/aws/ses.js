const { SES, SendRawEmailCommand } = require('@aws-sdk/client-ses');

const Bottleneck = require('bottleneck/es5');

const ses = new SES({
  region: 'us-west-2'
});

const limiter = new Bottleneck({
  minTime: 1100 / 14
});

module.exports = {
  ses,
  SendRawEmailCommand,
  limiter
};
