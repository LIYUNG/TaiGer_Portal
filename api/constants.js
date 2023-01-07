const { ORIGIN } = require('./config');

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
const SURVEY_URL_FOR_AGENT_URL = (studentId) =>
  new URL(`/student-database/${studentId}/background`, ORIGIN).href;
const SETTINGS_URL = new URL('/settings', ORIGIN).href;

const STUDENT_BACKGROUND_FOR_AGENT_URL = (studentId) =>
  new URL(`/student-database/${studentId}/background`, ORIGIN).href;

const TAIGER_SIGNATURE = '<p>Your TaiGer Consultancy Team</p>';
// const TAIGER_SIGNATURE = `<p>Your TaiGer Consultancy Team</p><p>Website: <a href="https://taigerconsultancy.com/">https://taigerconsultancy.com/</a></p>\
//   <p>Facebook: <a href="https://www.facebook.com/profile.php?id=100063557155189">https://www.facebook.com/profile.php?id=100063557155189</a></p>`;
const SPLIT_LINE = '-------------------------------------------------------';
const ENGLISH_BELOW = '(English version below)';
const CONTACT_AGENT = '如果您有任何疑問，請聯絡您的顧問。';

const DocumentStatus = {
  Uploaded: 'uploaded',
  Missing: 'missing',
  Accepted: 'accepted',
  Rejected: 'rejected',
  NotNeeded: 'notneeded'
};

const CheckListStatus = {
  NotStarted: 'notstarted',
  Processing: 'processing',
  Finished: 'finished',
  NotNeeded: 'notneeded'
};

const getNumberOfDays = (start, end) => {
  const date1 = new Date(start);
  const date2 = new Date(end);

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Calculating the time difference between two dates
  const diffInTime = date2.getTime() - date1.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay);

  return diffInDays.toString();
};

const TaskStatus = {
  Finished: 'finished',
  Locked: 'locked',
  Open: 'Open',
  Pending: 'pending',
  NotNeeded: 'notneeded'
};
const RLs_CONSTANT = ['RL_A', 'RL_B', 'RL_C'];

const profile_list = {
  High_School_Diploma: 'High School Diploma',
  High_School_Transcript: 'High School Transcript',
  University_Entrance_Examination_GSAT: 'GSAT/SAT (學測)',
  Bachelor_Certificate: 'Bachelor Certificate',
  Bachelor_Transcript: 'Bachelor Transcript',
  Englisch_Certificate: 'TOEFL or IELTS',
  German_Certificate: 'TestDaF or Goethe-B2/C1',
  GREGMAT: 'GRE or GMAT',
  ECTS_Conversion: 'ECTS Conversion',
  Course_Description: 'Course Description',
  Internship: 'Internship Certificate',
  Employment_Certificate: 'Employment Certificate',
  Passport_Photo: 'Passport Photo',
  Passport: 'Passport Copy',
  Others: 'Others'
};

const unsubmitted_applications_summary = (student) => {
  let unsubmitted_applications = '';
  let x = 0;
  for (let i = 0; i < student.applications.length; i += 1) {
    if (student.applications[i].closed !== 'O') {
      if (x === 0) {
        unsubmitted_applications = `
        The follow program are not submitted yet: 
        <ul>
        <li>${student.applications[i].programId.school} ${student.applications[i].programId.program_name}</li>`;
        x += 1;
      } else {
        unsubmitted_applications += `<li>${student.applications[i].programId.school} - ${student.applications[i].programId.program_name}</li>`;
      }
    }
  }
  if (unsubmitted_applications !== '') {
    unsubmitted_applications += '</ul>';
    unsubmitted_applications += `<p>If there is any updates, please go to <a href="${STUDENT_APPLICATION_URL}">Applications Overview</a> and update them.</p>`;
  }
  return unsubmitted_applications;
};

const cv_ml_rl_unfinished_summary = (student, user) => {
  let missing_doc_list = '';
  let kk = 0;
  for (let i = 0; i < student.applications.length; i += 1) {
    for (
      let j = 0;
      j < student.applications[i].doc_modification_thread.length;
      j += 1
    ) {
      if (user.role === 'Editor') {
        if (
          !student.applications[i].doc_modification_thread[j].isFinalVersion &&
          student.applications[i].doc_modification_thread[j]
            .latest_message_left_by_id !== '' &&
          student.applications[i].doc_modification_thread[j]
            .latest_message_left_by_id !== user._id.toString()
        ) {
          if (kk === 0) {
            missing_doc_list = `
        The following documents are waiting for your response, please reply it as soon as possible:
        <ul>
        <li><a href="${THREAD_URL}/${student.applications[
              i
            ].doc_modification_thread[j].doc_thread_id._id.toString()}">${
              student.applications[i].programId.school
            } ${student.applications[i].programId.program_name} ${
              student.applications[i].doc_modification_thread[j].doc_thread_id
                .file_type
            }</a></li>`;
            kk += 1;
          } else {
            missing_doc_list += `<li><a href="${THREAD_URL}/${student.applications[
              i
            ].doc_modification_thread[j].doc_thread_id._id.toString()}">${
              student.applications[i].programId.school
            } ${student.applications[i].programId.program_name} ${
              student.applications[i].doc_modification_thread[j].doc_thread_id
                .file_type
            }</a></li>`;
          }
        }
      } else if (user.role === 'Student') {
        if (
          !student.applications[i].doc_modification_thread[j].isFinalVersion &&
          student.applications[i].doc_modification_thread[j]
            .latest_message_left_by_id !== user._id.toString()
        ) {
          if (kk === 0) {
            missing_doc_list = `
        The following documents are waiting for your response, please reply it as soon as possible:
        <ul>
        <li><a href="${THREAD_URL}/${student.applications[
              i
            ].doc_modification_thread[j].doc_thread_id._id.toString()}">${
              student.applications[i].programId.school
            } ${student.applications[i].programId.program_name} ${
              student.applications[i].doc_modification_thread[j].doc_thread_id
                .file_type
            }</a></li>`;
            kk += 1;
          } else {
            missing_doc_list += `<li><a href="${THREAD_URL}/${student.applications[
              i
            ].doc_modification_thread[j].doc_thread_id._id.toString()}">${
              student.applications[i].programId.school
            } ${student.applications[i].programId.program_name} ${
              student.applications[i].doc_modification_thread[j].doc_thread_id
                .file_type
            }</a></li>`;
          }
        }
      } else if (user.role === 'Agent') {
        if (
          !student.applications[i].doc_modification_thread[j].isFinalVersion
        ) {
          if (kk === 0) {
            missing_doc_list = `
        The following documents are not finished:
        <ul>
        <li><a href="${THREAD_URL}/${student.applications[
              i
            ].doc_modification_thread[j].doc_thread_id._id.toString()}">${
              student.applications[i].programId.school
            } ${student.applications[i].programId.program_name} ${
              student.applications[i].doc_modification_thread[j].doc_thread_id
                .file_type
            }</a></li>`;
            kk += 1;
          } else {
            missing_doc_list += `<li><a href="${THREAD_URL}/${student.applications[
              i
            ].doc_modification_thread[j].doc_thread_id._id.toString()}">${
              student.applications[i].programId.school
            } ${student.applications[i].programId.program_name} ${
              student.applications[i].doc_modification_thread[j].doc_thread_id
                .file_type
            }</a></li>`;
          }
        }
      }
    }
  }
  missing_doc_list += '</ul>';
  return missing_doc_list;
};
const profile_keys_list = [
  'High_School_Diploma',
  'High_School_Transcript',
  'University_Entrance_Examination_GSAT',
  'Bachelor_Certificate',
  'Bachelor_Transcript',
  'Englisch_Certificate',
  'German_Certificate',
  'GREGMAT',
  'ECTS_Conversion',
  'Course_Description',
  'Internship',
  'Employment_Certificate',
  'Passport',
  'Others'
];

const check_english_language_passed = (academic_background) => {
  if (!academic_background || !academic_background.language) {
    return false;
  }
  if (academic_background.language.english_isPassed === 'O') {
    return true;
  }

  return false;
};

const check_german_language_passed = (academic_background) => {
  if (!academic_background || !academic_background.language) {
    return false;
  }
  if (academic_background.language.german_isPassed === 'O') {
    return true;
  }

  return false;
};

const check_languages_filled = (academic_background) => {
  if (!academic_background || !academic_background.language) {
    return false;
  }
  if (
    !academic_background.language ||
    ((!academic_background.language.english_isPassed ||
      academic_background.language.english_isPassed === '-') &&
      (!academic_background.language.german_isPassed ||
        academic_background.language.german_isPassed === '-'))
  ) {
    return false;
  }

  return true;
};

const missing_academic_background = (student, user) => {
  let missing_background_fields = '';
  if (
    (!student.academic_background || !student.academic_background.university) &&
    !student.application_preference
  ) {
    missing_background_fields = `<p>The following fields in Survey not finished yet:</p>
    <ul>
    <li>High School Name</li>
    <li>High School already graduated?</li>
    <li>High School Graduate Year</li>
    <li>University Name</li>
    <li>University Program</li>
    <li>Already Bechelor graduated?</li>`;
    missing_background_fields += '<li>Expected Application Year</li>';
    missing_background_fields += '<li>Expected Application Semester</li>';
    missing_background_fields += '</ul>';
    if (
      user.role === 'Agent' ||
      user.role === 'Admin' ||
      user.role === 'Agent'
    ) {
      missing_background_fields += `<p>Please go to <a href="${SURVEY_URL_FOR_AGENT_URL(
        student._id.toString()
      )}">Survey</a> and update them.</p>`;
    } else {
      missing_background_fields += `<p>Please go to <a href="${STUDENT_SURVEY_URL}">Survey</a> and update them.</p>`;
    }
    return missing_background_fields;
  }
  // TODO: can add more mandatory field
  if (
    !student.academic_background.university.attended_high_school ||
    !student.academic_background.university.high_school_isGraduated ||
    student.academic_background.university.high_school_isGraduated === '-' ||
    !student.academic_background.university.attended_university ||
    !student.academic_background.university.attended_university_program ||
    !student.academic_background.university.isGraduated ||
    student.academic_background.university.isGraduated === '-' ||
    !student.application_preference.expected_application_date ||
    !student.application_preference.expected_application_semester
    // ||
    // !student.academic_background.university.isGraduated
  ) {
    missing_background_fields +=
      '<p>The following fields in Survey not finished yet:</p><ul>';
    if (!student.academic_background.university.attended_high_school) {
      missing_background_fields += '<li>High School Name</li>';
    }
    if (
      !student.academic_background.university.high_school_isGraduated ||
      student.academic_background.university.high_school_isGraduated === '-'
    ) {
      missing_background_fields += '<li>High School already graduated?</li>';
    }
    if (!student.academic_background.university.high_school_graduated_year) {
      missing_background_fields += '<li>High School Graduate year</li>';
    }
    if (!student.academic_background.university.attended_university) {
      missing_background_fields += '<li>University Name</li>';
    }
    if (!student.academic_background.university.attended_university_program) {
      missing_background_fields += '<li>University Program</li>';
    }
    if (
      !student.academic_background.university.isGraduated ||
      student.academic_background.university.isGraduated === '-'
    ) {
      missing_background_fields += ' <li>Already Bechelor graduated?</li>';
    }
    if (!student.application_preference.expected_application_date) {
      missing_background_fields += '<li>Expected Application Year</li>';
    }
    if (!student.application_preference.expected_application_semester) {
      missing_background_fields += '<li>Expected Application Semester</li>';
    }
    if (
      user.role === 'Agent' ||
      user.role === 'Admin' ||
      user.role === 'Agent'
    ) {
      missing_background_fields += `<p>Please go to <a href="${SURVEY_URL_FOR_AGENT_URL(
        student._id.toString()
      )}">Survey</a> and update them.</p>`;
    } else {
      missing_background_fields += `<p>Please go to <a href="${STUDENT_SURVEY_URL}">Survey</a> and update them.</p>`;
    }
    missing_background_fields += '</ul>';
  }

  return missing_background_fields;
};

const profile_name_list = {
  High_School_Diploma: 'High_School_Diploma',
  High_School_Transcript: 'High_School_Transcript',
  University_Entrance_Examination_GSAT: 'University_Entrance_Examination_GSAT',
  Bachelor_Certificate: 'Bachelor_Certificate',
  Bachelor_Transcript: 'Bachelor_Transcript',
  Englisch_Certificate: 'Englisch_Certificate',
  German_Certificate: 'German_Certificate',
  GREGMAT: 'GREGMAT',
  ECTS_Conversion: 'ECTS_Conversion',
  Course_Description: 'Course_Description',
  Internship: 'Internship',
  Employment_Certificate: 'Employment_Certificate',
  Passport: 'Passport',
  Others: 'Others'
};

const base_documents_summary = (student) => {
  let rejected_base_documents = '';
  let missing_base_documents = '';
  const object_init = {};
  for (let i = 0; i < profile_keys_list.length; i += 1) {
    object_init[profile_keys_list[i]] = 'missing';
  }
  for (let i = 0; i < student.profile.length; i += 1) {
    if (student.profile[i].status === 'uploaded') {
      object_init[student.profile[i].name] = 'uploaded';
    } else if (student.profile[i].status === 'accepted') {
      object_init[student.profile[i].name] = 'accepted';
    } else if (student.profile[i].status === 'rejected') {
      object_init[student.profile[i].name] = 'rejected';
    } else if (student.profile[i].status === 'missing') {
      object_init[student.profile[i].name] = 'missing';
    } else if (student.profile[i].status === 'notneeded') {
      object_init[student.profile[i].name] = 'notneeded';
    }
  }
  let xx = 0;
  let yy = 0;
  for (let i = 0; i < profile_keys_list.length; i += 1) {
    if (object_init[profile_keys_list[i]] === 'missing') {
      if (xx === 0) {
        xx += 1;
        missing_base_documents = `
        <p>The following base documents are still missing, please upload them as soon as possible:</p>
        <ul>
        <li>${profile_list[profile_keys_list[i]]}</li>`;
      } else {
        missing_base_documents += `<li>${
          profile_list[profile_keys_list[i]]
        }</li>`;
      }
    }
    if (object_init[profile_keys_list[i]] === 'rejected') {
      if (yy === 0) {
        yy += 1;
        rejected_base_documents = `
        <p>The following base documents are not okay, please upload them again as soon as possible:</p>
        <ul>
        <li>${profile_list[profile_keys_list[i]]}</li>`;
      } else {
        rejected_base_documents += `<li>${
          profile_list[profile_keys_list[i]]
        }</li>`;
      }
    }
  }
  if (missing_base_documents !== '') {
    missing_base_documents += '</ul>';
  }
  if (rejected_base_documents !== '') {
    rejected_base_documents += '</ul>';
  }
  let base_documents = `

  ${missing_base_documents}

  ${rejected_base_documents}
  `;
  if (missing_base_documents !== '' || rejected_base_documents !== '') {
    base_documents += `<p>Please go to <a href="${BASE_DOCUMENT_URL}">Base Documents</a> and upload them.</p>`;
  }
  return base_documents;
};

module.exports = {
  DocumentStatus,
  CheckListStatus,
  TaskStatus,
  RLs_CONSTANT,
  base_documents_summary,
  unsubmitted_applications_summary,
  cv_ml_rl_unfinished_summary,
  profile_list,
  profile_keys_list,
  profile_name_list,
  getNumberOfDays,
  check_english_language_passed,
  check_german_language_passed,
  check_languages_filled,
  missing_academic_background,
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
};
