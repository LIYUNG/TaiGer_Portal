const path = require("path");
const { createTransport } = require("nodemailer");
const queryString = require("query-string");

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USERNAME,
  SMTP_PASSWORD,
  BASE_URL,
  ORIGIN,
} = require("../config");

const ACCOUNT_ACTIVATION_URL = path.join(ORIGIN, "account/activation");
const RESEND_ACTIVATION_URL = path.join(ORIGIN, "account/resend-activation");
const PASSWORD_RESET_URL = path.join(ORIGIN, "account/reset-password");
const FORGOT_PASSWORD_URL = path.join(ORIGIN, "account/forgot-password");

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

const sendEditorOutputGeneralFilesEmailToAgent = async (recipient, msg) => {
  const subject = `New output from your Editor for ${msg.student_firstname} ${msg.student_lastname} !`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

your editor ${msg.editor_firstname} ${msg.editor_lastname}  has uploaded ${msg.uploaded_documentname} for ${msg.student_firstname} ${msg.student_lastname} 

for ${msg.fileCategory} on ${msg.uploaded_updatedAt}.

Please double check. If something goes wrong, please talk to editor as soon as possible.

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

const sendUploadedGeneralFilesRemindForStudentEmail = async (
  recipient,
  msg
) => {
  const subject = "Thank you for your input!";
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

you have uploaded ${msg.uploaded_documentname} 

on ${msg.uploaded_updatedAt}.

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

your editor ${msg.editor_firstname} - ${msg.editor_lastname} has uploaded ${msg.uploaded_documentname} 

for ${msg.university_name} - ${msg.program_name} on ${msg.uploaded_updatedAt}.

Please review it and confirm with your editor and finalize the document review.
`;

  return sendEmail(recipient, subject, message);
};

const sendEditorOutputProgramSpecificFilesEmailToAgent = async (
  recipient,
  msg
) => {
  const subject = `New revised ${msg.fileCategory} for ${msg.university_name} - ${msg.program_name} from Editor for ${msg.student_firstname} - ${msg.student_lastname}!`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

your editor ${msg.editor_firstname} - ${msg.editor_lastname} has uploaded ${msg.uploaded_documentname} 

for student ${msg.student_firstname} - ${msg.student_lastname}

for ${msg.university_name} - ${msg.program_name} on ${msg.uploaded_updatedAt}.

Please double check it and see if something goes wrong.
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

const sendUploadedProgramSpecificFilesRemindForEditorEmail = async (
  recipient,
  msg
) => {
  const subject = `New ${msg.fileCategory} input from ${msg.student_firstname} ${msg.student_lastname}`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

your student ${msg.student_firstname} ${msg.student_lastname} has uploaded ${msg.uploaded_documentname} 

for ${msg.university_name} - ${msg.program_name} on ${msg.uploaded_updatedAt}.

Please the input from student and give student your feedback as soon as possible.
`; // should be for student/agent/editor

  return sendEmail(recipient, subject, message);
};

const sendUploadedProgramSpecificFilesRemindForAgentEmail = async (
  recipient,
  msg
) => {
  const subject = `New ${msg.fileCategory} input from ${msg.student_firstname} ${msg.student_lastname}`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

your student ${msg.student_firstname} ${msg.student_lastname} has uploaded ${msg.uploaded_documentname} 

for ${msg.university_name} - ${msg.program_name} on ${msg.uploaded_updatedAt}.

Please double check it. If there is anything wrong, please contact student as soon as possible.
`; // should be for student/agent/editor

  return sendEmail(recipient, subject, message);
};

const sendUploadedGeneralFilesRemindForEditorEmail = async (recipient, msg) => {
  const subject = `New ${msg.fileCategory} input from  ${msg.student_firstname} ${msg.student_lastname}`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

your student ${msg.student_firstname} ${msg.student_lastname} has uploaded ${msg.uploaded_documentname} 

for ${msg.fileCategory} on ${msg.uploaded_updatedAt}.

Please give your student feedback as soon as possible.
`; // should be for student/agent/editor

  return sendEmail(recipient, subject, message);
};

const sendUploadedGeneralFilesRemindForAgentEmail = async (recipient, msg) => {
  const subject = `New ${msg.fileCategory} input from  ${msg.student_firstname} ${msg.student_lastname}`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

your student ${msg.student_firstname} ${msg.student_lastname} has uploaded ${msg.uploaded_documentname} 

for ${msg.fileCategory} on ${msg.uploaded_updatedAt}.

`; // should be for student/agent/editor

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

const informAgentNewStudentEmail = async (recipient, msg) => {
  const subject = `New student ${msg.std_firstname} ${msg.std_lastname} assigned to you`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.std_firstname} ${msg.std_lastname} will be your student!

Please say hello to your student!`;

  return sendEmail(recipient, subject, message);
};

const informStudentTheirAgentEmail = async (recipient, msg) => {
  const subject = "Your Agent";
  var agent;
  for (let i = 0; i < msg.agents.length; i++) {
    if (i === 0) {
      agent = msg.agents[i].firstname + " " + msg.agents[i].lastname;
    } else {
      agent += ", " + msg.agents[i].firstname + " " + msg.agents[i].lastname;
    }
  }
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${agent} will be your agent!

`;

  return sendEmail(recipient, subject, message);
};

const informEditorNewStudentEmail = async (recipient, msg) => {
  const subject = `New student ${msg.std_firstname} ${msg.std_lastname} assigned to you`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.std_firstname} ${msg.std_lastname} will be your student!

Please say hello to your student!`;

  return sendEmail(recipient, subject, message);
};

const informStudentTheirEditorEmail = async (recipient, msg) => {
  const subject = "Your Editor";
  var editor;
  for (let i = 0; i < msg.editors.length; i++) {
    if (i === 0) {
      editor = msg.editors[i].firstname + " " + msg.editors[i].lastname;
    } else {
      editor += ", " + msg.editors[i].firstname + " " + msg.editors[i].lastname;
    }
  }
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${editor} will be your editor!

`;

  return sendEmail(recipient, subject, message);
};

const sendSomeReminderEmail = async (recipient) => {
  const subject = "File Status changes";
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

Some reminder email template.`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const sendSetAsFinalProgramSpecificFileForStudentEmail = async (
  recipient,
  msg
) => {
  const subject = `Your docunebt ${msg.uploaded_documentname} is finished!`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

your editor ${msg.editor_firstname} ${msg.editor_lastname} have finalized

${msg.uploaded_documentname} on ${msg.uploaded_updatedAt} 

for you.

This document is ready for the application. 

If you have any question, feel free to contact your editor.
`;

  return sendEmail(recipient, subject, message);
};

const sendSetAsFinalProgramSpecificFileForAgentEmail = async (
  recipient,
  msg
) => {
  const subject = `${msg.uploaded_documentname} of ${msg.student_firstname} ${msg.student_lastname} is finished!`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.editor_firstname} ${msg.editor_lastname} have finalized

${msg.uploaded_documentname} on ${msg.uploaded_updatedAt} 

for ${msg.student_firstname} ${msg.student_lastname}.

Double check this document and finalize the application if applicable. 

`;

  return sendEmail(recipient, subject, message);
};

const sendCommentsGeneralFileForEditorEmail = async (recipient, msg) => {
  const subject = `There is a new feedback for ${msg.feedback_for_documentname} by ${msg.student_firstname} ${msg.student_lastname}!`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

Your student ${msg.student_firstname} ${msg.student_lastname} has updated a feedback for

 ${msg.feedback_for_documentname}:

on ${msg.uploaded_updatedAt} 

Double check this document and finalize the application if applicable. 

`;

  return sendEmail(recipient, subject, message);
};

const sendCommentsGeneralFileForStudentEmail = async (recipient, msg) => {
  const subject = `There is a new feedback for ${msg.feedback_for_documentname} by ${msg.editor_firstname} ${msg.editor_lastname}!`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

Your editor ${msg.editor_firstname} ${msg.editor_lastname} has updated a feedback for

 ${msg.feedback_for_documentname}:

on ${msg.uploaded_updatedAt} 

Please reply to your editor as soon as possible!

`;

  return sendEmail(recipient, subject, message);
};

const sendCommentsProgramSpecificFileForEditorEmail = async (
  recipient,
  msg
) => {
  const subject = `There is a new feedback for ${msg.feedback_for_documentname} by ${msg.student_firstname} ${msg.student_lastname}!`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

Your student ${msg.student_firstname} ${msg.student_lastname} has updated a feedback for

 ${msg.feedback_for_documentname}:

on ${msg.uploaded_updatedAt} 

Double check this document and finalize the application if applicable. 

`;

  return sendEmail(recipient, subject, message);
};

const sendCommentsProgramSpecificFileForStudentEmail = async (
  recipient,
  msg
) => {
  const subject = `There is a new feedback for ${msg.feedback_for_documentname} by ${msg.editor_firstname} ${msg.editor_lastname}!`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

Your editor ${msg.editor_firstname} ${msg.editor_lastname} has updated a feedback for

 ${msg.feedback_for_documentname}:

on ${msg.uploaded_updatedAt} 

Please reply to your editor as soon as possible.

`;

  return sendEmail(recipient, subject, message);
};

const sendStudentFeedbackGeneralFileForEditorEmail = async (recipient, msg) => {
  const subject = `There is a new feedback for ${msg.feedback_for_documentname} by ${msg.student_firstname} ${msg.student_lastname}!`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

Your student ${msg.student_firstname} ${msg.student_lastname} has updated a feedback for

 ${msg.feedback_for_documentname}:

on ${msg.uploaded_updatedAt} 

Double check this document and finalize the application if applicable. 

`;

  return sendEmail(recipient, subject, message);
};

const sendStudentFeedbackProgramSpecificFileForEditorEmail = async (
  recipient,
  msg
) => {
  const subject = `There is a new feedback for ${msg.feedback_for_documentname} by ${msg.student_firstname} ${msg.student_lastname}!`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

Your student ${msg.student_firstname} ${msg.student_lastname} has updated a feedback for

 ${msg.feedback_for_documentname}:

on ${msg.uploaded_updatedAt} 

Double check this document and finalize the application if applicable. 

`;

  return sendEmail(recipient, subject, message);
};

module.exports = {
  verifySMTPConfig,
  sendEmail,
  sendConfirmationEmail,
  sendForgotPasswordEmail,
  sendPasswordResetEmail,
  sendEditorOutputGeneralFilesEmailToStudent,
  sendEditorOutputGeneralFilesEmailToAgent,
  sendUploadedProgramSpecificFilesEmail,
  sendUploadedGeneralFilesRemindForStudentEmail,
  sendEditorOutputProgramSpecificFilesEmailToStudent,
  sendEditorOutputProgramSpecificFilesEmailToAgent,
  sendUploadedGeneralFilesEmail,
  sendUploadedProfileFilesEmail,
  sendAgentUploadedProfileFilesForStudentEmail,
  sendUploadedFilesRemindForAgentEmail,
  sendUploadedProfileFilesRemindForAgentEmail,
  sendUploadedProgramSpecificFilesRemindForEditorEmail,
  sendUploadedProgramSpecificFilesRemindForAgentEmail,
  sendUploadedGeneralFilesRemindForEditorEmail,
  sendUploadedGeneralFilesRemindForAgentEmail,
  sendChangedProfileFileStatusEmail,
  sendChangedFileStatusForAgentEmail,
  sendSomeReminderEmail,
  informAgentNewStudentEmail,
  informStudentTheirAgentEmail,
  sendSetAsFinalProgramSpecificFileForStudentEmail,
  sendSetAsFinalProgramSpecificFileForAgentEmail,
  informEditorNewStudentEmail,
  informStudentTheirEditorEmail,
  sendCommentsGeneralFileForEditorEmail,
  sendCommentsGeneralFileForStudentEmail,
  sendCommentsProgramSpecificFileForEditorEmail,
  sendCommentsProgramSpecificFileForStudentEmail,
  sendStudentFeedbackGeneralFileForEditorEmail,
  sendStudentFeedbackProgramSpecificFileForEditorEmail,
};
