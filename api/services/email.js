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

const sendEditorOutputGeneralFilesEmailToStudent = async (recipient, msg) => {
  const subject = "New output from your Editor!";
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

your editor has uploaded ${msg.uploaded_documentname} 

for ${msg.fileCategory} on ${msg.uploaded_updatedAt}.

Please review it and confirm with your editor and finalize the document review.

`;

  return sendEmail(recipient, subject, message);
};

const sendUploadedProgramSpecificFilesEmail = async (recipient, msg) => {
  const subject = "Thank you for your input!";
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

you have uploaded ${msg.uploaded_documentname} 

for ${msg.university_name} - ${msg.program_name} on ${msg.uploaded_updatedAt}.

Your editor will review it and give you feedback as soon as possible.
`;

  return sendEmail(recipient, subject, message);
};

const sendEditorOutputProgramSpecificFilesEmailToStudent = async (
  recipient,
  msg
) => {
  const subject = `New revised ${msg.fileCategory} for ${msg.university_name} - ${msg.program_name} from Editor!`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

your editor has uploaded ${msg.uploaded_documentname} 

for ${msg.university_name} - ${msg.program_name} on ${msg.uploaded_updatedAt}.

Please review it and confirm with your editor and finalize the document review.
`;

  return sendEmail(recipient, subject, message);
};

const sendUploadedGeneralFilesEmail = async (recipient, msg) => {
  const subject = "Thank you for your input!";
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

has uploaded ${msg.uploaded_documentname} 

for ${msg.university_name} - ${msg.program_name} on ${msg.uploaded_updatedAt}.

Your editor will review it and give you feedback as soon as possible.
`;

  return sendEmail(recipient, subject, message);
};

const sendUploadedProfileFilesEmail = async (recipient, msg) => {
  const subject = `Your ${msg.uploaded_documentname} is successfully uploaded!`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

you have uploaded ${msg.uploaded_documentname} on ${msg.uploaded_updatedAt}.

Your agent will review it as soon as possible.
`;

  return sendEmail(recipient, subject, message);
};

const sendAgentUploadedProfileFilesForStudentEmail = async (recipient, msg) => {
  const subject = `Your ${msg.uploaded_documentname} is successfully uploaded!`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

your agent ${msg.agent_firstname} ${msg.agent_lastname} have uploaded ${msg.uploaded_documentname} on ${msg.uploaded_updatedAt} for you.

If you have any question, feel free to contact your agent.
`;

  return sendEmail(recipient, subject, message);
};

const sendUploadedFilesRemindForAgentEmail = async (recipient) => {
  const subject = "Uploaded Files";
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

your student ${msg.student_firstname} ${msg.student_lastname} has uploaded ${msg.uploaded_documentname} 

for ${msg.university_name} - ${msg.program_name} on ${msg.uploaded_updatedAt}.`; // should be for student/agent/editor

  return sendEmail(recipient, subject, message);
};

const sendUploadedProfileFilesRemindForAgentEmail = async (recipient, msg) => {
  const subject = `New ${msg.uploaded_documentname} uploaded from ${msg.student_firstname} ${msg.student_lastname}`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

your student ${msg.student_firstname} ${msg.student_lastname} has uploaded ${msg.uploaded_documentname}

on ${msg.uploaded_updatedAt}.`; // should be for student/agent/editor

  return sendEmail(recipient, subject, message);
};

const sendUploadedFilesRemindForEditorEmail = async (recipient, msg) => {
  const subject = `New ${msg.fileCategory} input from ${msg.student_firstname} ${msg.student_lastname}`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

your student ${msg.student_firstname} ${msg.student_lastname} has uploaded ${msg.uploaded_documentname} 

for ${msg.university_name} - ${msg.program_name} on ${msg.uploaded_updatedAt}.

Please the input from student and give student your feedback as soon as possible.
`; // should be for student/agent/editor

  return sendEmail(recipient, subject, message);
};

const sendUploadedGeneralFilesRemindForEditorEmail = async (recipient, msg) => {
  const subject = `New ${msg.fileCategory} input from  ${msg.student_firstname} ${msg.student_lastname}`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

your student ${msg.student_firstname} ${msg.student_lastname} has uploaded ${msg.uploaded_documentname} 

for ${msg.fileCategory} on ${msg.uploaded_updatedAt}.`; // should be for student/agent/editor

  return sendEmail(recipient, subject, message);
};

const sendChangedProfileFileStatusEmail = async (recipient, msg) => {
  var subject;
  var message;
  if (msg.status === "rejected") {
    subject = `File Status changes: please upload ${msg.category} again`;
    message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

due to the following reason, please upload ${msg.category} again:

${msg.message}

If you have any question, please contact your agent. 
`; // should be for student
  } else {
    subject = `File Status changes: ${msg.category} is valid`;
    message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

your uploaded file ${msg.category} is successfully checked by your agent

and it can be used for the application! `; // should be for student
  }

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
  sendEditorOutputGeneralFilesEmailToStudent,
  sendUploadedProgramSpecificFilesEmail,
  sendEditorOutputProgramSpecificFilesEmailToStudent,
  sendUploadedGeneralFilesEmail,
  sendUploadedProfileFilesEmail,
  sendAgentUploadedProfileFilesForStudentEmail,
  sendUploadedFilesRemindForAgentEmail,
  sendUploadedProfileFilesRemindForAgentEmail,
  sendUploadedFilesRemindForEditorEmail,
  sendUploadedGeneralFilesRemindForEditorEmail,
  sendChangedProfileFileStatusEmail,
  sendChangedFileStatusForAgentEmail,
  sendSomeReminderEmail,
};
