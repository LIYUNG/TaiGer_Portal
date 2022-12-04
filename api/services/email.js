const path = require('path');
const { createTransport } = require('nodemailer');
const queryString = require('query-string');

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USERNAME,
  SMTP_PASSWORD,
  BASE_URL,
  isDev,
  ORIGIN
} = require('../config');
const ACCOUNT_ACTIVATION_URL = new URL('/account/activation', ORIGIN).href;
const RESEND_ACTIVATION_URL = new URL('/account/resend-activation', ORIGIN)
  .href;
const PASSWORD_RESET_URL = new URL('/account/reset-password', ORIGIN).href;
const FORGOT_PASSWORD_URL = new URL('/forgot-password', ORIGIN).href;

const CVMLRL_CENTER_URL = new URL('/cv-ml-rl-center', ORIGIN).href;
const CVMLRL_FOR_EDITOR_URL = (studentId) =>
  new URL(`/student-database/${studentId}/CV_ML_RL`, ORIGIN).href;
const UNI_ASSIST_FOR_STUDENT_URL = new URL('/uni-assist', ORIGIN).href;
const UNI_ASSIST_FOR_AGENT_URL = (studentId) =>
  new URL(`/student-database/${studentId}/uni-assist`, ORIGIN).href;
const THREAD_URL = new URL('/document-modification', ORIGIN).href;
const BASE_DOCUMENT_URL = new URL('/base-documents', ORIGIN).href;
const BASE_DOCUMENT_FOR_AGENT_URL = (studentId) =>
  new URL(`/student-database/${studentId}/profile`, ORIGIN).href;
const TEMPLATE_DOWNLOAD_URL = new URL('/download', ORIGIN).href;
const STUDENT_APPLICATION_URL = new URL('/student-applications', ORIGIN).href;
const STUDENT_SURVEY_URL = new URL('/survey', ORIGIN).href;
const SETTINGS_URL = new URL('/settings', ORIGIN).href;

const STUDENT_BACKGROUND_FOR_AGENT_URL = (studentId) =>
  new URL(`/student-database/${studentId}/background`, ORIGIN).href;

const TAIGER_SIGNATURE = 'Your TaiGer Consultancy Team';

const transporter = isDev()
  ? createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD
      }
    })
  : createTransport({
      service: 'gmail',
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD
      }
    });

const verifySMTPConfig = () => {
  return transporter.verify();
};

const senderName = `No-Reply TaiGer Consultancy ${SMTP_USERNAME}`;
const sendEmail = (to, subject, message) => {
  const mail = {
    from: senderName,
    to,
    subject,
    text: message
  };
  return transporter.sendMail(mail);
};

const updateNotificationEmail = async (recipient, msg) => {
  const subject = 'Your status in TaiGer Portal updated';
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname},

Your user status in TaiGer Portal has been changed.

${TAIGER_SIGNATURE}

`;

  return sendEmail(recipient, subject, message);
};

const uploadTemplateSuccessEmail = async (recipient, msg) => {
  const subject = `Template ${msg.category_name} uploaded successfully!`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname},

the template ${msg.category_name} is uploaded sucessfully on

 ${msg.updatedAt}

For more details, please visit: ${TEMPLATE_DOWNLOAD_URL}

${TAIGER_SIGNATURE}

`;

  return sendEmail(recipient, subject, message);
};

const deleteTemplateSuccessEmail = async (recipient, msg) => {
  const subject = `Template ${msg.category_name} deleted successfully!`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname},

the template ${msg.category_name} is deleted sucessfully on

 ${msg.updatedAt}

For more details, please visit: ${TEMPLATE_DOWNLOAD_URL}

${TAIGER_SIGNATURE}

`;

  return sendEmail(recipient, subject, message);
};

const sendConfirmationEmail = async (recipient, token) => {
  const subject = 'TaiGer Portal Email verification';
  const activationLink = queryString.stringifyUrl({
    url: ACCOUNT_ACTIVATION_URL,
    query: { email: recipient.address, token }
  });
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname},

Your user account has been created.
Please use the following link to activate your account:

${activationLink}

This link will expire in 20 minutes.
You can request another here: ${RESEND_ACTIVATION_URL}

${TAIGER_SIGNATURE}

`;

  return sendEmail(recipient, subject, message);
};

const sendForgotPasswordEmail = async (recipient, token) => {
  const subject = 'Password reset instructions';
  const passwordResetLink = queryString.stringifyUrl({
    url: PASSWORD_RESET_URL,
    query: { email: recipient.address, token }
  });
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname},

Please use the link below to reset your password:

${passwordResetLink}

This link will expire in 20 minutes.
You can request another here: ${FORGOT_PASSWORD_URL}

${TAIGER_SIGNATURE}

`;

  return sendEmail(recipient, subject, message);
};

const sendPasswordResetEmail = async (recipient) => {
  const subject = 'Password reset successfully';
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname},

Your password has been successfully updated, you can now login with your new password

in TaiGer portal: ${ORIGIN}

${TAIGER_SIGNATURE}

`;

  return sendEmail(recipient, subject, message);
};

const sendAccountActivationConfirmationEmail = async (recipient, msg) => {
  const subject = 'TaiGer Portal Account activation confirmation';
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname},

Your TaiGer Portal Account has been successfully activated.

You can now login and explore the power of TaiGer Portal!

TaiGer Portal: ${ORIGIN}

${TAIGER_SIGNATURE}

`;

  return sendEmail(recipient, subject, message);
};

const sendUploadedGeneralFilesEmail = async (recipient, msg) => {
  const subject = 'Thank you for your input!';
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

has uploaded ${msg.uploaded_documentname} 

for ${msg.university_name} - ${msg.program_name} on ${msg.uploaded_updatedAt}.

Your editor will review it and give you feedback as soon as possible.

Keep tracking your documents progress: ${CVMLRL_CENTER_URL}

${TAIGER_SIGNATURE}

`;

  return sendEmail(recipient, subject, message);
};

const sendUploadedProfileFilesEmail = async (recipient, msg) => {
  const subject = `Your ${msg.uploaded_documentname} is successfully uploaded!`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

you have uploaded ${msg.uploaded_documentname} on ${msg.uploaded_updatedAt}.

Your agent will review it as soon as possible.

Keep tracking your base documents progress: ${BASE_DOCUMENT_URL}

${TAIGER_SIGNATURE}

`;

  return sendEmail(recipient, subject, message);
};

const sendUploadedVPDEmail = async (recipient, msg) => {
  const subject = 'VPD is successfully uploaded!';
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

you have successfully uploaded ${msg.uploaded_documentname} on ${msg.uploaded_updatedAt}.

Keep tracking your VPD here: ${UNI_ASSIST_FOR_STUDENT_URL}


${TAIGER_SIGNATURE}

`;

  return sendEmail(recipient, subject, message);
};

const sendAgentUploadedProfileFilesForStudentEmail = async (recipient, msg) => {
  const subject = `Your ${msg.uploaded_documentname} is successfully uploaded!`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

your agent ${msg.agent_firstname} ${msg.agent_lastname} have uploaded ${msg.uploaded_documentname} on ${msg.uploaded_updatedAt} for you.

Please go to ${BASE_DOCUMENT_URL} and see the details.

If you have any question, feel free to contact your agent.

${TAIGER_SIGNATURE}

`;

  return sendEmail(recipient, subject, message);
};

const sendAgentUploadedVPDForStudentEmail = async (recipient, msg) => {
  const subject = 'Your VPD is successfully uploaded!';
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

your agent ${msg.agent_firstname} ${msg.agent_lastname} have uploaded ${msg.uploaded_documentname} on ${msg.uploaded_updatedAt} for you.

Please go to ${UNI_ASSIST_FOR_STUDENT_URL} and see the details.

If you have any question, feel free to contact your agent.

${TAIGER_SIGNATURE}

`;

  return sendEmail(recipient, subject, message);
};

const sendUploadedProfileFilesRemindForAgentEmail = async (recipient, msg) => {
  const subject = `New ${msg.uploaded_documentname} uploaded from ${msg.student_firstname} ${msg.student_lastname}`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

your student ${msg.student_firstname} ${msg.student_lastname} has uploaded ${
    msg.uploaded_documentname
  }

on ${msg.uploaded_updatedAt}.

Please go to ${BASE_DOCUMENT_FOR_AGENT_URL(msg.student_id)} and see the details.

${TAIGER_SIGNATURE}

`; // should be for student/agent/editor

  return sendEmail(recipient, subject, message);
};

const sendUploadedVPDRemindForAgentEmail = async (recipient, msg) => {
  const subject = `New VPD uploaded from ${msg.student_firstname} ${msg.student_lastname}`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

your student ${msg.student_firstname} ${msg.student_lastname} has uploaded ${
    msg.uploaded_documentname
  }

on ${msg.uploaded_updatedAt}.

Please go to ${UNI_ASSIST_FOR_AGENT_URL(msg.student_id)} and see the details.

${TAIGER_SIGNATURE}

`; // should be for student/agent/editor

  return sendEmail(recipient, subject, message);
};

const sendChangedProfileFileStatusEmail = async (recipient, msg) => {
  var subject;
  var message;
  if (msg.status === 'rejected') {
    subject = `File Status changes: please upload ${msg.category} again`;
    message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

due to the following reason, please upload ${msg.category} again:

${msg.message}

Please go to ${BASE_DOCUMENT_URL} and see the details.

If you have any question, please contact your agent. 

${TAIGER_SIGNATURE}

`; // should be for student
  } else {
    subject = `File Status changes: ${msg.category} is valid`;
    message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

your uploaded file ${msg.category} is successfully checked by your agent

and it can be used for the application! 

Please go to ${BASE_DOCUMENT_URL} and doueble check the details.

${TAIGER_SIGNATURE}

`; // should be for student
  }

  return sendEmail(recipient, subject, message);
};

const informAgentNewStudentEmail = async (recipient, msg) => {
  const subject = `New student ${msg.std_firstname} ${msg.std_lastname} assigned to you`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.std_firstname} ${msg.std_lastname} will be your student!

Please see the survey ${STUDENT_BACKGROUND_FOR_AGENT_URL(msg.std_id)}

and say hello to your student!

${TAIGER_SIGNATURE}

`;

  return sendEmail(recipient, subject, message);
};

const informStudentTheirAgentEmail = async (recipient, msg) => {
  const subject = 'Your Agent';
  var agent;
  for (let i = 0; i < msg.agents.length; i++) {
    if (i === 0) {
      agent = msg.agents[i].firstname + ' ' + msg.agents[i].lastname;
    } else {
      agent += ', ' + msg.agents[i].firstname + ' ' + msg.agents[i].lastname;
    }
  }
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${agent} will be your agent!

Please go to ${ORIGIN} , and prepare your documents!

${TAIGER_SIGNATURE}

`;

  return sendEmail(recipient, subject, message);
};

const informEditorNewStudentEmail = async (recipient, msg) => {
  const subject = `New student ${msg.std_firstname} ${msg.std_lastname} assigned to you`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.std_firstname} ${msg.std_lastname} will be your student!

Please go to ${CVMLRL_FOR_EDITOR_URL(
    msg.std_id
  )} , and check if the CV task is created and say hello to your student!

${TAIGER_SIGNATURE}

`;

  return sendEmail(recipient, subject, message);
};

const informStudentTheirEditorEmail = async (recipient, msg) => {
  const subject = 'Your Editor';
  var editor;
  for (let i = 0; i < msg.editors.length; i++) {
    if (i === 0) {
      editor = msg.editors[i].firstname + ' ' + msg.editors[i].lastname;
    } else {
      editor += ', ' + msg.editors[i].firstname + ' ' + msg.editors[i].lastname;
    }
  }
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${editor} will be your editor!

Please go to ${ORIGIN} , and prepare your documents!

${TAIGER_SIGNATURE}

`;

  return sendEmail(recipient, subject, message);
};

const createApplicationToStudentEmail = async (recipient, msg) => {
  const subject = 'New Programs assigned to you.';
  let programList;
  for (let i = 0; i < msg.programs.length; i += 1) {
    if (i === 0) {
      programList = `
      ${msg.programs[i].school} - ${msg.programs[i].program_name}
      `;
    } else {
      programList += `
      ${msg.programs[i].school} - ${msg.programs[i].program_name}
      `;
    }
  }
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.agent_firstname} ${msg.agent_lastname} has assigned programs for you:


${programList}


Please go to ${STUDENT_APPLICATION_URL} and mark it as decided if these programs look good to you.

${TAIGER_SIGNATURE}

`;

  return sendEmail(recipient, subject, message);
};

const updateAcademicBackgroundEmail = async (recipient) => {
  const subject = 'Academic Background updated successfully';
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

You have updated your academic background information successfully!

Please double check in ${STUDENT_SURVEY_URL} 

${TAIGER_SIGNATURE}

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const updateLanguageSkillEmail = async (recipient) => {
  const subject = 'Language skills updated successfully';
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

You have updated your Language skills information successfully!

Please double check in ${STUDENT_SURVEY_URL} 

${TAIGER_SIGNATURE}

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const updateLanguageSkillEmailFromTaiGer = async (recipient, msg) => {
  const subject = 'Language skills updated successfully';
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.sender_firstname} ${msg.sender_lastname} updated your Language skills information successfully!

Please double check in ${STUDENT_SURVEY_URL} 

${TAIGER_SIGNATURE}

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const updateApplicationPreferenceEmail = async (recipient) => {
  const subject = 'Language skills updated successfully';
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

You have updated your application preference information successfully!

Please double check in ${STUDENT_SURVEY_URL} 

${TAIGER_SIGNATURE}

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const updatePersonalDataEmail = async (recipient, msg) => {
  const subject = 'Personal data updated successfully';
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

You have updated your personal data successfully!

Please double check in ${SETTINGS_URL} 

${TAIGER_SIGNATURE}

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const updateCredentialsEmail = async (recipient, msg) => {
  const subject = 'TaiGer Portal passwords updated successfully';
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

You have updated your passwords successfully!

Please make sure you can login in ${ORIGIN} 

${TAIGER_SIGNATURE}

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const UpdateStudentApplicationsEmail = async (recipient, msg) => {
  const subject = `${msg.sender_firstname} ${msg.sender_lastname} has updated application status and new tasks`;
  let applications_name = '';
  for (let i = 0; i < msg.student_applications.length; i++) {
    if (msg.new_app_decided_idx.includes(i)) {
      if (i === 0) {
        applications_name =
          msg.student_applications[i].programId.school +
          ' ' +
          msg.student_applications[i].programId.program_name;
      } else {
        applications_name += `\
        
        ${msg.student_applications[i].programId.school} - ${msg.student_applications[i].programId.program_name}`;
      }
    }
  }
  if (applications_name === '') {
    const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.sender_firstname} ${msg.sender_lastname} has updated or declined some applications.

Please go to ${STUDENT_APPLICATION_URL} and see details.

Also go to ${CVMLRL_CENTER_URL} and see the new assigned tasks details for the applications above.

${TAIGER_SIGNATURE}

`; // should be for admin/editor/agent/student

    return sendEmail(recipient, subject, message);
  }

  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.sender_firstname} ${msg.sender_lastname} has updated applications 

${applications_name}

status.

Please go to ${STUDENT_APPLICATION_URL} and see details.

Also go to ${CVMLRL_CENTER_URL} and see the new assigned tasks details for the applications above.

${TAIGER_SIGNATURE}

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const NewMLRLEssayTasksEmail = async (recipient, msg) => {
  const subject = `${msg.sender_firstname} ${msg.sender_lastname} has updated application status and new tasks`;
  let applications_name = '';
  for (let i = 0; i < msg.student_applications.length; i++) {
    if (msg.new_app_decided_idx.includes(i)) {
      if (i === 0) {
        applications_name =
          msg.student_applications[i].programId.school +
          ' ' +
          msg.student_applications[i].programId.program_name;
      } else {
        applications_name += `\
        
        ${msg.student_applications[i].programId.school} - ${msg.student_applications[i].programId.program_name}`;
      }
    }
  }

  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.sender_firstname} ${msg.sender_lastname} has decided applications 

${applications_name}. 

The relavant documents tasks are now assigned to you.

Please go to ${CVMLRL_CENTER_URL} and see the new assigned tasks details for the applications above.

${TAIGER_SIGNATURE}

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const NewMLRLEssayTasksEmailFromTaiGer = async (recipient, msg) => {
  const subject = `${msg.sender_firstname} ${msg.sender_lastname} has updated application status and new tasks`;
  let applications_name = '';
  for (let i = 0; i < msg.student_applications.length; i++) {
    if (msg.new_app_decided_idx.includes(i)) {
      if (i === 0) {
        applications_name =
          msg.student_applications[i].programId.school +
          ' ' +
          msg.student_applications[i].programId.program_name;
      } else {
        applications_name += `\
        
        ${msg.student_applications[i].programId.school} - ${msg.student_applications[i].programId.program_name}`;
      }
    }
  }

  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.sender_firstname} ${msg.sender_lastname} has decided applications 

${applications_name}

for ${msg.student_firstname} ${msg.student_lastname}. 

The relavant documents tasks are now assigned to you.

Please go to ${CVMLRL_CENTER_URL} and see the new assigned tasks details for the applications above.

${TAIGER_SIGNATURE}

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const sendNewApplicationMessageInThreadEmail = async (recipient, msg) => {
  const thread_url = `${THREAD_URL}/${msg.thread_id}`;
  const subject = `${msg.writer_firstname} ${msg.writer_lastname} has new update for ${msg.school} ${msg.program_name} ${msg.uploaded_documentname}!`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.writer_firstname} ${msg.writer_lastname} has a new update for 

${msg.school} - ${msg.program_name} - ${msg.uploaded_documentname}

on ${msg.uploaded_updatedAt}.


Please go to TaiGer Portal ${thread_url} and check the updates. 

${TAIGER_SIGNATURE}

`;

  sendEmail(recipient, subject, message);
};

const sendNewGeneraldocMessageInThreadEmail = async (recipient, msg) => {
  const thread_url = `${THREAD_URL}/${msg.thread_id}`;
  const subject = `${msg.writer_firstname} ${msg.writer_lastname} has new update for ${msg.uploaded_documentname}!`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.writer_firstname} ${msg.writer_lastname} has a new update for 

${msg.uploaded_documentname}

on ${msg.uploaded_updatedAt}.


Please go to TaiGer Portal ${thread_url} and check the updates. 

${TAIGER_SIGNATURE}

`;

  sendEmail(recipient, subject, message);
};
const sendSetAsFinalGeneralFileForAgentEmail = async (recipient, msg) => {
  if (msg.isFinalVersion) {
    const subject = `${msg.student_firstname} ${msg.student_lastname} ${msg.uploaded_documentname} is finished!`;
    const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.editor_firstname} ${msg.editor_lastname} have finalized ${
      msg.uploaded_documentname
    } 

for student ${recipient.firstname} ${recipient.lastname}

on ${msg.uploaded_updatedAt}.

This document is ready for the application. 

Please go to ${CVMLRL_FOR_EDITOR_URL(msg.student_id)} for more details.

If you have any question, feel free to contact your editor.

${TAIGER_SIGNATURE}

`;

    sendEmail(recipient, subject, message);
  } else {
    const subject = `${msg.student_firstname} ${msg.student_lastname} ${msg.uploaded_documentname} is not finished!`;
    const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.editor_firstname} ${msg.editor_lastname} set ${msg.uploaded_documentname} 

as not finished.

Please go to ${CVMLRL_FOR_EDITOR_URL(msg.student_id)} for more details.

If you have any question, feel free to contact your editor.

${TAIGER_SIGNATURE}

`;

    sendEmail(recipient, subject, message);
  }
};

const sendSetAsFinalGeneralFileForStudentEmail = async (recipient, msg) => {
  if (msg.isFinalVersion) {
    const subject = `Your document ${msg.uploaded_documentname} is finished!`;
    const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

your editor ${msg.editor_firstname} ${msg.editor_lastname} have finalized ${msg.uploaded_documentname} 

on ${msg.uploaded_updatedAt} 

for you.

This document is ready for the application. 

Please go to ${CVMLRL_CENTER_URL} for more details.

If you have any question, feel free to contact your editor.

${TAIGER_SIGNATURE}

`;

    sendEmail(recipient, subject, message);
  } else {
    const subject = `Your document ${msg.uploaded_documentname} is not finished!`;
    const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

your editor ${msg.editor_firstname} ${msg.editor_lastname} set ${msg.uploaded_documentname} 

as not finished.

Please go to ${CVMLRL_CENTER_URL} for more details.

If you have any question, feel free to contact your editor.

${TAIGER_SIGNATURE}

`;

    sendEmail(recipient, subject, message);
  }
};

const sendSetAsFinalProgramSpecificFileForStudentEmail = async (
  recipient,
  msg
) => {
  if (msg.isFinalVersion) {
    const subject = `Your document ${msg.uploaded_documentname} is finished!`;
    const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.editor_firstname} ${msg.editor_lastname} have finalized

${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} 

on ${msg.uploaded_updatedAt} 

for you.

This document is ready for the application. 

Please go to ${CVMLRL_CENTER_URL} for more details.

If you have any question, feel free to contact your editor.

${TAIGER_SIGNATURE}

`;

    sendEmail(recipient, subject, message);
  } else {
    const subject = `Your document ${msg.uploaded_documentname} is not finished!`;
    const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

your editor ${msg.editor_firstname} ${msg.editor_lastname} set

${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} 

as not finished.

Please go to ${CVMLRL_CENTER_URL} for more details.

If you have any question, feel free to contact your editor.

${TAIGER_SIGNATURE}

`;

    sendEmail(recipient, subject, message);
  }
};

const sendSetAsFinalProgramSpecificFileForAgentEmail = async (
  recipient,
  msg
) => {
  if (msg.isFinalVersion) {
    const subject = `${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} of ${msg.student_firstname} ${msg.student_lastname} is finished!`;
    const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.editor_firstname} ${msg.editor_lastname} has finalized

${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} on ${msg.uploaded_updatedAt} 

for ${msg.student_firstname} ${msg.student_lastname}.

Double check this document and finalize the application if applicable. 

Please go to ${CVMLRL_FOR_EDITOR_URL(msg.student_id)} for more details.

${TAIGER_SIGNATURE}

`;

    sendEmail(recipient, subject, message);
  } else {
    const subject = `${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} of ${msg.student_firstname} ${msg.student_lastname} is not finished!`;
    const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.editor_firstname} ${msg.editor_lastname} set

${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} as not finished

on ${msg.uploaded_updatedAt} 

for ${msg.student_firstname} ${msg.student_lastname}.

Double check this document and finalize the application if applicable. 

Please go to ${CVMLRL_FOR_EDITOR_URL(msg.student_id)} for more details.

${TAIGER_SIGNATURE}

`;

    sendEmail(recipient, subject, message);
  }
};

const assignDocumentTaskToEditorEmail = async (recipient, msg) => {
  const subject = `[New Task] ${msg.student_firstname} ${msg.student_lastname} ${msg.documentname} is assigned to you!`;
  const THREAD_LINK = new URL(`/document-modification/${msg.thread_id}`, ORIGIN)
    .href;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.student_firstname} ${msg.student_lastname} -  ${msg.documentname}:

is assigned to you 

on ${msg.updatedAt}.


Please go to TaiGer Portal ${THREAD_LINK} and check the updates. 

If you have any question, feel free to contact your editor.

${TAIGER_SIGNATURE}

`;

  sendEmail(recipient, subject, message);
};

const assignDocumentTaskToStudentEmail = async (recipient, msg) => {
  const subject = `[New Task] ${recipient.firstname} ${recipient.lastname} ${msg.documentname} is assigned to you!`;
  const THREAD_LINK = new URL(`/document-modification/${msg.thread_id}`, ORIGIN)
    .href;

  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.documentname}:

is assigned to you 

on ${msg.updatedAt}.


Please go to TaiGer Portal ${THREAD_LINK} and check the updates. 

If you have any question, feel free to contact your editor.

${TAIGER_SIGNATURE}

`;

  sendEmail(recipient, subject, message);
};

const sendSomeReminderEmail = async (recipient) => {
  const subject = 'File Status changes';
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

Some reminder email template.

${TAIGER_SIGNATURE}

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

module.exports = {
  verifySMTPConfig,
  updateNotificationEmail,
  sendEmail,
  deleteTemplateSuccessEmail,
  uploadTemplateSuccessEmail,
  sendConfirmationEmail,
  sendForgotPasswordEmail,
  sendPasswordResetEmail,
  sendAccountActivationConfirmationEmail,
  sendUploadedGeneralFilesEmail,
  sendUploadedProfileFilesEmail,
  sendUploadedVPDEmail,
  sendAgentUploadedProfileFilesForStudentEmail,
  sendAgentUploadedVPDForStudentEmail,
  sendUploadedProfileFilesRemindForAgentEmail,
  sendUploadedVPDRemindForAgentEmail,
  sendChangedProfileFileStatusEmail,
  updateAcademicBackgroundEmail,
  updateLanguageSkillEmail,
  updateLanguageSkillEmailFromTaiGer,
  updateApplicationPreferenceEmail,
  updatePersonalDataEmail,
  updateCredentialsEmail,
  UpdateStudentApplicationsEmail,
  NewMLRLEssayTasksEmail,
  NewMLRLEssayTasksEmailFromTaiGer,
  sendSomeReminderEmail,
  informAgentNewStudentEmail,
  informStudentTheirAgentEmail,
  sendSetAsFinalGeneralFileForAgentEmail,
  sendSetAsFinalGeneralFileForStudentEmail,
  sendNewApplicationMessageInThreadEmail,
  sendNewGeneraldocMessageInThreadEmail,
  sendSetAsFinalProgramSpecificFileForStudentEmail,
  sendSetAsFinalProgramSpecificFileForAgentEmail,
  assignDocumentTaskToEditorEmail,
  assignDocumentTaskToStudentEmail,
  informEditorNewStudentEmail,
  informStudentTheirEditorEmail,
  createApplicationToStudentEmail
};
