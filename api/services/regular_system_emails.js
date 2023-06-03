const path = require('path');
const { createTransport } = require('nodemailer');
const queryString = require('query-string');
const {
  cv_ml_rl_escalation_summary,
  is_cv_ml_rl_task_response_needed,
  cv_ml_rl_editor_escalation_summary,
  cv_ml_rl_unfinished_summary,
  base_documents_summary,
  missing_academic_background,
  unsubmitted_applications_summary,
  unsubmitted_applications_escalation_summary,
  unsubmitted_applications_escalation_agent_summary,
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
  CONTACT_AGENT,
  cvmlrl_deadline_within30days_escalation_summary,
  is_deadline_within30days_needed
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

const AgentTasksReminderEmail = async (recipient, payload) => {
  const subject = `TaiGer Agent Reminder: ${recipient.firstname} ${recipient.lastname}`;
  let student_i = '';
  for (let i = 0; i < payload.students.length; i += 1) {
    if (i === 0) {
      const base_documents = base_documents_summary(payload.students[i]);
      const unread_cv_ml_rl_thread = cv_ml_rl_unfinished_summary(
        payload.students[i],
        payload.agent
      );
      // TODO
      const missing_uni_assist = '';
      const academic_background_not_complete = missing_academic_background(
        payload.students[i],
        payload.agent
      );
      const unsubmitted_applications = unsubmitted_applications_summary(
        payload.students[i]
      );
      student_i = `
      <p><b>${payload.students[i].firstname} ${payload.students[i].lastname}</b>,</p>

      ${academic_background_not_complete}

      ${base_documents}
      
      ${unread_cv_ml_rl_thread}

      ${unsubmitted_applications}

`;
    } else {
      const base_documents = base_documents_summary(payload.students[i]);
      const unread_cv_ml_rl_thread = cv_ml_rl_unfinished_summary(
        payload.students[i],
        payload.agent
      );
      // TODO
      const missing_uni_assist = '';
      const academic_background_not_complete = missing_academic_background(
        payload.students[i],
        payload.agent
      );
      const unsubmitted_applications = unsubmitted_applications_summary(
        payload.students[i]
      );
      student_i += `
      <p><b>${payload.students[i].firstname} ${payload.students[i].lastname}</b>,</p>

      ${academic_background_not_complete}

      ${base_documents}
      
      ${unread_cv_ml_rl_thread}

      ${unsubmitted_applications}

    `;
    }
  }

  const message = `\
<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>The following is the overview of the current status for your each student:</p>

${student_i}

<p>${TAIGER_SIGNATURE}</p>

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const EditorTasksReminderEmail = async (recipient, payload) => {
  const subject = `TaiGer Editor Reminder: ${recipient.firstname} ${recipient.lastname}`;
  let student_i = '';
  let x = 0;
  for (let i = 0; i < payload.students.length; i += 1) {
    if (x === 0) {
      if (
        is_cv_ml_rl_task_response_needed(payload.students[i], payload.editor)
      ) {
        const unread_cv_ml_rl_thread = cv_ml_rl_unfinished_summary(
          payload.students[i],
          payload.editor
        );
        student_i = `
      <p><b>${payload.students[i].firstname} ${payload.students[i].lastname}</b>,</p>
      
      ${unread_cv_ml_rl_thread}
`;
        x += 1;
      }
    } else {
      if (
        is_cv_ml_rl_task_response_needed(payload.students[i], payload.editor)
      ) {
        const unread_cv_ml_rl_thread = cv_ml_rl_unfinished_summary(
          payload.students[i],
          payload.editor
        );
        student_i += `
      <p><b>${payload.students[i].firstname} ${payload.students[i].lastname}</b>,</p>
      
      ${unread_cv_ml_rl_thread}
    `;
      }
    }
  }

  const message = `\
<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

The following is the overview of the open tasks for your students

${student_i}


<p>${TAIGER_SIGNATURE}</p>

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const StudentApplicationsDeadline_Within30Days_DailyReminderEmail = async (
  recipient,
  payload
) => {
  const subject = `[Important] Applications Deadline very close: ${recipient.firstname} ${recipient.lastname}`;
  const unsubmitted_applications = unsubmitted_applications_escalation_summary(
    payload.student
  );

  const message = `\
<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

${unsubmitted_applications}

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

const StudentCVMLRLEssay_NoReplyAfter3Days_DailyReminderEmail = async (
  recipient,
  payload
) => {
  const subject = `[Action Required] ${recipient.firstname} ${recipient.lastname}: Your Editor is waiting for you!`;
  const unread_cv_ml_rl_thread = cv_ml_rl_escalation_summary(
    payload.student,
    payload.student,
    payload.trigger_days // after 3 days
  );
  const message = `\
<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

${unread_cv_ml_rl_thread}

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

const EditorCVMLRLEssay_NoReplyAfter7Days_DailyReminderEmail = async (
  recipient,
  payload
) => {
  const subject = `[Action Required] ${recipient.firstname} ${recipient.lastname}: Your Students are waiting for your response!`;
  let unread_cv_ml_rl_threads = '';
  for (let i = 0; i < payload.students.length; i += 1) {
    unread_cv_ml_rl_threads += `
    ${cv_ml_rl_editor_escalation_summary(
      payload.students[i],
      payload.editor,
      payload.trigger_days // after 7 days
    )}`;
  }
  const message = `\
<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

${unread_cv_ml_rl_threads}

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

const AgentCVMLRLEssay_NoReplyAfterXDays_DailyReminderEmail = async (
  recipient,
  payload
) => {
  const subject = `[Escalation] ${recipient.firstname} ${recipient.lastname}: The documents are idle for ${payload.trigger_days} days!`;
  let unread_cv_ml_rl_threads = '';
  for (let i = 0; i < payload.students.length; i += 1) {
    unread_cv_ml_rl_threads += `
    ${cv_ml_rl_editor_escalation_summary(
      payload.students[i],
      payload.agent,
      payload.trigger_days // after 7 days
    )}`;
  }
  const message = `\
<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

${unread_cv_ml_rl_threads}

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

const AgentApplicationsDeadline_Within30Days_DailyReminderEmail = async (
  recipient,
  payload
) => {
  const subject = `[Action Required] ${recipient.firstname} ${recipient.lastname}: Your students' applications deadline very close`;
  let unsubmitted_applications_students = '';
  for (let i = 0; i < payload.students.length; i += 1) {
    unsubmitted_applications_students += `
    ${
      is_deadline_within30days_needed(payload.students[i])
        ? unsubmitted_applications_escalation_agent_summary(payload.students[i])
        : ''
    }`;
  }

  const message = `\
<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

${unsubmitted_applications_students}

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};
// TODO: make sure no documents missing?
const EditorCVMLRLEssayDeadline_Within30Days_DailyReminderEmail = async (
  recipient,
  payload
) => {
  const subject = `[Action Required] ${recipient.firstname} ${recipient.lastname}: These Tasks deadline very close!`;
  let cvmlrl_deadline_soon = '';
  for (let i = 0; i < payload.students.length; i += 1) {
    cvmlrl_deadline_soon += `
    ${cvmlrl_deadline_within30days_escalation_summary(payload.students[i])}`;
  }

  const message = `\
<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

${cvmlrl_deadline_soon}

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

module.exports = {
  verifySMTPConfig,
  sendEmail,
  StudentTasksReminderEmail,
  AgentTasksReminderEmail,
  EditorTasksReminderEmail,
  StudentApplicationsDeadline_Within30Days_DailyReminderEmail,
  StudentCVMLRLEssay_NoReplyAfter3Days_DailyReminderEmail,
  EditorCVMLRLEssay_NoReplyAfter7Days_DailyReminderEmail,
  AgentCVMLRLEssay_NoReplyAfterXDays_DailyReminderEmail,
  EditorCVMLRLEssayDeadline_Within30Days_DailyReminderEmail,
  AgentApplicationsDeadline_Within30Days_DailyReminderEmail
};
