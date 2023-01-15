const path = require('path');
const { createTransport } = require('nodemailer');
const queryString = require('query-string');
const {
  cv_ml_rl_unfinished_summary,
  base_documents_summary,
  missing_academic_background,
  unsubmitted_applications_summary,
  ACCOUNT_ACTIVATION_URL,
  RESEND_ACTIVATION_URL,
  PASSWORD_RESET_URL,
  FORGOT_PASSWORD_URL,
  CVMLRL_CENTER_URL,
  CVMLRL_FOR_EDITOR_URL,
  UNI_ASSIST_FOR_STUDENT_URL,
  UNI_ASSIST_FOR_AGENT_URL,
  THREAD_URL,
  BASE_DOCUMENT_URL,
  BASE_DOCUMENT_FOR_AGENT_URL,
  TEMPLATE_DOWNLOAD_URL,
  STUDENT_APPLICATION_URL,
  STUDENT_SURVEY_URL,
  SETTINGS_URL,
  STUDENT_BACKGROUND_FOR_AGENT_URL,
  TAIGER_SIGNATURE,
  SPLIT_LINE,
  ENGLISH_BELOW,
  CONTACT_AGENT
} = require('../constants');

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USERNAME,
  SMTP_PASSWORD,
  isDev,
  ORIGIN
} = require('../config');

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
    // text: message,
    html: message
  };
  return transporter.sendMail(mail);
};

const StudentTasksReminderEmail = async (recipient, payload) => {
  const subject = `TaiGer Student Reminder: ${recipient.firstname} ${recipient.lastname}`;
  const unsubmitted_applications = unsubmitted_applications_summary(
    payload.student
  );

  const base_documents = base_documents_summary(payload.student);

  const unread_cv_ml_rl_thread = cv_ml_rl_unfinished_summary(
    payload.student,
    payload.student
  );
  // TODO: uni-assist if missing
  // TODO if english not passed and not registering any date, inform them
  const missing_uni_assist = '';
  const survey_not_complete = missing_academic_background(
    payload.student,
    payload.student
  );
  const message = `\
<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

${survey_not_complete}

${unread_cv_ml_rl_thread}

${base_documents}

${unsubmitted_applications}


<p>${TAIGER_SIGNATURE}</p>

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

module.exports = {
  verifySMTPConfig,
  sendEmail,
  StudentTasksReminderEmail
};
