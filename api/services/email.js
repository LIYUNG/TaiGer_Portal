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
const SPLIT_LINE = '-------------------------------------------------------';
const ENGLISH_BELOW = '(English version below)';
const CONTACT_AGENT = '如果您有任何疑問，請聯絡您的顧問。';

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
  const subject =
    '您的TaiGer Portal使用者權限已更新 / Your user role in TaiGer Portal updated';
  const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname},

您的 TaiGer Portal 使用者權限已更新。

請至 ${SETTINGS_URL} 確認使用者身分角色。

${TAIGER_SIGNATURE}

${SPLIT_LINE}

Hi ${recipient.firstname} ${recipient.lastname},

Your user role in TaiGer Portal has been changed.

Please visit ${SETTINGS_URL} and make sure your user role.

${TAIGER_SIGNATURE}

`;

  return sendEmail(recipient, subject, message);
};

const uploadTemplateSuccessEmail = async (recipient, msg) => {
  const subject = `Template ${msg.category_name} uploaded successfully!`;
  const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname},

${msg.category_name} 模板已成功上傳於

 ${msg.updatedAt}

更多細節請至 ${TEMPLATE_DOWNLOAD_URL}

${TAIGER_SIGNATURE}

${SPLIT_LINE}

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
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname},

${msg.category_name} 模板已成功刪除於

 ${msg.updatedAt}

更多細節請至 ${TEMPLATE_DOWNLOAD_URL}

${TAIGER_SIGNATURE}

${SPLIT_LINE}

Hi ${recipient.firstname} ${recipient.lastname},

the template ${msg.category_name} is deleted sucessfully on

 ${msg.updatedAt}

For more details, please visit: ${TEMPLATE_DOWNLOAD_URL}

${TAIGER_SIGNATURE}

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
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname},

您的 TaiGer Portal 帳戶已被建立。
請使用以下連結來啟用您的帳戶：

${activationLink}

此連結將於 20 分鐘後失效。

但您仍可再次請求啟用連結於： ${RESEND_ACTIVATION_URL}

${TAIGER_SIGNATURE}

${SPLIT_LINE}

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
  const subject =
    'TaiGer Portal 密碼重設指示 / TaiGer Portal Password reset instructions';
  const passwordResetLink = queryString.stringifyUrl({
    url: PASSWORD_RESET_URL,
    query: { email: recipient.address, token }
  });
  const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname},

請用以下連結重新設定您的 TaiGer Portal 密碼：

${passwordResetLink}

此連結將於 20 分鐘後失效。

但您仍可再次請求密碼重設連結於： ${FORGOT_PASSWORD_URL}

${TAIGER_SIGNATURE}

${SPLIT_LINE}

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
  const subject =
    'TaiGer Portal 密碼重設成功 / TaiGer Portal Password reset successfully';
  const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname},

您的 TaiGer Portal 密碼已成功被更新，您現在可以使用新密碼登入 TaiGer Portl。

TaiGer portal: ${ORIGIN}

${TAIGER_SIGNATURE}

${SPLIT_LINE}

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
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname},

您的 TaiGer Portal 帳戶已成功開通。

您現在可以登入並開始使用 TaiGer Portal。

TaiGer Portal 連結： ${ORIGIN}

${TAIGER_SIGNATURE}

${SPLIT_LINE}

Hi ${recipient.firstname} ${recipient.lastname},

Your TaiGer Portal Account has been successfully activated.

You can now login and explore the power of TaiGer Portal!

TaiGer Portal: ${ORIGIN}

${TAIGER_SIGNATURE}

`;

  return sendEmail(recipient, subject, message);
};

const sendUploadedProfileFilesEmail = async (recipient, msg) => {
  const subject = `您的 ${msg.uploaded_documentname} 已成功上傳！ / Your ${msg.uploaded_documentname} is successfully uploaded!`;
  const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

您已於 ${msg.uploaded_updatedAt} 成功上傳

${msg.uploaded_documentname} 。

您的顧問將會盡快瀏覽這份文件並給您意見回饋。

有任何更新，請至 ${BASE_DOCUMENT_URL} 查看細節。

${TAIGER_SIGNATURE}

${SPLIT_LINE}

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
${ENGLISH_BELOW}

Hi ${recipient.firstname} ${recipient.lastname}, 

您已於 ${msg.uploaded_updatedAt} 成功上傳

${msg.uploaded_documentname} 。

有任何 VPD 更新，請至 ${UNI_ASSIST_FOR_STUDENT_URL}

${TAIGER_SIGNATURE}

${SPLIT_LINE}

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
${ENGLISH_BELOW}

Hi ${recipient.firstname} ${recipient.lastname}, 

您的顧問 ${msg.agent_firstname} ${msg.agent_lastname} 已幫您上傳 ${msg.uploaded_documentname} 

於 ${msg.uploaded_updatedAt} 。

請至 ${BASE_DOCUMENT_URL} 並查看細節。

${CONTACT_AGENT}

${TAIGER_SIGNATURE}

${SPLIT_LINE}

Hi ${recipient.firstname} ${recipient.lastname}, 

your agent ${msg.agent_firstname} ${msg.agent_lastname} have uploaded ${msg.uploaded_documentname} on ${msg.uploaded_updatedAt} for you.

Please go to ${BASE_DOCUMENT_URL} and see the details.

If you have any question, feel free to contact your agent.

${TAIGER_SIGNATURE}

`;

  return sendEmail(recipient, subject, message);
};

const sendAgentUploadedVPDForStudentEmail = async (recipient, msg) => {
  const subject = '您的 VPD 已成功上傳 / Your VPD is successfully uploaded!';
  const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

您的顧問 ${msg.agent_firstname} ${msg.agent_lastname} 已幫您上傳 ${msg.uploaded_documentname} 

於${msg.uploaded_updatedAt} 。

請至 ${UNI_ASSIST_FOR_STUDENT_URL} 並查看細節。

${CONTACT_AGENT}

${TAIGER_SIGNATURE}

${SPLIT_LINE}

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
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

您的學生 ${msg.student_firstname} ${msg.student_lastname} 上傳了 ${
    msg.uploaded_documentname
  }

於 ${msg.uploaded_updatedAt} 。

請至 ${BASE_DOCUMENT_FOR_AGENT_URL(msg.student_id)} 確認細節。

${TAIGER_SIGNATURE}

${SPLIT_LINE}

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
  const subject = `新 VPD 上傳從 ${msg.student_firstname} ${msg.student_lastname} / New VPD uploaded from ${msg.student_firstname} ${msg.student_lastname}`;
  const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

您的學生 ${msg.student_firstname} ${msg.student_lastname} 上傳了 ${
    msg.uploaded_documentname
  }

在 ${msg.uploaded_updatedAt}.

請至 ${UNI_ASSIST_FOR_AGENT_URL(msg.student_id)} 確認細節。

${TAIGER_SIGNATURE}

${SPLIT_LINE}

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
    subject = `文件狀態更新：請再次上傳 ${msg.category} / File Status changes: please upload ${msg.category} again`;
    message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

由於下列原因, 請再次上傳 ${msg.category}:

${msg.message}


請至 ${BASE_DOCUMENT_URL} 確認細節。

如果有任何疑問，請聯絡您的顧問。 

${TAIGER_SIGNATURE}

${SPLIT_LINE}

Hi ${recipient.firstname} ${recipient.lastname}, 

due to the following reason, please upload ${msg.category} again:

${msg.message}


Please go to ${BASE_DOCUMENT_URL} and see the details.

If you have any question, please contact your agent. 

${TAIGER_SIGNATURE}

`; // should be for student
  } else {
    subject = `文件狀態更新：${msg.category} 合格 / File Status changes: ${msg.category} is valid`;
    message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

您的顧問已經看過您上傳的文件 ${msg.category}，文字清楚、無資訊遺漏

並且該文件可以拿來做為申請!

請至 ${BASE_DOCUMENT_URL} 並再次確認。

${TAIGER_SIGNATURE}

${SPLIT_LINE}

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
  const subject = `新學生 ${msg.std_firstname} ${msg.std_lastname} 已被指派給您 / New student ${msg.std_firstname} ${msg.std_lastname} assigned to you`;
  const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

${msg.std_firstname} ${msg.std_lastname} 將被指配給您。

請至 ${STUDENT_BACKGROUND_FOR_AGENT_URL(
    msg.std_id
  )} 查看他的背景問卷並與她/他打聲招呼！

${TAIGER_SIGNATURE}

${SPLIT_LINE}

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
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

${agent} 將會是您的顧問。

請至 ${ORIGIN} 並開始準備您的文件。

${TAIGER_SIGNATURE}

${SPLIT_LINE}

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
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

${editor} 將會是您的外語文件編輯，她/他會輔助您完成您的動機信、推薦信、個人履歷。

請至 ${ORIGIN} 開始準備您的第一份文件吧！

${TAIGER_SIGNATURE}

${SPLIT_LINE}

Hi ${recipient.firstname} ${recipient.lastname}, 

${editor} will be your editor!

Please go to ${ORIGIN} , and prepare your first documents!

${TAIGER_SIGNATURE}

`;

  return sendEmail(recipient, subject, message);
};

const createApplicationToStudentEmail = async (recipient, msg) => {
  const subject = '新的建議申請學程指派給您 / New Programs assigned to you.';
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
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

${msg.agent_firstname} ${msg.agent_lastname} 顧問指派建議的學校學程給您：


${programList}


請至 ${STUDENT_APPLICATION_URL} 查看細節並選擇是否決定要申請 (Decided: Yes / No)。

${TAIGER_SIGNATURE}

${SPLIT_LINE}

Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.agent_firstname} ${msg.agent_lastname} has assigned programs for you:


${programList}


Please go to ${STUDENT_APPLICATION_URL} and mark it as decided if these programs look good to you.

${TAIGER_SIGNATURE}

`;

  return sendEmail(recipient, subject, message);
};

const updateAcademicBackgroundEmail = async (recipient) => {
  const subject =
    'TaiGer Portal 學術背景更新成功！ TaiGer Portal Academic Background updated successfully!';
  const message = `\
${ENGLISH_BELOW}

Hi ${recipient.firstname} ${recipient.lastname}, 

您已成功更新您的學術背景資訊！

若有新的資訊，請再次到 ${STUDENT_SURVEY_URL} 更新資訊。

${TAIGER_SIGNATURE}

${SPLIT_LINE}

Hi ${recipient.firstname} ${recipient.lastname}, 

You have updated your academic background information successfully!

If there is nw update, please go to ${STUDENT_SURVEY_URL} and synchronize the information.

${TAIGER_SIGNATURE}

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const updateLanguageSkillEmail = async (recipient) => {
  const subject =
    '語言能力與檢定資訊更新成功 / Language skills updated successfully';
  const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

您已成功更新您的語言能力資訊與檢定！

若有新的資訊，如考過檢定、或是知道新的考試時間，請再次到 ${STUDENT_SURVEY_URL} 更新資訊。

${TAIGER_SIGNATURE}

${SPLIT_LINE}

Hi ${recipient.firstname} ${recipient.lastname}, 

You have updated your Language skills information successfully!

If there is nw update (for example: languages test passed or new test date registered) 

please go to ${STUDENT_SURVEY_URL} and synchronize the information.

${TAIGER_SIGNATURE}

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const updateLanguageSkillEmailFromTaiGer = async (recipient, msg) => {
  const subject =
    '語言能力與檢定資訊更新成功 /Language skills updated successfully';
  const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

${msg.sender_firstname} ${msg.sender_lastname} 成功更新您的語言能力與檢定資訊與檢定。

若有新的資訊，如考過檢定、或是知道新的考試時間，請再次到 ${STUDENT_SURVEY_URL} 更新語言檢定資訊。

${TAIGER_SIGNATURE}

${SPLIT_LINE}

Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.sender_firstname} ${msg.sender_lastname} updated your Language skills information successfully!

Please double check in ${STUDENT_SURVEY_URL} 

${TAIGER_SIGNATURE}

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const updateApplicationPreferenceEmail = async (recipient) => {
  const subject =
    '申請學程偏好資訊更新成功 / Application preference updated successfully';
  const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

您成功更新您的申請偏好資訊。

若有更新，請至 ${STUDENT_SURVEY_URL} 

${TAIGER_SIGNATURE}

${SPLIT_LINE}

Hi ${recipient.firstname} ${recipient.lastname}, 

You have updated your application preference information successfully!

If there is new update, please go to ${STUDENT_SURVEY_URL} 

${TAIGER_SIGNATURE}

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const updatePersonalDataEmail = async (recipient, msg) => {
  const subject = '個人基本資料更新成功 / Personal data updated successfully';
  const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

您的個人基本資料已更新成功。

請至 ${SETTINGS_URL} 查看細節。

${TAIGER_SIGNATURE}

${SPLIT_LINE}

Hi ${recipient.firstname} ${recipient.lastname}, 

You have updated your personal data successfully!

Please double check in ${SETTINGS_URL} 

${TAIGER_SIGNATURE}

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const updateCredentialsEmail = async (recipient, msg) => {
  const subject =
    'TaiGer Portal 密碼更新成功 / TaiGer Portal passwords updated successfully';
  const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

您已成功更新您的 TaiGer Portal 密碼。

請使用您的新密碼登入 TaiGer Portal： ${ORIGIN} 

${TAIGER_SIGNATURE}

${SPLIT_LINE}

Hi ${recipient.firstname} ${recipient.lastname}, 

You have updated your passwords successfully!

Please make sure you can login in ${ORIGIN} 

${TAIGER_SIGNATURE}

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};

const UpdateStudentApplicationsEmail = async (recipient, msg) => {
  const subject = `${msg.sender_firstname} ${msg.sender_lastname} 更新了申請學校資訊並完成任務 / ${msg.sender_firstname} ${msg.sender_lastname} has updated application status and created new tasks`;
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
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname},

${msg.sender_firstname} ${msg.sender_lastname} 更新了是否申請的學程狀態。

請至 ${STUDENT_APPLICATION_URL} 查看細節。

並且到 ${CVMLRL_CENTER_URL} 查看對於上述申請學程的新指派的文件任務細節。

${TAIGER_SIGNATURE}

${SPLIT_LINE}

Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.sender_firstname} ${msg.sender_lastname} has updated or declined some applications.

Please go to ${STUDENT_APPLICATION_URL} and see details.

Also go to ${CVMLRL_CENTER_URL} and see the new assigned tasks details for the applications above.

${TAIGER_SIGNATURE}

`; // should be for admin/editor/agent/student

    return sendEmail(recipient, subject, message);
  }

  const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

${msg.sender_firstname} ${msg.sender_lastname} 更新了您以下學程的申請狀態：

${applications_name}



請至 ${STUDENT_APPLICATION_URL} 並查看細節。

並且到 ${CVMLRL_CENTER_URL} 查看對於上述申請學程的新指派的文件任務細節。

${TAIGER_SIGNATURE}

${SPLIT_LINE}

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

// For Editor. English only
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

// For editor, english only
const NewMLRLEssayTasksEmailFromTaiGer = async (recipient, msg) => {
  const subject = `${msg.sender_firstname} ${msg.sender_lastname} has updated application status and new tasks`;
  let applications_name = '';
  for (let i = 0; i < msg.student_applications.length; i += 1) {
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
  const subject = `[Update] ${msg.writer_firstname} ${msg.writer_lastname} 新增了訊息 > ${msg.school} ${msg.program_name} ${msg.uploaded_documentname} / ${msg.writer_firstname} ${msg.writer_lastname} has a new update > ${msg.school} ${msg.program_name} ${msg.uploaded_documentname}!`;
  const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

${msg.writer_firstname} ${msg.writer_lastname} 對於 

${msg.school} - ${msg.program_name} - ${msg.uploaded_documentname}

更新了訊息，於 ${msg.uploaded_updatedAt} 。


請至 TaiGer Portal ${thread_url} 並查看新訊息。 

${TAIGER_SIGNATURE}

${SPLIT_LINE}

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
  const subject = `[Update] ${msg.writer_firstname} ${msg.writer_lastname} 給了了新訊息 > ${msg.uploaded_documentname} / ${msg.writer_firstname} ${msg.writer_lastname} has new update for ${msg.uploaded_documentname}!`;
  const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

${msg.writer_firstname} ${msg.writer_lastname} 給了一則新訊息： 

${msg.uploaded_documentname}

於 ${msg.uploaded_updatedAt}。


請至 TaiGer Portal ${thread_url} 並查看細節。

${TAIGER_SIGNATURE}

${SPLIT_LINE}

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
    const subject = `[Close] ${msg.student_firstname} ${msg.student_lastname} ${msg.uploaded_documentname} 已完成 / ${msg.student_firstname} ${msg.student_lastname} ${msg.uploaded_documentname} is finished!`;
    const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

${msg.editor_firstname} ${msg.editor_lastname} 對於學生 ${
      recipient.firstname
    } ${recipient.lastname} 已標示 ${msg.uploaded_documentname} 為完成。

於 ${msg.uploaded_updatedAt}.

此文件已可以拿來作申請使用。 

請至 ${CVMLRL_FOR_EDITOR_URL(msg.student_id)} 查看細節

如果您有任何問題，請聯絡您的文件編輯 Editor。

${TAIGER_SIGNATURE}

${SPLIT_LINE}

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
    const subject = `${msg.student_firstname} ${msg.student_lastname} ${msg.uploaded_documentname} 未完成 / ${msg.student_firstname} ${msg.student_lastname} ${msg.uploaded_documentname} is not finished!`;
    const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

${msg.editor_firstname} ${msg.editor_lastname} 標示 ${
      msg.uploaded_documentname
    } 

為未完成。

請至 ${CVMLRL_FOR_EDITOR_URL(msg.student_id)} 查看細節。

如果您有任何問題，請聯絡您的文件編輯 Editor 或顧問。

${TAIGER_SIGNATURE}

${SPLIT_LINE}
  
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
    const subject = `您的文件 ${msg.uploaded_documentname} 已完成 / Your document ${msg.uploaded_documentname} is finished!`;
    const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

${msg.editor_firstname} ${msg.editor_lastname} 將 ${msg.uploaded_documentname} 列為已完成

於 ${msg.uploaded_updatedAt} 。

此文件已可以拿來作申請使用。 

請至${CVMLRL_CENTER_URL} 查看細節

如果您有任何問題，請聯絡您的文件編輯 Editor。

${TAIGER_SIGNATURE}

${SPLIT_LINE}

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
    const subject = `您的文件 ${msg.uploaded_documentname} 未完成 / Your document ${msg.uploaded_documentname} is not finished!`;
    const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

${msg.editor_firstname} ${msg.editor_lastname} 標記 ${msg.uploaded_documentname} 

為未完成。 

請至 ${CVMLRL_CENTER_URL} 查看細節

如果您有任何問題，請聯絡您的文件編輯 Editor。

${TAIGER_SIGNATURE}

${SPLIT_LINE}

Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.editor_firstname} ${msg.editor_lastname} set ${msg.uploaded_documentname} 

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
    const subject = `您的文件 ${msg.uploaded_documentname} 已完成 / Your document ${msg.uploaded_documentname} is finished!`;
    const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

${msg.editor_firstname} ${msg.editor_lastname} 已完成

${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} 

於 ${msg.uploaded_updatedAt} 

此份最終文件可以拿來作為申請。 

請至 ${CVMLRL_CENTER_URL} 查看細節

如果您有任何問題，請聯絡您的文件編輯 Editor。

${TAIGER_SIGNATURE}

${SPLIT_LINE}

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
    const subject = `您的文件 ${msg.uploaded_documentname} 未完成 / Your document ${msg.uploaded_documentname} is not finished!`;
    const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

${msg.editor_firstname} ${msg.editor_lastname} 將

${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} 

設為未完成。

請至 ${CVMLRL_CENTER_URL} 查看細節

如果您有任何問題，請聯絡您的文件編輯 Editor。

${TAIGER_SIGNATURE}

${SPLIT_LINE}

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
    const subject = `${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} of ${msg.student_firstname} ${msg.student_lastname} 已完成 / ${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} of ${msg.student_firstname} ${msg.student_lastname} is finished!`;
    const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

${msg.editor_firstname} ${msg.editor_lastname} 已完成

${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} 於 ${
      msg.uploaded_updatedAt
    } 

給學生 ${msg.student_firstname} ${msg.student_lastname}.

請再次確認此文件，並確認是否可以結案此申請. 

請至 ${CVMLRL_FOR_EDITOR_URL(msg.student_id)} 查看細節。

${TAIGER_SIGNATURE}

${SPLIT_LINE}

Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.editor_firstname} ${msg.editor_lastname} has finalized

${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} on ${
      msg.uploaded_updatedAt
    } 

for ${msg.student_firstname} ${msg.student_lastname}.

Double check this document and finalize the application if applicable. 

Please go to ${CVMLRL_FOR_EDITOR_URL(msg.student_id)} for more details.

${TAIGER_SIGNATURE}

`;

    sendEmail(recipient, subject, message);
  } else {
    const subject = `${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} of ${msg.student_firstname} ${msg.student_lastname} 未完成 / ${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} of ${msg.student_firstname} ${msg.student_lastname} is not finished!`;
    const message = `\
${ENGLISH_BELOW}

嗨 ${recipient.firstname} ${recipient.lastname}, 

${msg.editor_firstname} ${msg.editor_lastname} 設

${msg.school} - ${msg.program_name} ${msg.uploaded_documentname} 為未完成

於 ${msg.uploaded_updatedAt} 

給學生 ${msg.student_firstname} ${msg.student_lastname}.

請再次確認此文件，並確認是否可以結案此申請. 

請至 ${CVMLRL_FOR_EDITOR_URL(msg.student_id)} 查看細節。

${TAIGER_SIGNATURE}

${SPLIT_LINE}

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

// For editor, english only
const assignDocumentTaskToEditorEmail = async (recipient, msg) => {
  const subject = `[New Task] ${msg.student_firstname} ${msg.student_lastname} ${msg.documentname} is assigned to you!`;
  const THREAD_LINK = new URL(`/document-modification/${msg.thread_id}`, ORIGIN)
    .href;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.student_firstname} ${msg.student_lastname} -  ${msg.documentname},

is assigned to you 

on ${msg.updatedAt}.


Please go to TaiGer Portal ${THREAD_LINK} and check the updates. 

If you have any question, feel free to contact your editor.

${TAIGER_SIGNATURE}

`;

  sendEmail(recipient, subject, message);
};

// TODO: kick-off email，請填寫 template
const assignDocumentTaskToStudentEmail = async (recipient, msg) => {
  const subject = `[新任務] ${recipient.firstname} ${recipient.lastname} ${msg.documentname} 指派給你 / [New Task] ${recipient.firstname} ${recipient.lastname} ${msg.documentname} is assigned to you!`;
  const THREAD_LINK = new URL(`/document-modification/${msg.thread_id}`, ORIGIN)
    .href;

  const message = `\
${ENGLISH_BELOW}

Hi ${recipient.firstname} ${recipient.lastname}, 

以下文件任務

${msg.documentname},

於 ${msg.updatedAt} 指派給你。

請至 TaiGer Template 下載中心 ${TEMPLATE_DOWNLOAD_URL} 下載模板。

填寫好後並到 TaiGer Portal ${THREAD_LINK} 上傳填完的模板，讓您的 Editor 可以盡快開始修改您的文件。 

如果您有任何問題，請聯絡您的文件編輯 Editor 或顧問。

${TAIGER_SIGNATURE}

${SPLIT_LINE}

Hi ${recipient.firstname} ${recipient.lastname}, 

${msg.documentname},

is assigned to you 

on ${msg.updatedAt}.

Please go to TaiGer Template Download Center ${TEMPLATE_DOWNLOAD_URL} to download relavant template。

Fill the template and go to TaiGer Portal ${THREAD_LINK} and upate your filled template for editor's modification. 

If you have any question, feel free to contact your editor.

${TAIGER_SIGNATURE}

`;

  sendEmail(recipient, subject, message);
};

const StudentTasksReminderEmail = async (recipient, payload) => {
  const subject = `TaiGer Student Reminder: ${recipient.firstname} ${recipient.lastname}`;
  let application_task;
  for (let i = 0; i < payload.student.applications.length; i += 1) {
    if (i === 0) {
      application_task =
        payload.student.applications[i].programId.school +
        ' ' +
        payload.student.applications[i].programId.program_name +
        ' ' +
        payload.student.applications[i].closed;
    } else {
      application_task += `

        ${payload.student.applications[i].programId.school} - ${payload.student.applications[i].programId.program_name}  ${payload.student.applications[i].closed}`;
    }
  }
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

Some student reminder email template.
${application_task}
${TAIGER_SIGNATURE}

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};
const AgentTasksReminderEmail = async (recipient, payload) => {
  const subject = `TaiGer Agent Reminder: ${recipient.firstname} ${recipient.lastname}`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

Some agent reminder email template.

${payload.students[0].firstname}

${TAIGER_SIGNATURE}

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
};
const EditorTasksReminderEmail = async (recipient, payload) => {
  const subject = `TaiGer Editor Reminder: ${recipient.firstname} ${recipient.lastname}`;
  const message = `\
Hi ${recipient.firstname} ${recipient.lastname}, 

Some editor reminder email template.

${TAIGER_SIGNATURE}

`; // should be for admin/editor/agent/student

  return sendEmail(recipient, subject, message);
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
  createApplicationToStudentEmail,
  StudentTasksReminderEmail,
  AgentTasksReminderEmail,
  EditorTasksReminderEmail
};
