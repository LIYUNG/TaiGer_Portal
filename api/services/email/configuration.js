const { createTransport } = require('nodemailer');
const {
  isDev,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USERNAME,
  SMTP_PASSWORD
} = require('../../config');
const { ses } = require('../../aws');

const transporter = isDev()
  ? createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    })
  : createTransport({
      SES: ses
    });

module.exports = { transporter };
