const { createTransport } = require('nodemailer');
const {
  isDev,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USERNAME,
  SMTP_PASSWORD
} = require('../../config');
const { ses, limiter } = require('../../aws');
const { senderName, taigerNotReplyGmail } = require('../../constants/email');
const { htmlContent } = require('../emailTemplate');

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

const sendEmail = (to, subject, message) => {
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
