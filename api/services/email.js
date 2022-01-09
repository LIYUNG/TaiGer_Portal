const path = require("path");
const { createTransport } = require("nodemailer");
const queryString = require("query-string");

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USERNAME,
  SMTP_PASSWORD,
  BASE_URL,
} = require("../config");

const ACCOUNT_ACTIVATION_URL = path.join(BASE_URL, "account/activation");
const RESEND_ACTIVATION_URL = path.join(BASE_URL, "account/resend-activation");
const PASSWORD_RESET_URL = path.join(BASE_URL, "account/reset-password");
const FORGOT_PASSWORD_URL = path.join(BASE_URL, "account/forgot-password");

const transporter = createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
});

const verifySMTPConfig = () => {
  return transporter.verify();
};

const sendEmail = (to, subject, message) => {
  const mail = {
    from: SMTP_USERNAME,
    to,
    subject,
    text: message,
  };
  return transporter.sendMail(mail);
};

const sendConfirmationEmail = async (recipient, token) => {
  const subject = "Email verification";
  const activationLink = queryString.stringifyUrl({
    url: ACCOUNT_ACTIVATION_URL,
    query: { email: recipient.address, token },
  });
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname},

Your user account has been created.
Please use the following link to activate your account:

${activationLink}

This link will expire in 20 minutes.
You can request another here: ${RESEND_ACTIVATION_URL}`;

  return sendEmail(recipient, subject, message);
};

const sendForgotPasswordEmail = async (recipient, token) => {
  const subject = "Password reset instructions";
  const passwordResetLink = queryString.stringifyUrl({
    url: PASSWORD_RESET_URL,
    query: { email: recipient.address, token },
  });
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname},

Please use the link below to reset your password:

${passwordResetLink}

This link will expire in 20 minutes.
You can request another here: ${FORGOT_PASSWORD_URL}`;

  return sendEmail(recipient, subject, message);
};

const sendPasswordResetEmail = async (recipient) => {
  const subject = "Password reset successfully";
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname},

Your password has been successfully updated, you can now login with your new password.`;

  return sendEmail(recipient, subject, message);
};

const sendUploadedFilesEmail = async (recipient) => {
  const subject = "Uploaded Files";
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

A file is uploaded.`; // should be for student/agent/editor

  return sendEmail(recipient, subject, message);
};

const sendUploadedFilesRemindForAgentEmail = async (recipient) => {
  const subject = "Uploaded Files";
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

A file is uploaded.`; // should be for student/agent/editor

  return sendEmail(recipient, subject, message);
};

const sendChangedFileStatusEmail = async (recipient) => {
  const subject = "File Status changes";
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

a file status has changed.`; // should be for student

  return sendEmail(recipient, subject, message);
};

const sendChangedFileStatusForAgentEmail = async (recipient) => {
  const subject = "File Status changes";
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

a file status has changed.`; // should be for student

  return sendEmail(recipient, subject, message);
};

const sendSomeReminderEmail = async (recipient) => {
  const subject = "File Status changes";
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

Some reminder email template.`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

module.exports = {
  verifySMTPConfig,
  sendEmail,
  sendConfirmationEmail,
  sendForgotPasswordEmail,
  sendPasswordResetEmail,
  sendUploadedFilesEmail,
  sendUploadedFilesRemindForAgentEmail,
  sendChangedFileStatusEmail,
  sendChangedFileStatusForAgentEmail,
  sendSomeReminderEmail,
};
