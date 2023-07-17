const path = require('path');
const { createTransport } = require('nodemailer');
const queryString = require('query-string');
const {
  cv_ml_rl_unfinished_summary,
  base_documents_summary,
  missing_academic_background,
  unsubmitted_applications_summary,
  ACCOUNT_ACTIVATION_URL,
  TEAMS_URL,
  RESEND_ACTIVATION_URL,
  PASSWORD_RESET_URL,
  FORGOT_PASSWORD_URL,
  ARCHIVED_STUDENTS_URL,
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
  STUDENT_COURSE_URL,
  STUDENT_BACKGROUND_FOR_AGENT_URL,
  TAIGER_SIGNATURE,
  SPLIT_LINE,
  ENGLISH_BELOW,
  CONTACT_AGENT,
  STUDENT_COMMUNICATION_THREAD_URL,
  STUDENT_ANALYSED_COURSE_URL
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

const updateNotificationEmail = async (recipient, msg) => {
  const subject =
    '您的TaiGer Portal使用者權限已更新 / Your user role in TaiGer Portal updated';
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>您的 TaiGer Portal 使用者權限已更新。</p>

<p>請至 <a href="${SETTINGS_URL}">Setting</a> 確認使用者身分角色。</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>Your user role in TaiGer Portal has been changed.</p>

<p>Please visit <a href="${SETTINGS_URL}">Setting</a> and make sure your user role.</p>

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

const updatePermissionNotificationEmail = async (recipient, msg) => {
  const subject =
    '您的TaiGer Portal使用者權限已更新 / Your user permissions in TaiGer Portal updated';
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>您的 TaiGer Portal 使用者權限已更新。</p>

<p>請至 <a href="${TEAMS_URL}">TaiGer Teams</a> 確認使用者權限。</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>Your user permissions in TaiGer Portal have been updated.</p>

<p>Please visit <a href="${TEAMS_URL}">TaiGer Teams</a> and make sure your user permissions.</p>

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

const uploadTemplateSuccessEmail = async (recipient, msg) => {
  const subject = `Template ${msg.category_name} uploaded successfully!`;
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.category_name} 模板已成功上傳於</p>

<p>${msg.updatedAt}</p>

<p>更多細節請至 <a href="${TEMPLATE_DOWNLOAD_URL}">TaiGer Portal Download</a></p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>the template ${msg.category_name} is uploaded sucessfully on</p>

<p>${msg.updatedAt}</p>

<p>For more details, please visit: <a href="${TEMPLATE_DOWNLOAD_URL}">TaiGer Portal Download</a></p>

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

const deleteTemplateSuccessEmail = async (recipient, msg) => {
  const subject = `Template ${msg.category_name} deleted successfully!`;
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.category_name} 模板已成功刪除於</p>

<p>${msg.updatedAt}</p>

<p>更多細節請至 <a href="${TEMPLATE_DOWNLOAD_URL}">TaiGer Portal Download</a></p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>the template ${msg.category_name} is deleted sucessfully on</p>

<p>${msg.updatedAt}</p>

<p>For more details, please visit: <a href="${TEMPLATE_DOWNLOAD_URL}">TaiGer Portal Download</a></p>

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

// TODO
const sendInvitationReminderEmail = async (recipient, payload) => {
  const subject = 'TaiGer Portal 開通提醒 / TaiGer Portal Activation Reminder';
  const activationLink = queryString.stringifyUrl({
    url: ACCOUNT_ACTIVATION_URL,
    query: { email: recipient.address, token: payload.token }
  });
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>請查看第一封 TaiGer email 連結啟用您的帳戶：</p>

${activationLink}

<p>此連結將於 20 分鐘後失效。</p>

<p>但您仍可再次請求啟用連結於： ${RESEND_ACTIVATION_URL}</p>

<p>以下為您的 TaiGer Portal 帳號密碼：</p>
<p>Email: <b>${recipient.address}</b></p>
<p>Password: <b>${payload.password}</b></p>

<p>密碼為臨時，登入後請至 ${SETTINGS_URL} 盡速更換您的密碼</p>
<p> </p>
<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>Your user account has been created.</p>
<p>Please use the following link to activate your account:</p>

${activationLink}

<p>This link will expire in 20 minutes.</p>
<p>You can request another here: ${RESEND_ACTIVATION_URL}</p>

<p>The following are your TaiGer Portal credential</p>
<p>Email: <b>${recipient.address}</b></p>
<p>Password: <b>${payload.password}</b></p>

<p>Please change the password in ${SETTINGS_URL} after login.</p>

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

const sendInvitationEmail = async (recipient, payload) => {
  const subject =
    'TaiGer Portal 電子信箱驗證 / TaiGer Portal Email verification';
  const activationLink = queryString.stringifyUrl({
    url: ACCOUNT_ACTIVATION_URL,
    query: { email: recipient.address, token: payload.token }
  });
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>請使用以下連結來啟用您的帳戶：</p>

${activationLink}

<p>此連結將於 20 分鐘後失效。</p>

<p>但您仍可再次請求啟用連結於： ${RESEND_ACTIVATION_URL}</p>

<p>以下為您的 TaiGer Portal 帳號密碼：</p>
<p>Email: <b>${recipient.address}</b></p>
<p>Password: <b>${payload.password}</b></p>

<p>密碼為臨時，登入後請至 ${SETTINGS_URL} 盡速更換您的密碼</p>
<p> </p>
<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>Your user account has been created.</p>
<p>Please use the following link to activate your account:</p>

${activationLink}

<p>This link will expire in 20 minutes.</p>
<p>You can request another here: ${RESEND_ACTIVATION_URL}</p>

<p>The following are your TaiGer Portal credential</p>
<p>Email: <b>${recipient.address}</b></p>
<p>Password: <b>${payload.password}</b></p>

<p>Please change the password in ${SETTINGS_URL} after login.</p>

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

const sendConfirmationEmail = async (recipient, token) => {
  const subject =
    'TaiGer Portal 電子信箱驗證 / TaiGer Portal Email verification';
  const activationLink = queryString.stringifyUrl({
    url: ACCOUNT_ACTIVATION_URL,
    query: { email: recipient.address, token }
  });
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>您的 TaiGer Portal 帳戶已被建立。請使用以下連結來啟用您的帳戶：</p>

${activationLink}

<p>此連結將於 20 分鐘後失效。</p>

<p>但您仍可再次請求啟用連結於： ${RESEND_ACTIVATION_URL}</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>Your user account has been created.</p>
<p>Please use the following link to activate your account:</p>

${activationLink}

<p>This link will expire in 20 minutes.</p>
<p>You can request another here: ${RESEND_ACTIVATION_URL}</p>

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

const sendForgotPasswordEmail = async (recipient, token) => {
  const subject =
    'TaiGer Portal 密碼重設指示 / TaiGer Portal Password reset instructions';
  const passwordResetLink = queryString.stringifyUrl({
    url: PASSWORD_RESET_URL,
    query: { email: recipient.address, token }
  });
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>請用以下連結重新設定您的 TaiGer Portal 密碼：</p>

${passwordResetLink}

<p>此連結將於 20 分鐘後失效。</p>

<p>但您仍可再次請求密碼重設連結於： ${FORGOT_PASSWORD_URL} </p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

Please use the link below to reset your password:

${passwordResetLink}

<p>This link will expire in 20 minutes.</p>
<p>You can request another here: ${FORGOT_PASSWORD_URL}</p>

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

const sendPasswordResetEmail = async (recipient) => {
  const subject =
    'TaiGer Portal 密碼重設成功 / TaiGer Portal Password reset successfully';
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>您的 TaiGer Portal 密碼已成功被更新，您現在可以使用新密碼登入 TaiGer Portl。</p>

<p>TaiGer portal: <a href="${ORIGIN}">TaiGer portal</a></p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>Your password has been successfully updated, you can now login with your new password</p>

<p>in <a href="${ORIGIN}">TaiGer portal</a></p>

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

const sendAccountActivationConfirmationEmail = async (recipient, msg) => {
  const subject = 'TaiGer Portal Account activation confirmation';
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>您的 TaiGer Portal 帳戶已成功開通。</p>

您現在可以登入並開始使用 TaiGer Portal。

<p>TaiGer Portal 連結： <a href="${ORIGIN}">TaiGer portal</a></p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>Your TaiGer Portal Account has been successfully activated.</p>

<p>You can now login and explore the power of TaiGer Portal!</p>

<p>TaiGer Portal: <a href="${ORIGIN}">TaiGer portal</a></p>

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

const sendUploadedProfileFilesEmail = async (recipient, msg) => {
  const subject = `您的 ${msg.uploaded_documentname} 已成功上傳！ / Your ${msg.uploaded_documentname} is successfully uploaded!`;
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>您已於 ${msg.uploaded_updatedAt} 成功上傳</p>

${msg.uploaded_documentname}。

<p>您的顧問將會盡快瀏覽這份文件並給您意見回饋。</p>

<p>有任何更新，請至 <a href="${BASE_DOCUMENT_URL}">Base Documents</a> 查看細節。</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>you have uploaded ${msg.uploaded_documentname} on ${msg.uploaded_updatedAt} .</p>

<p>Your agent will review it as soon as possible.</p>

<p>Keep tracking your base documents progress: <a href="${BASE_DOCUMENT_URL}">Base Documents</a> </p>

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

const sendUploadedVPDEmail = async (recipient, msg) => {
  const subject = 'VPD is successfully uploaded!';
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>您已於 ${msg.uploaded_updatedAt} 成功上傳</p>

<p>${msg.uploaded_documentname} 。</p>

<p>有任何 VPD 更新，請至 <a href="${UNI_ASSIST_FOR_STUDENT_URL}">Student Uni-Assist</a></p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>you have successfully uploaded ${msg.uploaded_documentname} on ${msg.uploaded_updatedAt}.</p>

<p>Keep tracking your VPD here: <a href="${UNI_ASSIST_FOR_STUDENT_URL}">Student Uni-Assist</a> </p>

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

const sendAgentUploadedProfileFilesForStudentEmail = async (recipient, msg) => {
  const subject = `Your ${msg.uploaded_documentname} is successfully uploaded!`;
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>您的顧問 ${msg.agent_firstname} ${msg.agent_lastname} 已幫您上傳 ${msg.uploaded_documentname} </p>

<p>於 ${msg.uploaded_updatedAt} 。 </p>

<p>請至 <a href="${BASE_DOCUMENT_URL}">Base Documents</a> 並查看細節。</p>

<p>${CONTACT_AGENT}</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>your agent ${msg.agent_firstname} ${msg.agent_lastname} have uploaded ${msg.uploaded_documentname} on ${msg.uploaded_updatedAt} for you. </p>

<p>Please go to <a href="${BASE_DOCUMENT_URL}">Base Documents</a> and see the details.</p>

<p>If you have any question, feel free to contact your agent.</p>

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

const sendAgentUploadedVPDForStudentEmail = async (recipient, msg) => {
  const subject = '您的 VPD 已成功上傳 / Your VPD is successfully uploaded!';
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>您的顧問 ${msg.agent_firstname} ${msg.agent_lastname} 已幫您上傳 ${msg.uploaded_documentname} </p>

<p>於${msg.uploaded_updatedAt} 。</p>

<p>請至 <a href="${UNI_ASSIST_FOR_STUDENT_URL}">Student Uni-Assit</a> 並查看細節。</p>

<p>${CONTACT_AGENT}</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>your agent ${msg.agent_firstname} ${msg.agent_lastname} have uploaded ${msg.uploaded_documentname} on ${msg.uploaded_updatedAt} for you.</p>

<p>Please go to <a href="${UNI_ASSIST_FOR_STUDENT_URL}">Student Uni-Assist</a> and see the details.</p>

<p>If you have any question, feel free to contact your agent.</p>

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

const sendUploadedProfileFilesRemindForAgentEmail = async (recipient, msg) => {
  const subject = `New ${msg.uploaded_documentname} uploaded from ${msg.student_firstname} ${msg.student_lastname}`;
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>您的學生 ${msg.student_firstname} ${msg.student_lastname} 上傳了 ${
    msg.uploaded_documentname
  } </p>

<p>於 ${msg.uploaded_updatedAt} 。</p>

<p>請至 ${BASE_DOCUMENT_FOR_AGENT_URL(msg.student_id)} 確認細節。</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>your student ${msg.student_firstname} ${msg.student_lastname} has uploaded ${
    msg.uploaded_documentname
  } </p>

<p>on ${msg.uploaded_updatedAt}.</p>

<p>Please go to ${BASE_DOCUMENT_FOR_AGENT_URL(
    msg.student_id
  )} and see the details.</p>

<p>${TAIGER_SIGNATURE}</p>

`; // should be for student/agent/editor

  return sendEmail(recipient, subject, message);
};

const sendUploadedVPDRemindForAgentEmail = async (recipient, msg) => {
  const subject = `新 VPD 上傳從 ${msg.student_firstname} ${msg.student_lastname} / New VPD uploaded from ${msg.student_firstname} ${msg.student_lastname}`;
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>您的學生 ${msg.student_firstname} ${msg.student_lastname} 上傳了 ${
    msg.uploaded_documentname
  } </p>

<p>在 ${msg.uploaded_updatedAt}.</p>

<p>請至 <a href="${UNI_ASSIST_FOR_AGENT_URL(msg.student_id)}">${
    msg.student_firstname
  } ${msg.student_lastname} Uni-Assist</a> 確認細節。</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>your student ${msg.student_firstname} ${msg.student_lastname} has uploaded ${
    msg.uploaded_documentname
  } </p>

<p>on ${msg.uploaded_updatedAt}.</p>

<p>Please go to <a href="${UNI_ASSIST_FOR_AGENT_URL(msg.student_id)}">${
    msg.student_firstname
  } ${msg.student_lastname} Uni-Assist</a> and see the details.</p>

<p>${TAIGER_SIGNATURE}</p>

`; // should be for student/agent/editor

  return sendEmail(recipient, subject, message);
};

const sendChangedProfileFileStatusEmail = async (recipient, msg) => {
  var subject;
  var message;
  if (msg.status === 'rejected') {
    subject = `文件狀態更新：請再次上傳 ${msg.category} / File Status changes: please upload ${msg.category} again`;
    message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>由於下列原因, 請再次上傳 ${msg.category}:</p>

<p><b>${msg.message}</b></p>

<p>請至 <a href="${BASE_DOCUMENT_URL}">Base Documents</a> 確認被拒絕原因，並刪除舊檔案，然後再次上傳。</p>

<p>如果有任何疑問，請聯絡您的顧問。 </p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>due to the following reason, please upload ${msg.category} again:</p>

<p>${msg.message}</p>

<p>Please go to <a href="${BASE_DOCUMENT_URL}">Base Documents</a> and check again the reason and then delete it before upload it again.</p>

<p>If you have any question, please contact your agent. </p>

<p>${TAIGER_SIGNATURE}</p>

`; // should be for student
  } else {
    subject = `文件狀態更新：${msg.category} 合格 / File Status changes: ${msg.category} is valid`;
    message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>您的顧問已經看過您上傳的文件 ${msg.category}，文字清楚、無資訊遺漏</p>

<p>並且該文件可以拿來做為申請!</p>

<p>請至 <a href="${BASE_DOCUMENT_URL}">Base Documents</a> 並再次確認。</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>your uploaded file ${msg.category} is successfully checked by your agent</p>

<p>and it can be used for the application! </p>

<p>Please go to <a href="${BASE_DOCUMENT_URL}">Base Documents</a> and doueble check the details.</p>

<p>${TAIGER_SIGNATURE}</p>

`; // should be for student
  }

  return sendEmail(recipient, subject, message);
};

const informAgentNewStudentEmail = async (recipient, msg) => {
  const subject = `新學生 ${msg.std_firstname} ${msg.std_lastname} 已被指派給您 / New student ${msg.std_firstname} ${msg.std_lastname} assigned to you`;
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.std_firstname} ${msg.std_lastname} 將被指配給您。</p>

<p>請至 ${STUDENT_BACKGROUND_FOR_AGENT_URL(
    msg.std_id
  )} 查看他的背景問卷並與她/他打聲招呼！</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.std_firstname} ${msg.std_lastname} will be your student!</p>

<p>Please see the survey ${STUDENT_BACKGROUND_FOR_AGENT_URL(msg.std_id)}</p>

<p>and say hello to your student!</p>

<p>${TAIGER_SIGNATURE}</p>

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
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>${agent} 將會是您的顧問。</p>

<p>請至 <a href="${ORIGIN}">TaiGer portal</a> 並開始準備您的文件。</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>${agent} will be your agent!</p>

<p>Please go to <a href="${ORIGIN}">TaiGer portal</a> , and prepare your documents!</p>

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

const informEditorNewStudentEmail = async (recipient, msg) => {
  const subject = `New student ${msg.std_firstname} ${msg.std_lastname} assigned to you`;
  const message = `\
<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.std_firstname} ${msg.std_lastname} will be your student!</p>

<p>Please go to ${CVMLRL_FOR_EDITOR_URL(
    msg.std_id
  )} , and check if the CV task is created and say hello to your student!</p>

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

const informEditorArchivedStudentEmail = async (recipient, msg) => {
  const subject = `[Close] Student ${msg.std_firstname} ${msg.std_lastname} is close.`;
  const message = `\
<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.std_firstname} ${msg.std_lastname} is closed! No further tasks needed for the student.</p>

<p>Please go to ${ARCHIVED_STUDENTS_URL} , and see the archived student!</p>

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

const informStudentArchivedStudentEmail = async (recipient, msg) => {
  const subject = `[${recipient.firstname} ${recipient.lastname}] TaiGer Portal service ends`;
  const message = `\
<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>您在 TaiGer Portal 上的服務已結束。</p>

<p>感謝您的使用。祝您在未來在求學的路上一帆風順。</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>Your service in TaiGer Portal is closed! </p>

<p>Thank you! We wish you success in your future endeavors</p>

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

const informStudentTheirEditorEmail = async (recipient, msg) => {
  const subject = 'Your Editor';
  var editor;
  for (let i = 0; i < msg.editors.length; i++) {
    if (i === 0) {
      editor = `${msg.editors[i].firstname} ${msg.editors[i].lastname}`;
    } else {
      editor += `, ${msg.editors[i].firstname} ${msg.editors[i].lastname}`;
    }
  }
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>從現在開始我們的外籍顧問 ${editor} 會正式開始幫你修改、潤飾申請資料，並且全權負責申請資料(動機信、推薦信、個人履歷)的製作。</p>

<p>若有任何疑問請直接與 ${editor} 在每個修改文件 <a href="${CVMLRL_CENTER_URL}">CV ML RL Center</a> 的討論串做溝通。</p>

<p>如果有任何的技術上問題，請詢問您的顧問作協助。</p>

<p>在 Portal 的文件修改討論串，請用<b>英文</b>溝通。</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>Let me introduce our professional Editor ${editor}. From now on, ${editor} will be fully responsible for editing your application documents (CV, Motivation letters, Recommendation Letters).</p>

<p>Please directly provide your feedback to ${editor} in each documents discussion threads in the <a href="${CVMLRL_CENTER_URL}">CV ML RL Center</a>. </p>

<p>If you have any technical problems, please ask your agent for help.</p>

<p>In each TaiGer Portal's CV/ML/RL Center document discussion thread, please use <b>English</b> to provide your feedback with your edtior.</p>


<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

const createApplicationToStudentEmail = async (recipient, msg) => {
  const subject = '新的建議申請學程指派給您 / New Programs assigned to you.';
  let programList;
  for (let i = 0; i < msg.programs.length; i += 1) {
    if (i === 0) {
      programList = `<ul><li>${msg.programs[i].school} - ${msg.programs[i].program_name}</li>
      `;
    } else {
      programList += `<li>${msg.programs[i].school} - ${msg.programs[i].program_name}</li>`;
    }
  }
  programList += '</ul>';
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.agent_firstname} ${msg.agent_lastname} 顧問指派建議的學校學程給您：</p>

${programList}

<p>請至 <a href="${STUDENT_APPLICATION_URL}">Student Applications</a> 查看細節並選擇是否決定要申請 (Decided: Yes / No)。</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.agent_firstname} ${msg.agent_lastname} has assigned programs for you:</p>

${programList}

<p>Please go to <a href="${STUDENT_APPLICATION_URL}">Student Applications</a> and mark it as decided if these programs look good to you.</p>

<p>${TAIGER_SIGNATURE}</p>

`;

  return sendEmail(recipient, subject, message);
};

const updateAcademicBackgroundEmail = async (recipient) => {
  const subject =
    'TaiGer Portal 學術背景更新成功！ TaiGer Portal Academic Background updated successfully!';
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>您已成功更新您的學術背景資訊！</p>

<p>若有新的資訊，請再次到 <a href="${STUDENT_SURVEY_URL}">TaiGer Portal - Survey</a> 更新資訊。</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>You have updated your academic background information successfully!</p>

<p>If there is nw update, please go to <a href="${STUDENT_SURVEY_URL}">TaiGer Portal - Survey</a> and synchronize the information.</p>

<p>${TAIGER_SIGNATURE}</p>

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const updateLanguageSkillEmail = async (recipient) => {
  const subject =
    '語言能力與檢定資訊更新成功 / Language skills updated successfully';
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>您已成功更新您的語言能力資訊與檢定！</p>

<p>若有新的資訊，如考過檢定、或是知道新的考試時間，請再次到 <a href="${STUDENT_SURVEY_URL}">TaiGer Portal - Survey</a> 更新資訊。</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>You have updated your Language skills information successfully!</p>

<p>If there is nw update (for example: languages test passed or new test date registered) </p>

Please go to <a href="${STUDENT_SURVEY_URL}">TaiGer Portal - Survey</a> and synchronize the information.

<p>${TAIGER_SIGNATURE}</p>

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const updateLanguageSkillEmailFromTaiGer = async (recipient, msg) => {
  const subject =
    '語言能力與檢定資訊更新成功 /Language skills updated successfully';
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.sender_firstname} ${msg.sender_lastname} 成功更新您的語言能力與檢定資訊與檢定。</p>

<p>若有新的資訊，如考過檢定、或是知道新的考試時間，請再次到 <a href="${STUDENT_SURVEY_URL}">TaiGer Portal - Survey</a> 更新語言檢定資訊。</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.sender_firstname} ${msg.sender_lastname} updated your Language skills information successfully!</p>

<p>Please double check in <a href="${STUDENT_SURVEY_URL}">TaiGer Portal - Survey</a> </p>

<p>${TAIGER_SIGNATURE}</p>

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const updateApplicationPreferenceEmail = async (recipient) => {
  const subject =
    '申請學程偏好資訊更新成功 / Application preference updated successfully';
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>您成功更新您的申請偏好資訊。</p>

<p>若有更新，請至 <a href="${STUDENT_SURVEY_URL}">TaiGer Portal - Survey</a> </p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>You have updated your application preference information successfully!</p>

<p>If there is new update, please go to <a href="${STUDENT_SURVEY_URL}">TaiGer Portal - Survey</a> </p>

<p>${TAIGER_SIGNATURE}</p>

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const updatePersonalDataEmail = async (recipient, msg) => {
  const subject = '個人基本資料更新成功 / Personal data updated successfully';
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>您的個人基本資料已更新成功。</p>

<p>請至 <a href="${SETTINGS_URL}">Setting</a> 查看細節。</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>You have updated your personal data successfully!</p>

<p>Please double check in <a href="${SETTINGS_URL}">Setting</a> </p>

<p>${TAIGER_SIGNATURE}</p>

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const updateCredentialsEmail = async (recipient, msg) => {
  const subject =
    'TaiGer Portal 密碼更新成功 / TaiGer Portal passwords updated successfully';
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>您已成功更新您的 TaiGer Portal 密碼。</p>

<p>請使用您的新密碼登入 TaiGer Portal： <a href="${ORIGIN}">TaiGer portal</a> </p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>You have updated your passwords successfully!</p>

<p>Please make sure you can login in <a href="${ORIGIN}">TaiGer portal</a> </p>

<p>${TAIGER_SIGNATURE}</p>

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const UpdateStudentApplicationsEmail = async (recipient, msg) => {
  const subject = `${msg.sender_firstname} ${msg.sender_lastname} 更新了申請學校資訊並完成任務 / ${msg.sender_firstname} ${msg.sender_lastname} has updated application status and created new tasks`;
  let applications_name = '';
  for (let i = 0; i < msg.student_applications.length; i++) {
    if (msg.new_app_decided_idx.includes(i)) {
      if (i === 0) {
        applications_name = `<ul><li>${msg.student_applications[i].programId.school} ${msg.student_applications[i].programId.program_name}</li>`;
      } else {
        applications_name += `<li>${msg.student_applications[i].programId.school} - ${msg.student_applications[i].programId.program_name}</li>`;
      }
    }
  }
  if (applications_name === '') {
    const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.sender_firstname} ${msg.sender_lastname} 更新了是否申請的學程狀態。</p>

<p>請至 <a href="${STUDENT_APPLICATION_URL}">Student Applications</a> 查看細節。</p>

<p>並且到 <a href="${CVMLRL_CENTER_URL}">CV ML RL Center</a> 查看對於上述申請學程的新指派的文件任務細節。</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.sender_firstname} ${msg.sender_lastname} has updated or declined some applications.</p>

<p>Please go to <a href="${STUDENT_APPLICATION_URL}">Student Applications</a> and see details.</p>

<p>Also go to <a href="${CVMLRL_CENTER_URL}">CV ML RL Center</a> and see the new assigned tasks details for the applications above.</p>

<p>${TAIGER_SIGNATURE}</p>

`; // should be for admin/editor/agent/student

    return sendEmail(recipient, subject, message);
  }

  applications_name += '</ul>';
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.sender_firstname} ${msg.sender_lastname} 更新了您以下學程的申請狀態：</p>

${applications_name}

<p>請至 <a href="${STUDENT_APPLICATION_URL}">Student Applications</a> 並查看細節。</p>

並且到 <a href="${CVMLRL_CENTER_URL}">CV ML RL Center</a> 查看對於上述申請學程的新指派的文件任務細節。

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.sender_firstname} ${msg.sender_lastname} has updated applications </p>

${applications_name}

<p>status.</p>

<p>Please go to <a href="${STUDENT_APPLICATION_URL}">Student Applications</a> and see details.</p>

<p>Also go to <a href="${CVMLRL_CENTER_URL}">CV ML RL Center</a> and see the new assigned tasks details for the applications above.</p>

<p>${TAIGER_SIGNATURE}</p>

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

// For Editor. English only
const NewMLRLEssayTasksEmail = async (recipient, msg) => {
  const subject = `${msg.sender_firstname} ${msg.sender_lastname} has updated application status and new tasks`;
  let applications_name = '';
  for (let i = 0; i < msg.student_applications.length; i++) {
    if (msg.new_app_decided_idx.includes(i)) {
      if (i === 0) {
        applications_name = `<ul><li>${msg.student_applications[i].programId.school} ${msg.student_applications[i].programId.program_name}</li>`;
      } else {
        applications_name += `<li>${msg.student_applications[i].programId.school} - ${msg.student_applications[i].programId.program_name}</li>`;
      }
    }
  }
  if (applications_name !== '') {
    applications_name += '</ul>';
  }

  const message = `\
<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.sender_firstname} ${msg.sender_lastname} has decided applications </p>

${applications_name}. 

<p>The relavant documents tasks are now assigned to you.</p>

<p>Please go to <a href="${CVMLRL_CENTER_URL}">CV ML RL Center</a> and see the new assigned tasks details for the applications above.</p>

<p>${TAIGER_SIGNATURE}</p>

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

// For editor, english only
const NewMLRLEssayTasksEmailFromTaiGer = async (recipient, msg) => {
  const subject = `${msg.sender_firstname} ${msg.sender_lastname} has updated application status and new tasks`;
  let applications_name = '';
  for (let i = 0; i < msg.student_applications.length; i += 1) {
    if (msg.new_app_decided_idx.includes(i)) {
      if (i === 0) {
        applications_name = `<ul><li>${msg.student_applications[i].programId.school} ${msg.student_applications[i].programId.program_name}</li>`;
      } else {
        applications_name += `<li>${msg.student_applications[i].programId.school} - ${msg.student_applications[i].programId.program_name}</li>`;
      }
    }
  }
  if (applications_name !== '') {
    applications_name += '</ul>';
  }

  const message = `\
<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.sender_firstname} ${msg.sender_lastname} has decided applications </p>

${applications_name}

<p>for ${msg.student_firstname} ${msg.student_lastname}. </p>

<p>The relavant documents tasks are now assigned to you.</p>

<p>Please go to <a href="${CVMLRL_CENTER_URL}">CV ML RL Center</a> and see the new assigned tasks details for the applications above.</p>

<p>${TAIGER_SIGNATURE}</p>

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const sendNewApplicationMessageInThreadEmail = async (recipient, msg) => {
  const thread_url = `${THREAD_URL}/${msg.thread_id}`;
  const subject = `[Update] ${msg.writer_firstname} ${msg.writer_lastname} sent a new message > ${msg.school} ${msg.program_name} ${msg.uploaded_documentname} / ${msg.writer_firstname} ${msg.writer_lastname} has a new update > ${msg.school} ${msg.program_name} ${msg.uploaded_documentname}!`;
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.writer_firstname} ${msg.writer_lastname} 對於 </p>

<p>${msg.student_firstname} - ${msg.student_lastname} ${msg.school} - ${msg.program_name} - ${msg.uploaded_documentname}</p>

<p>更新了訊息，於 ${msg.uploaded_updatedAt} 。</p>

<p>請至 TaiGer Portal <a href="${thread_url}">${msg.student_firstname} - ${msg.student_lastname} ${msg.school} - ${msg.program_name} - ${msg.uploaded_documentname}</a> 並查看新訊息。 </p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.writer_firstname} ${msg.writer_lastname} has a new update for </p>

<p>${msg.student_firstname} - ${msg.student_lastname} ${msg.school} - ${msg.program_name} - ${msg.uploaded_documentname}</p>

<p>on ${msg.uploaded_updatedAt}.</p>

<p>Please go to TaiGer Portal <a href="${thread_url}">${msg.student_firstname} - ${msg.student_lastname} ${msg.school} - ${msg.program_name} - ${msg.uploaded_documentname}</a> and check the updates. </p>

<p>${TAIGER_SIGNATURE}</p>

`;

  sendEmail(recipient, subject, message);
};

const sendNewGeneraldocMessageInThreadEmail = async (recipient, msg) => {
  const thread_url = `${THREAD_URL}/${msg.thread_id}`;
  const subject = `[Update] ${msg.writer_firstname} ${msg.writer_lastname} prodvides a new message > ${msg.student_firstname} ${msg.student_lastname} - ${msg.uploaded_documentname} / ${msg.writer_firstname} ${msg.writer_lastname} has new update for ${msg.student_firstname} ${msg.student_lastname} - ${msg.uploaded_documentname}!`;
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.writer_firstname} ${msg.writer_lastname} 給了一則新訊息： </p>

<p>${msg.student_firstname} - ${msg.student_lastname} ${msg.uploaded_documentname}</p>

<p>於 ${msg.uploaded_updatedAt}。</p>


<p>請至 TaiGer Portal <a href="${thread_url}">${msg.student_firstname} ${msg.student_lastname}  - ${msg.uploaded_documentname}</a> 並查看細節。</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.writer_firstname} ${msg.writer_lastname} has a new update for </p>

<p>${msg.student_firstname} - ${msg.student_lastname} ${msg.uploaded_documentname}</p>

<p>on ${msg.uploaded_updatedAt}.</p>

<p>Please go to TaiGer Portal <a href="${thread_url}">${msg.student_firstname} ${msg.student_lastname} - ${msg.uploaded_documentname}</a> and check the updates. </p>

<p>${TAIGER_SIGNATURE}</p>

`;

  sendEmail(recipient, subject, message);
};

const sendSetAsFinalGeneralFileForAgentEmail = async (recipient, msg) => {
  if (msg.isFinalVersion) {
    const subject = `[Close] ${msg.student_firstname} ${msg.student_lastname} ${msg.uploaded_documentname} 已完成 / ${msg.student_firstname} ${msg.student_lastname} ${msg.uploaded_documentname} is finished!`;
    const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.editor_firstname} ${msg.editor_lastname} 對於學生 ${
      msg.student_firstname
    } ${msg.student_lastname} 已標示 ${msg.uploaded_documentname} 為完成，

於 ${msg.uploaded_updatedAt}. </p>

<p>此文件已可以拿來作申請使用。 </p>

<p>請至 <a href="${CVMLRL_FOR_EDITOR_URL(
      msg.student_id
    )}">TaiGer Portal</a> 查看細節</p>

<p>如果您有任何問題，請聯絡您的文件編輯 Editor。</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.editor_firstname} ${msg.editor_lastname} have finalized ${
      msg.uploaded_documentname
    } </p>

<p>for student ${msg.student_firstname} ${msg.student_lastname} </p>

<p>on ${msg.uploaded_updatedAt}.</p>

<p>This document is ready for the application. </p>

<p>Please go to <a href="${CVMLRL_FOR_EDITOR_URL(
      msg.student_id
    )}">TaiGer Portal</a> for more details.</p>

<p>If you have any question, feel free to contact your editor.</p>

<p>${TAIGER_SIGNATURE}</p>

`;

    sendEmail(recipient, subject, message);
  } else {
    const subject = `${msg.student_firstname} ${msg.student_lastname} ${msg.uploaded_documentname} 未完成 / ${msg.student_firstname} ${msg.student_lastname} ${msg.uploaded_documentname} is not finished!`;
    const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

${msg.editor_firstname} ${msg.editor_lastname} 標示 ${
      msg.uploaded_documentname
    } 

為未完成。

<p>請至 <a href="${CVMLRL_FOR_EDITOR_URL(
      msg.student_id
    )}">TaiGer Portal</a> 查看細節。</p>

<p>如果您有任何問題，請聯絡您的文件編輯 Editor 或顧問。</p>

<br />

<p>${SPLIT_LINE}</p>
  
<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.editor_firstname} ${msg.editor_lastname} set ${
      msg.uploaded_documentname
    } 

as not finished.</p>

<p>Please go to ${CVMLRL_FOR_EDITOR_URL(msg.student_id)} for more details.</p>

<p>If you have any question, feel free to contact your editor.</p>

<p>${TAIGER_SIGNATURE}</p>

`;

    sendEmail(recipient, subject, message);
  }
};

const sendSetAsFinalGeneralFileForStudentEmail = async (recipient, msg) => {
  if (msg.isFinalVersion) {
    const subject = `您的文件 ${msg.uploaded_documentname} 已完成 / Your document ${msg.uploaded_documentname} is finished!`;
    const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.editor_firstname} ${msg.editor_lastname} 將 ${msg.uploaded_documentname} 列為已完成

於 ${msg.uploaded_updatedAt} 。</p>

<p>此文件已可以拿來作申請使用。 </p>

<p>請至 <a href="${CVMLRL_CENTER_URL}">CV ML RL Center</a> 查看細節</p>

<p>如果您有任何問題，請聯絡您的文件編輯 Editor。</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>your editor ${msg.editor_firstname} ${msg.editor_lastname} have finalized ${msg.uploaded_documentname} 

on ${msg.uploaded_updatedAt} for you.</p>

<p>This document is ready for the application. </p>

<p>Please go to <a href="${CVMLRL_CENTER_URL}">CV ML RL Center</a> for more details.</p>

<p>If you have any question, feel free to contact your editor.</p>

<p>${TAIGER_SIGNATURE}</p>

`;

    sendEmail(recipient, subject, message);
  } else {
    const subject = `您的文件 ${msg.uploaded_documentname} 未完成 / Your document ${msg.uploaded_documentname} is not finished!`;
    const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.editor_firstname} ${msg.editor_lastname} 標記 ${msg.uploaded_documentname} 

為未完成。 </p>

<p>請至 <a href="${CVMLRL_CENTER_URL}">CV ML RL Center</a> 查看細節</p>

<p>如果您有任何問題，請聯絡您的文件編輯 Editor。</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.editor_firstname} ${msg.editor_lastname} set ${msg.uploaded_documentname} 

as not finished.</p>

<p>Please go to <a href="${CVMLRL_CENTER_URL}">CV ML RL Center</a> for more details.</p>

<p>If you have any question, feel free to contact your editor.</p>

<p>${TAIGER_SIGNATURE}</p>

`;

    sendEmail(recipient, subject, message);
  }
};

const sendSetAsFinalProgramSpecificFileForStudentEmail = async (
  recipient,
  msg
) => {
  if (msg.isFinalVersion) {
    const subject = `您的文件 ${msg.uploaded_documentname} 已完成 / Your document ${msg.uploaded_documentname} is finished!`;
    const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.editor_firstname} ${msg.editor_lastname} 已完成</p>

<p>${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} 

於 ${msg.uploaded_updatedAt} </p>

<p>此份最終文件可以拿來作為申請。 </p>

<p>請至 <a href="${CVMLRL_CENTER_URL}">CV ML RL Center</a> 查看細節</p>

<p>如果您有任何問題，請聯絡您的文件編輯 Editor。</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.editor_firstname} ${msg.editor_lastname} have finalized

${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} 

on ${msg.uploaded_updatedAt} for you.</p>

This document is ready for the application. 

<p>Please go to <a href="${CVMLRL_CENTER_URL}">CV ML RL Center</a> for more details.</p>

<p>If you have any question, feel free to contact your editor.</p>

<p>${TAIGER_SIGNATURE}</p>

`;

    sendEmail(recipient, subject, message);
  } else {
    const subject = `您的文件 ${msg.uploaded_documentname} 未完成 / Your document ${msg.uploaded_documentname} is not finished!`;
    const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.editor_firstname} ${msg.editor_lastname} 將

${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} 

設為未完成。</p>

<p>請至 <a href="${CVMLRL_CENTER_URL}">CV ML RL Center</a> 查看細節</p>

<p>如果您有任何問題，請聯絡您的文件編輯 Editor。</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>your editor ${msg.editor_firstname} ${msg.editor_lastname} set

${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} 

as not finished.</p>

<p>Please go to <a href="${CVMLRL_CENTER_URL}">CV ML RL Center</a> for more details.</p>

<p>If you have any question, feel free to contact your editor.</p>

<p>${TAIGER_SIGNATURE}</p>

`;

    sendEmail(recipient, subject, message);
  }
};

const sendSetAsFinalProgramSpecificFileForAgentEmail = async (
  recipient,
  msg
) => {
  if (msg.isFinalVersion) {
    const subject = `${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} of ${msg.student_firstname} ${msg.student_lastname} 已完成 / ${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} of ${msg.student_firstname} ${msg.student_lastname} is finished!`;
    const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.editor_firstname} ${msg.editor_lastname} 已完成

${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} 於 ${
      msg.uploaded_updatedAt
    } 

給學生 ${msg.student_firstname} ${msg.student_lastname}.</p>

<p>請再次確認此文件，並確認是否可以結案此申請. </p>

<p>請至 <a href="${`${THREAD_URL}/${msg.thread_id}`}">${msg.school} - ${
      msg.program_name
    } ${msg.uploaded_documentname}</a>  查看細節。</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.editor_firstname} ${msg.editor_lastname} has finalized

${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} on ${
      msg.uploaded_updatedAt
    } 

for ${msg.student_firstname} ${msg.student_lastname}.</p>

<p>Double check this document and finalize the application if applicable. </p>

<p>Please go to <a href="${`${THREAD_URL}/${msg.thread_id}`}">${msg.school} - ${
      msg.program_name
    } ${msg.uploaded_documentname}</a> for more details.</p>

<p>${TAIGER_SIGNATURE}</p>

`;

    sendEmail(recipient, subject, message);
  } else {
    const subject = `${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} of ${msg.student_firstname} ${msg.student_lastname} 未完成 / ${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} of ${msg.student_firstname} ${msg.student_lastname} is not finished!`;
    const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.editor_firstname} ${msg.editor_lastname} 設

${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} 為未完成

於 ${msg.uploaded_updatedAt} 

給學生 ${msg.student_firstname} ${msg.student_lastname}.</p>

<p>請再次確認此文件，並確認是否可以結案此申請. </p>

<p>請至 <a href="${`${THREAD_URL}/${msg.thread_id}`}">${msg.school} - ${
      msg.program_name
    } ${msg.uploaded_documentname}</a> 查看細節。</p>

<br />

<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.editor_firstname} ${msg.editor_lastname} set

${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} as not finished

on ${msg.uploaded_updatedAt} for ${msg.student_firstname} ${
      msg.student_lastname
    }.</p>

<p>Double check this document and finalize the application if applicable. </p>

<p>Please go to <a href="${`${THREAD_URL}/${msg.thread_id}`}">${msg.school} - ${
      msg.program_name
    } ${msg.uploaded_documentname}</a> for more details.</p>

<p>${TAIGER_SIGNATURE}</p>

`;

    sendEmail(recipient, subject, message);
  }
};

// For editor, english only
const assignDocumentTaskToEditorEmail = async (recipient, msg) => {
  const subject = `[New Task] ${msg.student_firstname} ${msg.student_lastname} ${msg.documentname} is assigned to you!`;
  const THREAD_LINK = new URL(`/document-modification/${msg.thread_id}`, ORIGIN)
    .href;
  const message = `\
<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

${msg.student_firstname} ${msg.student_lastname} -  ${msg.documentname},

<p>is assigned to you </p>

<p>on ${msg.updatedAt}.</p>

<p>Please go to TaiGer Portal ${THREAD_LINK} and check the updates. </p>

<p>If you have any question, feel free to contact your editor.</p>

<p>${TAIGER_SIGNATURE}</p>

`;

  sendEmail(recipient, subject, message);
};

// TODO: kick-off email，請填寫 template
const assignDocumentTaskToStudentEmail = async (recipient, msg) => {
  const subject = `[新任務] ${recipient.firstname} ${recipient.lastname} ${msg.documentname} 指派給你 / [New Task] ${recipient.firstname} ${recipient.lastname} ${msg.documentname} is assigned to you!`;
  const THREAD_LINK = new URL(`/document-modification/${msg.thread_id}`, ORIGIN)
    .href;

  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>以下文件任務</p>

<p>${msg.documentname},

於 ${msg.updatedAt} 指派給你。</p>

<p>請至 TaiGer Template 下載中心 <a href="${TEMPLATE_DOWNLOAD_URL}">TaiGer Portal Download</a> 下載模板。</p>

<p>填寫好後並到 TaiGer Portal ${THREAD_LINK} 上傳填完的模板，讓您的 Editor 可以盡快開始修改您的文件。</p> 

<p>如果您有任何問題，請聯絡您的文件編輯 Editor 或顧問。</p>

<br />
<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.documentname},

is assigned to you 

on ${msg.updatedAt}.</p>

<p>Please go to <a href="${TEMPLATE_DOWNLOAD_URL}">TaiGer Portal Download</a> to download relavant template。</p>

<p>Fill the template and go to TaiGer Portal ${THREAD_LINK} and upate your filled template for editor's modification. </p>

<p>If you have any question, feel free to contact your editor.</p>

<p>${TAIGER_SIGNATURE}</p>

`;

  sendEmail(recipient, subject, message);
};

const AnalysedCoursesDataStudentEmail = async (recipient, msg) => {
  const subject = '課程匹配度分析成功 / Course data analysed successfully';
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>您的的課程匹配度已分析。</p>

<p>請至 <a href="${STUDENT_ANALYSED_COURSE_URL(
    msg.student_id
  )}">Courses</a> 查看細節。</p>

                  <p>
                    此份課程分析<b>僅供選課參考</b>
                    。請仔細看過每個向度所缺的課程，並對照學校之後學期是否有開期課程，抓出來，並和您的
                    Agent 討論。
                  </p>
<br />
<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>Your courses data has been analysed successfully!</p>

<p>Please go to <a href="${STUDENT_ANALYSED_COURSE_URL(
    msg.student_id
  )}">Courses</a> for more details.</p>
                  <p>
                    The course analysis provided is for
                    <b>reference purposes only</b>. Please carefully review the
                    courses missing in each category and cross-reference
                    whether your university offers those courses in the upcoming
                    semesters. Once you have identified them, discuss with your
                    Agent.
                  </p>
<p>${TAIGER_SIGNATURE}</p>

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const updateCoursesDataAgentEmail = async (recipient, msg) => {
  const subject = '課程更新成功 / Course data updated successfully';
  const message = `\
<p>${ENGLISH_BELOW}</p>

<p>嗨 ${recipient.firstname} ${recipient.lastname},</p>

<p>${msg.student_firstname} ${msg.student_lastname}的課程資料已更新成功。</p>

<p>請至 <a href="${STUDENT_COURSE_URL(
    msg.student_id
  )}">Courses</a> 查看細節。</p>

<br />
<p>${SPLIT_LINE}</p>

<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>You have updated your course data successfully!</p>

<p>Please go to <a href="${STUDENT_COURSE_URL(
    msg.student_id
  )}">Courses</a> for more details.</p>

<p>${TAIGER_SIGNATURE}</p>

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const sendSomeReminderEmail = async (recipient) => {
  const subject = 'File Status changes';
  const message = `\
<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

Some reminder email template.

<p>${TAIGER_SIGNATURE}</p>

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const sendAssignEditorReminderEmail = async (recipient, payload) => {
  const subject = '[DO NOT IGNORE] Assign Editor Reminder';
  const message = `\
<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p>${payload.student_firstname} - ${
    payload.student_lastname
  } has uploaded some input in his/her CVMLRL Center, <b>but she/he did not have any Editor yet.</b></p>

<p><b>Please assign an Editor to the student <a href="${BASE_DOCUMENT_FOR_AGENT_URL(
    payload.student_id
  )}">${payload.student_firstname} - ${payload.student_lastname}</a></b></p>

<br />
<p>${SPLIT_LINE}</p>

<p>${payload.student_firstname} - ${
    payload.student_lastname
  } 上傳了一份文件至他的 CVMLRL Cetner，但他目前並無任何Editor。</p>

<p><b>請指派 Editor 給學生 <a href="${BASE_DOCUMENT_FOR_AGENT_URL(
    payload.student_id
  )}">${payload.student_firstname} - ${payload.student_lastname}</a></b></p>
<br />
<p>${TAIGER_SIGNATURE}</p>

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const sendAgentNewMessageReminderEmail = async (recipient, payload) => {
  const subject = `[New Message] ${payload.student_firstname} - ${payload.student_lastname}`;
  const message = `\
<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p><b>${payload.student_firstname} - ${
    payload.student_lastname
  } sent new message(s)</b></p>

<p><b>Please go to student's communication <a href="${STUDENT_COMMUNICATION_THREAD_URL(
    payload.student_id
  )}">${payload.student_firstname} - ${payload.student_lastname}</a></b></p>

<p>${SPLIT_LINE}</p>

<p>${payload.student_firstname} - ${
    payload.student_lastname
  } 傳了一則新訊息。</p>

<p><b>請至學生討論串 <a href="${STUDENT_COMMUNICATION_THREAD_URL(
    payload.student_id
  )}">${payload.student_firstname} - ${payload.student_lastname}</a></b></p>
<br />
<p>${TAIGER_SIGNATURE}</p>

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const sendStudentNewMessageReminderEmail = async (recipient, payload) => {
  const subject = `[New Message] ${recipient.firstname} ${recipient.lastname}`;
  const message = `\
<p>Hi ${recipient.firstname} ${recipient.lastname},</p>

<p><b>${payload.taiger_user_firstname} - ${
    payload.taiger_user_lastname
  } sent you new message(s)</b></p>

<p><b>Please go to my <a href="${STUDENT_COMMUNICATION_THREAD_URL(
    payload.student_id
  )}">Communication</a></b></p>

<p>${SPLIT_LINE}</p>

<p>${payload.taiger_user_firstname} - ${
    payload.taiger_user_lastname
  } 留了新訊息給你。</p>

<p><b>請至學生討論串 <a href="${STUDENT_COMMUNICATION_THREAD_URL(
    payload.student_id
  )}">Communication</a></b></p>
<br />
<p>${TAIGER_SIGNATURE}</p>

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

module.exports = {
  verifySMTPConfig,
  updateNotificationEmail,
  updatePermissionNotificationEmail,
  sendEmail,
  deleteTemplateSuccessEmail,
  uploadTemplateSuccessEmail,
  sendInvitationReminderEmail,
  sendInvitationEmail,
  sendConfirmationEmail,
  sendForgotPasswordEmail,
  sendPasswordResetEmail,
  sendAccountActivationConfirmationEmail,
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
  informEditorArchivedStudentEmail,
  informStudentArchivedStudentEmail,
  informStudentTheirEditorEmail,
  createApplicationToStudentEmail,
  AnalysedCoursesDataStudentEmail,
  updateCoursesDataAgentEmail,
  sendAssignEditorReminderEmail,
  sendAgentNewMessageReminderEmail,
  sendStudentNewMessageReminderEmail
};
