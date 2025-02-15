const { createTransport } = require('nodemailer');
const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USERNAME,
  SMTP_PASSWORD,
  isProd,
  isTest
} = require('../../config');
const { ses, limiter, SendRawEmailCommand } = require('../../aws');
const { senderName, taigerNotReplyGmail } = require('../../constants/email');
const { htmlContent } = require('../emailTemplate');

const transporter = isProd()
  ? createTransport({
      SES: { ses, aws: { SendRawEmailCommand } }
    })
  : createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false
      }
    });

const sendEmail = isTest()
  ? (to, subject, message) => {}
  : (to, subject, message) => {
      const mail = {
        from: senderName,
        to,
        bcc: taigerNotReplyGmail,
        subject,
        // text: message,
        html: htmlContent(message)
      };

      return limiter.schedule(() => transporter.sendMail(mail));
    };

module.exports = { transporter, sendEmail };
