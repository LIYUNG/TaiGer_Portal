import React from 'react';
import Linkify from 'react-linkify';
import { getNumberOfDays, convertDate, profile_list } from './contants';
import { useTranslation } from 'react-i18next';
import { Link } from '@mui/material';
import { Link as LinkDom } from 'react-router-dom';
export const is_TaiGer_role = (user) =>
  user?.role === 'Admin' || user?.role === 'Agent' || user?.role === 'Editor';
export const is_TaiGer_AdminAgent = (user) =>
  user?.role === 'Admin' || user?.role === 'Agent';
export const is_TaiGer_Admin = (user) => user?.role === 'Admin';
export const is_TaiGer_Editor = (user) => user?.role === 'Editor';
export const is_TaiGer_Agent = (user) => user?.role === 'Agent';
export const is_TaiGer_Manager = (user) => user?.role === 'Manager';
export const is_TaiGer_Student = (user) => user?.role === 'Student';
export const is_TaiGer_Guest = (user) => user?.role === 'Guest';
export const DocumentStatus = {
  Uploaded: 'uploaded',
  Missing: 'missing',
  Accepted: 'accepted',
  Rejected: 'rejected',
  NotNeeded: 'notneeded'
};

export const calculateDisplayLength = (text) => {
  let length = 0;
  for (let i = 0; i < text.length; i++) {
    // Check if the character is a Chinese character
    const isChinese = text.codePointAt(i) > 255; // Adjust the threshold if needed
    length += isChinese ? 2 : 1;
  }
  return length;
};

export const truncateText = (text, maxLength) => {
  let currentLength = 0;
  let truncatedText = '';

  for (let i = 0; i < text.length; i++) {
    const isChinese = text.codePointAt(i) > 255; // Adjust the threshold if needed
    currentLength += isChinese ? 2 : 1;

    if (currentLength <= maxLength) {
      truncatedText += text[i];
    } else {
      break;
    }
  }

  if (currentLength > maxLength) {
    truncatedText += '...';
  }
  return truncatedText;
};

export const file_category_const = {
  ml_required: 'ML',
  essay_required: 'Essay',
  portfolio_required: 'Portfolio',
  supplementary_form_required: 'Supplementary_Form'
};

// TODO test
export const LinkableNewlineText = ({ text }) => {
  const textStyle = {
    whiteSpace: 'pre-line' // Preserve newlines and wrap text
  };
  return (
    <div style={textStyle}>
      <Linkify
        componentDecorator={(decoratedHref, decoratedText, key) => (
          <Link
            underline="hover"
            to={decoratedHref}
            component={LinkDom}
            key={key}
            target="_blank"
          >
            {decoratedText}
          </Link>
        )}
      >
        {text}
      </Linkify>
    </div>
  );
};

export const Bayerische_Formel = (high, low, my) => {
  if (high - low !== 0) {
    var Germen_note = 1 + (3 * (high - my)) / (high - low);
    return Germen_note.toFixed(2);
  }
  return 0;
};

export const getRequirement = (thread) => {
  const fileType = thread.file_type;
  const program = thread.program_id;

  if (fileType.includes('Essay') && program.essay_required === 'yes') {
    return program.essay_requirements || 'No';
  }
  if (fileType.includes('ML') && program.ml_required === 'yes') {
    return program.ml_requirements || 'No';
  }
  if (fileType.includes('Portfolio') || program.portfolio_required === 'yes') {
    return program.portfolio_requirements || 'No';
  }
  if (
    fileType.includes('Supplementary_Form') &&
    program.supplementary_form_required === 'yes'
  ) {
    return program.supplementary_form_requirements || 'No';
  }
  if (
    fileType.includes('RL') &&
    ['1', '2', '3'].includes(program.rl_required)
  ) {
    return program.rl_requirements || 'No';
  }
  return 'No';
};

// TODO: test
export const NewlineText = (props) => {
  const text = props.text;

  // Split the input text by line breaks and URLs
  const parts = text?.split(/\\n/);

  // Process each part and replace URLs with <a> tags
  const newText = parts?.map((part, index) => {
    return (
      <p key={index} className="my-1">
        {part}
      </p>
    );
  });
  return newText;
};

export const isLanguageInfoComplete = (academic_background) => {
  if (!academic_background || !academic_background.language) {
    return false;
  }
  if (
    academic_background.language.english_isPassed === '-' &&
    academic_background.language.german_isPassed === '-'
  ) {
    return false;
  }

  return true;
};

export const isEnglishLanguageInfoComplete = (academic_background) => {
  if (!academic_background || !academic_background.language) {
    return false;
  }
  if (academic_background.language.english_isPassed === '-') {
    return false;
  }

  return true;
};

export const check_if_there_is_german_language_info = (academic_background) => {
  if (!academic_background || !academic_background.language) {
    return false;
  }
  if (academic_background.language.german_isPassed === '-') {
    return false;
  }

  return true;
};

export const check_english_language_passed = (academic_background) => {
  if (academic_background?.language?.english_isPassed === 'O') {
    return true;
  }
  return false;
};

export const check_english_language_Notneeded = (academic_background) => {
  if (academic_background?.language?.english_isPassed === '--') {
    return true;
  }
  return false;
};

export const check_german_language_passed = (academic_background) => {
  if (academic_background?.language?.german_isPassed === 'O') {
    return true;
  }
  return false;
};

export const check_german_language_Notneeded = (academic_background) => {
  if (academic_background?.language?.german_isPassed === '--') {
    return true;
  }
  return false;
};

export const based_documents_init = (student) => {
  let documentlist2_keys = Object.keys(profile_list);
  let object_init = {};
  for (let i = 0; i < documentlist2_keys.length; i++) {
    object_init[documentlist2_keys[i]] = DocumentStatus.Missing;
  }

  for (let i = 0; i < student.profile.length; i++) {
    if (student.profile[i].status === DocumentStatus.Uploaded) {
      object_init[student.profile[i].name] = DocumentStatus.Uploaded;
    } else if (student.profile[i].status === DocumentStatus.Accepted) {
      object_init[student.profile[i].name] = DocumentStatus.Accepted;
    } else if (student.profile[i].status === DocumentStatus.Rejected) {
      object_init[student.profile[i].name] = DocumentStatus.Rejected;
    } else if (student.profile[i].status === DocumentStatus.Missing) {
      object_init[student.profile[i].name] = DocumentStatus.Missing;
    } else if (student.profile[i].status === DocumentStatus.NotNeeded) {
      object_init[student.profile[i].name] = DocumentStatus.NotNeeded;
    }
  }
  return { object_init, documentlist2_keys };
};

export const are_base_documents_missing = (student) => {
  if (student.profile?.length > 0) {
    const { object_init, documentlist2_keys } = based_documents_init(student);

    for (let i = 0; i < documentlist2_keys.length; i++) {
      if (
        object_init[documentlist2_keys[i]] !== DocumentStatus.Accepted &&
        object_init[documentlist2_keys[i]] !== DocumentStatus.NotNeeded
      ) {
        return true;
      }
    }
  }
  return false;
};

export const is_any_base_documents_uploaded = (students) => {
  if (students) {
    for (let i = 0; i < students.length; i += 1) {
      let documentlist2_keys = Object.keys(profile_list);
      let object_init = {};
      for (let j = 0; j < documentlist2_keys.length; j += 1) {
        object_init[documentlist2_keys[i]] = DocumentStatus.Missing;
      }
      if (students[i].profile === undefined) {
        return false;
      }
      if (students[i].profile.length === 0) {
        return false;
      }

      for (let j = 0; j < students[i].profile.length; j += 1) {
        if (students[i].profile[j].status === DocumentStatus.Uploaded) {
          object_init[students[i].profile[j].name] = DocumentStatus.Uploaded;
        } else if (students[i].profile[j].status === DocumentStatus.Accepted) {
          object_init[students[i].profile[j].name] = DocumentStatus.Accepted;
        } else if (students[i].profile[j].status === DocumentStatus.Rejected) {
          object_init[students[i].profile[j].name] = DocumentStatus.Rejected;
        } else if (students[i].profile[j].status === DocumentStatus.Missing) {
          object_init[students[i].profile[j].name] = DocumentStatus.Missing;
        } else if (students[i].profile[j].status === DocumentStatus.NotNeeded) {
          object_init[students[i].profile[j].name] = DocumentStatus.NotNeeded;
        }
      }

      for (let i = 0; i < documentlist2_keys.length; i++) {
        if (object_init[documentlist2_keys[i]] === DocumentStatus.Uploaded) {
          return true;
        }
      }
    }
  }
  return false;
};

export const needUpdateCourseSelection = (student) => {
  // necessary if never updated course and is studying
  if (!student.courses) {
    return <span className="text-danger">No Input</span>;
  }
  // necessary if never analyzed and is studying
  if (!student.courses.analysis?.updatedAt) {
    return <>No Anaylsis</>;
  }
  // necessary if courses or analysis expired 39 daays and is studying
  const course_aged_days = parseInt(
    getNumberOfDays(student.courses.updatedAt, new Date()),
    10
  );
  const analyse_aged_days = parseInt(
    getNumberOfDays(student.courses.analysis?.updatedAt, new Date()),
    10
  );
  // TODO: only check when june, july, november, december,
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // January is 0, December is 11
  if (
    currentMonth === 5 ||
    currentMonth === 6 || // July
    currentMonth === 10 ||
    currentMonth === 11 // December
  ) {
    const trigger_days = 62;
    if (course_aged_days > trigger_days || analyse_aged_days > trigger_days) {
      return <span className="text-danger">Expired</span>;
    }
  }

  // not necessary if have studied or not yet begin
  if (
    student.academic_background?.university?.isGraduated === 'Yes' ||
    student.academic_background?.university?.isGraduated === 'No'
  ) {
    return <>Graduated</>;
  }
  return <span className="text-warning">OK</span>;
};

export const to_register_application_portals = (student) => {
  for (const application of student.applications) {
    if (!application.credential_a_filled || !application.credential_b_filled) {
      return true;
    }
  }
  return false;
};

export const isBaseDocumentsRejected = (student) => {
  if (student.profile === undefined) {
    return false;
  }
  if (student.profile.length === 0) {
    return false;
  }
  const { object_init, documentlist2_keys } = based_documents_init(student);

  for (let i = 0; i < documentlist2_keys.length; i++) {
    if (object_init[documentlist2_keys[i]] === DocumentStatus.Rejected) {
      return true;
    }
  }
  return false;
};

export const check_languages_filled = (academic_background) => {
  if (!academic_background || !academic_background.language) {
    return false;
  }
  if (
    !academic_background.language ||
    !academic_background.language.english_isPassed ||
    academic_background.language.english_isPassed === '-' ||
    !academic_background.language.german_isPassed ||
    academic_background.language.german_isPassed === '-' ||
    !academic_background.language.gre_isPassed ||
    academic_background.language.gre_isPassed === '-' ||
    !academic_background.language.gmat_isPassed ||
    academic_background.language.gmat_isPassed === '-'
  ) {
    return false;
  }
  // if test date expired:
  const today = new Date();
  if (
    (academic_background.language.english_isPassed === 'X' &&
      parseInt(
        getNumberOfDays(academic_background.language.english_test_date, today)
      ) > 1) ||
    (academic_background.language.english_isPassed === 'X' &&
      academic_background.language.english_test_date === '') ||
    (academic_background.language.german_isPassed === 'X' &&
      parseInt(
        getNumberOfDays(academic_background.language.german_test_date, today)
      ) > 1) ||
    (academic_background.language.german_isPassed === 'X' &&
      academic_background.language.german_test_date === '') ||
    (academic_background.language.gre_isPassed === 'X' &&
      parseInt(
        getNumberOfDays(academic_background.language.gre_test_date, today)
      ) > 1) ||
    (academic_background.language.gre_isPassed === 'X' &&
      academic_background.language.gre_test_date === '') ||
    (academic_background.language.gmat_isPassed === 'X' &&
      parseInt(
        getNumberOfDays(academic_background.language.gmat_test_date, today)
      ) > 1) ||
    (academic_background.language.gmat_isPassed === 'X' &&
      academic_background.language.gmat_test_date === '')
  ) {
    return false;
  }

  return true;
};

export const check_academic_background_filled = (academic_background) => {
  if (!academic_background || !academic_background.university) {
    return false;
  }
  // TODO: can add more mandatory field
  if (
    !academic_background.university?.attended_high_school ||
    !academic_background.university?.high_school_isGraduated ||
    academic_background.university?.high_school_isGraduated === '-' ||
    !academic_background.university?.Has_Exchange_Experience ||
    academic_background.university?.Has_Exchange_Experience === '-' ||
    !academic_background.university?.Has_Internship_Experience ||
    academic_background.university?.Has_Internship_Experience === '-' ||
    !academic_background.university?.Has_Working_Experience ||
    academic_background.university?.Has_Working_Experience === '-' ||
    !academic_background.university?.attended_university ||
    !academic_background.university?.attended_university_program
    // ||
    // !academic_background.university.isGraduated
  ) {
    return false;
  }

  return true;
};

export const MissingSurveyFieldsList = ({
  academic_background,
  application_preference
}) => {
  const { t } = useTranslation();
  return (
    <>
      {academic_background?.university &&
        !academic_background.university.attended_high_school && (
          <li>{t('High School Name')}</li>
        )}
      {academic_background?.university &&
        (!academic_background.university.high_school_isGraduated ||
          academic_background.university.high_school_isGraduated === '-') && (
          <li>{t('High School graduate status')}</li>
        )}
      {academic_background?.university &&
        (!academic_background.university.isGraduated ||
          academic_background.university.isGraduated === '-') && (
          <li>{t('Bachelor Degree graduate status')}</li>
        )}
      {[('Yes', 'pending')].includes(
        academic_background?.university?.isGraduated
      ) &&
        academic_background?.university?.attended_university === '' && (
          <li>{t('University Name (Bachelor degree)')}</li>
        )}
      {['Yes', 'pending'].includes(
        academic_background?.university?.isGraduated
      ) &&
        academic_background?.university?.attended_university_program === '' && (
          <li>{t('Program Name / Not study yet')}</li>
        )}
      {['Yes', 'pending'].includes(
        academic_background?.university?.isGraduated
      ) &&
        academic_background?.university &&
        (!academic_background.university.Has_Exchange_Experience ||
          academic_background.university.Has_Exchange_Experience === '-') && (
          <li>{t('Exchange Student Experience ?')}</li>
        )}
      {academic_background?.university &&
        (!academic_background.university.Has_Internship_Experience ||
          academic_background.university.Has_Internship_Experience === '-') && (
          <li>{t('Internship Experience ?')}</li>
        )}
      {academic_background?.university &&
        (!academic_background.university.Has_Working_Experience ||
          academic_background.university.Has_Working_Experience === '-') && (
          <li>{t('Full-Time Job Experience ?')}</li>
        )}
      {academic_background?.university &&
        (!academic_background.university.isGraduated ||
          academic_background.university.isGraduated === 'Yes' ||
          academic_background.university.isGraduated === 'pending') && (
          <>
            {academic_background?.university &&
              (!academic_background.university.Highest_GPA_Uni ||
                academic_background.university.Highest_GPA_Uni === '-') && (
                <li>{t('Highest Score GPA of your university program')}</li>
              )}
            {academic_background?.university &&
              (!academic_background.university.Passing_GPA_Uni ||
                academic_background.university.Passing_GPA_Uni === '-') && (
                <li>{t('Passing Score GPA of your university program')}</li>
              )}
            {academic_background?.university &&
              (!academic_background.university.My_GPA_Uni ||
                academic_background.university.My_GPA_Uni === '-') && (
                <li>{t('My GPA')}</li>
              )}
          </>
        )}
      {application_preference &&
        !application_preference.expected_application_date && (
          <li>{t('Expected Application Year')}</li>
        )}
      {application_preference &&
        !application_preference.expected_application_semester && (
          <li>{t('Expected Application Semester')}</li>
        )}
      {application_preference &&
        !application_preference.target_application_field && (
          <li>{t('Target Application Fields')}</li>
        )}
      {application_preference && !application_preference.target_degree && (
        <li>{t('Target Degree Programs')}</li>
      )}
      {application_preference?.considered_privat_universities === '-' && (
        <li>{t('Considering private universities?')}</li>
      )}
      {application_preference?.application_outside_germany === '-' && (
        <li>{t('Considering universities outside Germany?')}</li>
      )}
    </>
  );
};

export const progressBarCounter = (student, application) => {
  const all_points = [
    student?.generaldocs_threads?.length || 0,

    application?.programId?.ielts || application?.programId?.toefl ? 1 : 0,
    application?.programId?.testdaf
      ? application?.programId?.testdaf === '-'
        ? 0
        : 1
      : 0,
    application?.programId?.gre
      ? application?.programId?.gre === '-'
        ? 0
        : 1
      : 0,
    application?.programId?.gmat
      ? application?.programId?.gmat === '-'
        ? 0
        : 1
      : 0,
    application?.programId?.application_portal_a ||
    application?.programId?.application_portal_b
      ? 1
      : 0,
    application?.doc_modification_thread?.length || 0,
    application?.programId?.uni_assist?.includes('VPD') ? 1 : 0,
    1
  ];
  const finished_pointes = [
    student?.generaldocs_threads?.filter(
      (thread) => thread.isFinalVersion === true
    ).length,

    (application?.programId?.ielts || application?.programId?.toefl) &&
    student?.academic_background?.language?.english_isPassed === 'O' &&
    isEnglishOK(application?.programId, student)
      ? 1
      : 0,
    application?.programId?.testdaf &&
    application?.programId?.testdaf !== '-' &&
    student?.academic_background?.language?.german_isPassed === 'O'
      ? 1
      : 0,
    application?.programId?.gre &&
    application?.programId?.gre !== '-' &&
    student?.academic_background?.language?.gre_isPassed === 'O'
      ? 1
      : 0,
    application?.programId?.gmat &&
    application?.programId?.gmat !== '-' &&
    student?.academic_background?.language?.gmat_isPassed === 'O'
      ? 1
      : 0,
    (application?.programId?.application_portal_a ||
      application?.programId?.application_portal_b) &&
    ((application?.programId?.application_portal_a &&
      !application.credential_a_filled) ||
      (application?.programId?.application_portal_b &&
        !application.credential_b_filled))
      ? 0
      : 1,
    application?.doc_modification_thread?.filter(
      (thread) => thread.isFinalVersion === true
    ).length,
    application?.programId?.uni_assist?.includes('VPD')
      ? application?.uni_assist?.status === 'notstarted'
        ? 0
        : 1
      : 0,
    application?.closed === 'O' ? 1 : 0
  ];

  const percentage =
    (finished_pointes.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    ) /
      all_points.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0
      )) *
    100;
  return Math.floor(percentage);
};

export const isEnglishOK = (program, student) => {
  // in case not number string
  if (
    !parseFloat(student.academic_background.language.english_score) ||
    !parseFloat(student.academic_background.language.english_score_reading) ||
    !parseFloat(student.academic_background.language.english_score_listening) ||
    !parseFloat(student.academic_background.language.english_score_writing) ||
    !parseFloat(student.academic_background.language.english_score_speaking)
  ) {
    return false;
  }

  if (student.academic_background.language.english_certificate === 'TOEFL') {
    if (
      program.toefl >
        parseFloat(student.academic_background.language.english_score) ||
      program.toefl_reading >
        parseFloat(
          student.academic_background.language.english_score_reading
        ) ||
      program.toefl_listening >
        parseFloat(
          student.academic_background.language.english_score_listening
        ) ||
      program.toefl_writing >
        parseFloat(
          student.academic_background.language.english_score_writing
        ) ||
      program.toefl_speaking >
        parseFloat(student.academic_background.language.english_score_speaking)
    ) {
      return false;
    }
  }
  if (student.academic_background.language.english_certificate === 'IELTS') {
    if (
      program.ielts >
        parseFloat(student.academic_background.language.english_score) ||
      program.ielts_reading >
        parseFloat(
          student.academic_background.language.english_score_reading
        ) ||
      program.ielts_listening >
        parseFloat(
          student.academic_background.language.english_score_listening
        ) ||
      program.ielts_writing >
        parseFloat(
          student.academic_background.language.english_score_writing
        ) ||
      program.ielts_speaking >
        parseFloat(student.academic_background.language.english_score_speaking)
    ) {
      return false;
    }
  }

  return true;
};

export const application_date_calculator = (student, application) => {
  if (isProgramSubmitted(application)) {
    return 'CLOSE';
  }
  if (isProgramWithdraw(application)) {
    return 'WITHDRAW';
  }
  const { application_start, semester } = application.programId;

  if (!application_start) {
    return 'No Data';
  }
  let application_year = '<TBD>';
  if (student.application_preference?.expected_application_date !== '') {
    application_year = parseInt(
      student.application_preference.expected_application_date
    );
  }
  if (!application_start) {
    return `${application_year}-<TBD>`;
  }
  if (application_start.includes('olling')) {
    // include Rolling
    return `${application_year}-Rolling`;
  }
  let deadline_month = parseInt(
    application.programId.application_start.split('-')[0]
  );

  if (semester === undefined) {
    return 'Err';
  }
  if (semester === 'WS') {
    if (deadline_month > 9) {
      application_year = application_year - 1;
    }
  }
  if (semester === 'SS') {
    if (deadline_month > 3) {
      application_year = application_year - 1;
    }
  }

  return `${application_year}/${
    application.programId.application_start.split('-')[0]
  }/${application.programId.application_start.split('-')[1]}`;
};

export const application_deadline_calculator = (student, application) => {
  if (application.closed === 'O') {
    return 'CLOSE';
  }
  if (application.closed === 'X') {
    return 'WITHDRAW';
  }
  const { application_deadline, semester } = application.programId;

  if (!application_deadline) {
    return 'No Data';
  }
  let application_year = '<TBD>';
  if (student.application_preference?.expected_application_date !== '') {
    application_year = parseInt(
      student.application_preference.expected_application_date
    );
  }
  if (!application_deadline) {
    return `${application_year}-<TBD>`;
  }
  if (application_deadline.includes('olling')) {
    // include Rolling
    return `${application_year}-Rolling`;
  }
  let deadline_month = parseInt(
    application.programId.application_deadline.split('-')[0]
  );
  // let deadline_day = parseInt(
  //   application.programId.application_deadline.split('-')[1]
  // );
  if (semester === undefined) {
    return 'Err';
  }
  if (semester === 'WS') {
    if (deadline_month > 9) {
      application_year = application_year - 1;
    }
  }
  if (semester === 'SS') {
    if (deadline_month > 3) {
      application_year = application_year - 1;
    }
  }

  return `${application_year}/${
    application.programId.application_deadline.split('-')[0]
  }/${application.programId.application_deadline.split('-')[1]}`;
};

export const GetCVDeadline = (student) => {
  var today = new Date();
  let daysLeftMin = 3000;
  let CVDeadline = '';
  let daysLeftRollingMin = 0;
  let CVDeadlineRolling = '';
  let hasRolling = false;
  student.applications.forEach((application) => {
    if (application.decided === 'O') {
      const applicationDeadline = application_deadline_calculator(
        student,
        application
      );
      if (applicationDeadline?.includes('olling')) {
        hasRolling = true;
        daysLeftRollingMin = '-';
        CVDeadlineRolling = applicationDeadline;
      }
      const daysLeft = parseInt(getNumberOfDays(today, applicationDeadline));

      if (daysLeft < daysLeftMin) {
        daysLeftMin = daysLeft;
        CVDeadline = applicationDeadline;
      }
    }
  });
  return daysLeftMin === 3000
    ? hasRolling
      ? {
          daysLeftMin: daysLeftRollingMin,
          CVDeadline: CVDeadlineRolling
        }
      : { daysLeftMin: '-', CVDeadline: '-' }
    : { daysLeftMin, CVDeadline };
};

export const check_application_preference_filled = (application_preference) => {
  if (!application_preference) {
    return false;
  }
  // TODO: can add more mandatory field
  if (
    !application_preference.expected_application_date ||
    !application_preference.expected_application_semester ||
    !application_preference.target_application_field ||
    !application_preference.target_degree ||
    application_preference.considered_privat_universities === '-' ||
    application_preference.application_outside_germany === '-'
  ) {
    return false;
  }
  return true;
};
export const does_student_have_agents = (students) => {
  for (let i = 0; i < students.length; i += 1) {
    if (students[i].agents === undefined || students[i].agents.length === 0) {
      return false;
    }
  }
  return true;
};

export const does_student_have_editors = (students) => {
  for (let i = 0; i < students.length; i += 1) {
    if (students[i].editors === undefined || students[i].editors.length === 0) {
      return false;
    }
  }
  return true;
};

export const check_applications_decision_from_student = (student) => {
  if (!student.applications) {
    return false;
  }
  if (student.applications.length === 0) {
    return false;
  }
  for (let j = 0; j < student.applications.length; j += 1) {
    if (
      !student.applications[j].decided ||
      (student.applications[j].decided !== undefined &&
        student.applications[j].decided === '-')
    ) {
      return false;
    }
  }

  return true;
};

export const check_applications_to_decided = (student) => {
  if (!student.applications) {
    return true;
  }
  if (student.applications.length === 0) {
    return true;
  }
  for (let j = 0; j < student.applications.length; j += 1) {
    if (
      !student.applications[j].decided ||
      (student.applications[j].decided !== undefined &&
        student.applications[j].decided === '-')
    ) {
      return false;
    }
  }

  return true;
};

export const check_application_selection = (student) => {
  if (!student.applications) {
    return false;
  }
  if (student.applications.length === 0) {
    return false;
  }
  return true;
};

export const anyStudentWithoutApplicationSelection = (students) => {
  let flag = false;
  for (let i = 0; i < students.length; i += 1) {
    flag = flag || !check_application_selection(students[i]);
    if (flag) {
      return flag;
    }
  }
  return false;
};

export const is_num_Program_Not_specified = (student) => {
  if (
    student.applying_program_count === 0 ||
    student.applying_program_count === undefined
  ) {
    return true;
  }
  return false;
};

export const isProgramNotSelectedEnough = (students) => {
  for (let i = 0; i < students.length; i += 1) {
    if (students[i].applications.length < students[i].applying_program_count) {
      return true;
    }
  }
  return false;
};

export const numApplicationsDecided = (student) => {
  if (student.applications === undefined) {
    return 0;
  }
  const num_apps_decided = student.applications.filter(
    (app) => app.decided === 'O'
  ).length;
  return num_apps_decided;
};

export const numApplicationsSubmitted = (student) => {
  if (student.applications === undefined) {
    return 0;
  }
  const num_apps_closed = student.applications.filter(
    (app) => app.closed === 'O'
  ).length;
  return num_apps_closed;
};

export const areProgramsDecidedMoreThanContract = (student) => {
  if (
    !student.applications ||
    student.applying_program_count === 0 ||
    student.applications.length === 0
  ) {
    return false;
  }
  const num_decided =
    student?.applications?.filter((application) => application.decided === 'O')
      .length | 0;

  return num_decided >= student.applying_program_count;
};

export const check_all_applications_decided = (student) => {
  if (
    !student.applications ||
    student.applying_program_count === 0 ||
    student.applications.length === 0
  ) {
    return false;
  }

  if (student.applications.length < student.applying_program_count) {
    return false;
  }

  for (let j = 0; j < student.applications.length; j += 1)
    if (
      !student.applications[j].decided ||
      (student.applications[j].decided !== undefined &&
        student.applications[j].decided !== 'O')
    ) {
      return false;
    }

  return true;
};

export const check_all_decided_applications_submitted = (student) => {
  if (!student.applications || student.applications.length === 0) {
    return false;
  }

  return student.applications
    .filter((app) => app.decided === 'O')
    .every((app) => app.closed === 'O' && app.decided === 'O');
};

export const check_program_uni_assist_needed = (application) => {
  if (application.programId?.uni_assist?.includes('Yes')) {
    return true;
  }

  return false;
};

export const isUniAssistVPDNeeded = (application) => {
  if (
    application.decided === 'O' &&
    application.programId.uni_assist &&
    application.programId.uni_assist.includes('VPD')
  ) {
    if (!application.uni_assist) {
      return true;
    }
    if (
      application.uni_assist &&
      application.uni_assist.status === DocumentStatus.NotNeeded
    ) {
      return false;
    }

    if (
      application.uni_assist &&
      (application.uni_assist.status !== DocumentStatus.Uploaded ||
        application.uni_assist.vpd_file_path === '')
    ) {
      return true;
    }
  }

  return false;
};

export const is_uni_assist_paid_and_docs_uploaded = (application) => {
  if (application.uni_assist && application.uni_assist.isPaid) {
    return true;
  }
  return false;
};

export const check_student_needs_uni_assist = (student) => {
  if (!student.applications) {
    return false;
  }
  //  Array.some() method to check if there's an application that matches the conditions.
  return student.applications.some((app) => {
    return (
      app.decided === 'O' &&
      app.programId.uni_assist &&
      (app.programId.uni_assist.includes('VPD') ||
        app.programId.uni_assist.includes('FULL'))
    );
  });
};

export const num_uni_assist_vpd_uploaded = (student) => {
  let counter = 0;
  if (!student.applications) {
    return counter;
  }
  for (const application of student.applications) {
    if (
      application.decided === 'O' &&
      application.programId.uni_assist &&
      (application.programId.uni_assist.includes('VPD') ||
        application.programId.uni_assist.includes('FULL')) &&
      application.uni_assist &&
      application.uni_assist.status !== DocumentStatus.NotNeeded &&
      (application.uni_assist.status === DocumentStatus.Uploaded ||
        application.uni_assist.vpd_file_path)
    ) {
      counter += 1;
    }
  }
  return counter;
};

export const num_uni_assist_vpd_needed = (student) => {
  let counter = 0;
  if (!student.applications) {
    return counter;
  }
  for (let j = 0; j < student.applications.length; j += 1) {
    if (
      student.applications[j].decided === 'O' &&
      student.applications[j].programId.uni_assist &&
      (student.applications[j].programId.uni_assist.includes('VPD') ||
        student.applications[j].programId.uni_assist.includes('FULL'))
    ) {
      if (!student.applications[j].uni_assist) {
        continue;
      }
      if (
        student.applications[j].uni_assist &&
        student.applications[j].uni_assist.status === DocumentStatus.NotNeeded
      ) {
        continue;
      }
      counter += 1;
    }
  }
  return counter;
};

export const is_program_ml_rl_essay_finished = (application) => {
  // check ML, RL, Essay
  return (
    application.doc_modification_thread?.length === 0 ||
    application.doc_modification_thread?.every(
      (thread) => thread.isFinalVersion
    )
  );
};

// Tested
export const is_cv_assigned = (student) => {
  // check CV
  return (
    student.generaldocs_threads.findIndex(
      (thread) => thread.doc_thread_id.file_type === 'CV'
    ) >= 0
  );
};

// Tested
export const isCVFinished = (student) => {
  const cv_thread = student?.generaldocs_threads?.find(
    (thread) => thread.doc_thread_id.file_type === 'CV'
  );
  return !!(cv_thread && cv_thread.isFinalVersion);
};

export const isAnyCVNotAssigned = (students) => {
  let flag = false;
  for (let i = 0; i < students.length; i += 1) {
    flag = flag || (!isCVFinished(students[i]) && !is_cv_assigned(students[i]));
    if (flag) {
      return flag;
    }
  }
  return false;
};

export const is_program_ml_rl_essay_ready = (application) => {
  // check ML, RL, Essay
  for (let i = 0; i < application.doc_modification_thread.length; i += 1) {
    if (!application.doc_modification_thread[i].isFinalVersion) {
      return false;
    }
  }
  return true;
};

export const isProgramDecided = (application) => {
  return application.decided === 'O';
};

export const isProgramSubmitted = (application) => {
  return application.closed === 'O';
};

export const isProgramWithdraw = (application) => {
  return application.closed === 'X';
};

export const is_program_closed = (application) => {
  if (application.closed === 'O' || application.closed === 'X') {
    return true;
  }
  return false;
};

export const is_any_programs_ready_to_submit = (students) => {
  if (students) {
    for (let i = 0; i < students.length; i += 1) {
      if (students[i].applications) {
        for (let j = 0; j < students[i].applications.length; j += 1) {
          if (
            students[i].applications[j].decided === 'O' &&
            isCVFinished(students[i]) &&
            is_program_ml_rl_essay_ready(students[i].applications[j]) &&
            is_the_uni_assist_vpd_uploaded(students[i].applications[j]) &&
            !is_program_closed(students[i].applications[j])
          ) {
            return true;
          }
        }
      }
    }
  }

  return false;
};

export const is_any_vpd_missing = (students) => {
  if (students) {
    for (let i = 0; i < students.length; i += 1) {
      if (students[i].applications) {
        for (let j = 0; j < students[i].applications.length; j += 1) {
          if (
            students[i].applications[j].decided === 'O' &&
            students[i].applications[j].programId.uni_assist &&
            students[i].applications[j].programId.uni_assist.includes('VPD')
          ) {
            if (!students[i].applications[j].uni_assist) {
              return true;
            }
            if (
              students[i].applications[j].uni_assist &&
              students[i].applications[j].uni_assist.status ===
                DocumentStatus.NotNeeded
            ) {
              continue;
            }
            if (
              students[i].applications[j].uni_assist &&
              (students[i].applications[j].uni_assist.status !==
                DocumentStatus.Uploaded ||
                students[i].applications[j].uni_assist.vpd_file_path === '')
            ) {
              return true;
            }
          }
        }
      }
    }
  }
  return false;
};

export const is_the_uni_assist_vpd_uploaded = (application) => {
  if (application === undefined) {
    return false;
  }
  if (
    application.decided === 'O' &&
    application.programId.uni_assist &&
    application.programId.uni_assist.includes('FULL')
  ) {
    return true;
  }
  if (
    application.decided === 'O' &&
    application.programId.uni_assist &&
    application.programId.uni_assist.includes('VPD')
  ) {
    if (!application.uni_assist) {
      return false;
    }
    if (
      application.uni_assist.status === DocumentStatus.Uploaded ||
      application.uni_assist.status === DocumentStatus.NotNeeded
    ) {
      return true;
    }
    if (application.uni_assist.vpd_file_path === '') {
      if (
        application.uni_assist?.vpd_paid_confirmation_file_path &&
        application.uni_assist?.vpd_paid_confirmation_file_path !== ''
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  return true;
};

export const is_personal_data_filled = (student) => {
  if (
    student.birthday === undefined ||
    student.firstname === undefined ||
    student.firstname_chinese === undefined ||
    student.lastname === undefined ||
    student.lastname_chinese === undefined
  ) {
    return false;
  }
  if (
    student.birthday === '' ||
    student.firstname === '' ||
    student.firstname_chinese === '' ||
    student.lastname === '' ||
    student.lastname_chinese === ''
  ) {
    return false;
  }

  return true;
};

export const is_all_uni_assist_vpd_uploaded = (student) => {
  if (student.applications === undefined) {
    return false;
  }
  for (let j = 0; j < student.applications.length; j += 1) {
    if (
      student.applications[j].decided === 'O' &&
      student.applications[j].programId.uni_assist &&
      student.applications[j].programId.uni_assist.includes('VPD')
    ) {
      if (!student.applications[j].uni_assist) {
        return false;
      }
      if (
        student.applications[j].uni_assist &&
        student.applications[j].uni_assist.status === DocumentStatus.NotNeeded
      ) {
        continue;
      }
      if (
        student.applications[j].uni_assist &&
        (student.applications[j].uni_assist.status !==
          DocumentStatus.Uploaded ||
          student.applications[j].uni_assist.vpd_file_path === '')
      ) {
        return false;
      }
    }
  }
  return true;
};

export const check_generaldocs = (student) => {
  if (!student.generaldocs_threads) {
    return false;
  }
  if (
    student.generaldocs_threads.findIndex(
      (thread) => thread.doc_thread_id.file_type === 'CV'
    ) === -1
  ) {
    return true;
  } else {
    return false;
  }
};

export const getNumberOfFilesByStudent = (messages, student_id) => {
  if (!messages) {
    return 0;
  }
  let file_count = 0;
  let message_count = 0;
  for (const message of messages) {
    if (message.user_id?._id?.toString() === student_id) {
      file_count += message.file?.length || 0;
      message_count += 1;
    }
  }
  return `${message_count}/${file_count}`;
};

export const getNumberOfFilesByEditor = (messages, student_id) => {
  if (!messages) {
    return 0;
  }
  let file_count = 0;
  let message_count = 0;
  for (const message of messages) {
    if (message.user_id?._id.toString() !== student_id) {
      file_count += message.file?.length || 0;
      message_count += 1;
    }
  }
  return `${message_count}/${file_count}`;
};

const latestReplyInfo = (thread) => {
  const messages = thread.messages;
  if (!messages || messages?.length <= 0) {
    return '- None - ';
  }
  const latestMessageUser = messages[messages?.length - 1]?.user_id;
  return (
    latestMessageUser &&
    `${latestMessageUser?.firstname} ${latestMessageUser?.lastname}`
  );
};

const prepTask = (student, thread) => {
  return {
    firstname_lastname: `${student.firstname}, ${student.lastname}`,
    latest_message_left_by_id: thread.latest_message_left_by_id,
    isFinalVersion: thread.isFinalVersion,
    file_type: thread.doc_thread_id.file_type,
    student_id: student._id.toString(),
    aged_days: parseInt(
      getNumberOfDays(thread.doc_thread_id.updatedAt, new Date())
    ),
    latest_reply: latestReplyInfo(thread.doc_thread_id),
    updatedAt: convertDate(thread.doc_thread_id.updatedAt)
  };
};

// student.generaldocs_threads
const prepGeneralTask = (student, thread) => {
  const { CVDeadline, daysLeftMin } = GetCVDeadline(student);
  return {
    ...prepTask(student, thread),
    thread_id: thread.doc_thread_id._id.toString(),
    deadline: CVDeadline,
    show: true,
    document_name: `${thread.doc_thread_id.file_type}`,
    days_left: daysLeftMin,
    number_input_from_student: getNumberOfFilesByStudent(
      thread.doc_thread_id.messages,
      student._id.toString()
    ),
    number_input_from_editors: getNumberOfFilesByEditor(
      thread.doc_thread_id.messages,
      student._id.toString()
    )
  };
};

// student.applications -> application.doc_modification_thread
const prepApplicationTask = (student, application, thread) => {
  return {
    ...prepTask(student, thread),
    thread_id: thread.doc_thread_id._id.toString(),
    program_id: application.programId._id.toString(),
    deadline: application_deadline_calculator(student, application),
    show: application.decided === 'O' ? true : false,
    document_name: `${thread.doc_thread_id.file_type} - ${application.programId.school} - ${application.programId.degree} -${application.programId.program_name}`,
    days_left:
      parseInt(
        getNumberOfDays(
          new Date(),
          application_deadline_calculator(student, application)
        )
      ) || '-'
  };
};

export const open_tasks = (students) => {
  const tasks = [];
  for (const student of students) {
    if (student.archiv !== true) {
      for (const thread of student.generaldocs_threads) {
        tasks.push(prepGeneralTask(student, thread));
      }
      for (const application of student.applications) {
        for (const thread of application.doc_modification_thread) {
          tasks.push(prepApplicationTask(student, application, thread));
        }
      }
    }
  }
  return tasks;
};

export const open_tasks_with_editors = (students) => {
  const tasks = [];
  for (const student of students) {
    if (student.archiv !== true) {
      for (const thread of student.generaldocs_threads) {
        tasks.push({
          ...prepGeneralTask(student, thread),
          isPotentials: false,
          editors: student.editors,
          agents: student.agents
        });
      }
      for (const application of student.applications) {
        for (const thread of application.doc_modification_thread) {
          tasks.push({
            ...prepApplicationTask(student, application, thread),
            isPotentials: application.decided === '-' ? true : false,
            editors: student.editors,
            agents: student.agents
          });
        }
      }
    }
  }
  return tasks;
};

export const programs_refactor = (students) => {
  const applications = [];
  for (const student of students) {
    let isMissingBaseDocs = false;

    let keys = Object.keys(profile_list);
    let object_init = {};
    for (let i = 0; i < keys.length; i++) {
      object_init[keys[i]] = DocumentStatus.Missing;
    }

    if (student.profile) {
      for (let i = 0; i < student.profile.length; i++) {
        if (student.profile[i].status === DocumentStatus.Uploaded) {
          object_init[student.profile[i].name] = DocumentStatus.Uploaded;
        } else if (student.profile[i].status === DocumentStatus.Accepted) {
          object_init[student.profile[i].name] = DocumentStatus.Accepted;
        } else if (student.profile[i].status === DocumentStatus.Rejected) {
          object_init[student.profile[i].name] = DocumentStatus.Rejected;
        } else if (student.profile[i].status === DocumentStatus.Missing) {
          object_init[student.profile[i].name] = DocumentStatus.Missing;
        } else if (student.profile[i].status === DocumentStatus.NotNeeded) {
          object_init[student.profile[i].name] = DocumentStatus.NotNeeded;
        }
      }
    }

    for (let i = 0; i < keys.length; i += 1) {
      if (
        object_init[keys[i]] !== DocumentStatus.Accepted &&
        object_init[keys[i]] !== DocumentStatus.NotNeeded
      ) {
        isMissingBaseDocs = true;
        break;
      }
    }
    const is_cv_done = isCVFinished(student);

    if (
      student.applications === undefined ||
      student.applications.length === 0
    ) {
      applications.push({
        target_year: `${
          student.application_preference?.expected_application_date || '-'
        } ${
          student.application_preference?.expected_application_semester || '-'
        }`,
        school: 'No University',
        application: {},
        student: student,
        firstname_lastname: `${student.firstname}, ${student.lastname}`,
        program_name: 'No Program',
        program: 'No Program',
        editors: student.editors?.map((editor) => editor.firstname).join(', '),
        agents: student.agents?.map((agent) => agent.firstname).join(', '),
        semester: '-',
        degree: '-',
        toefl: '-',
        ielts: '-',
        testdaf: '-',
        program_id: '-',
        application_deadline: '-',
        decided: '-',
        closed: '-',
        admission: '-',
        student_id: student._id.toString(),
        deadline: '-',
        days_left: '-',
        base_docs: '-',
        uniassist: '-',
        cv: '-',
        ml_rl: '-',
        ready: '-',
        show: '-',
        status: '-'
      });
    } else {
      for (const application of student.applications) {
        applications.push({
          target_year: `${
            student.application_preference?.expected_application_date || '-'
          } ${
            student.application_preference?.expected_application_semester || '-'
          }`,
          school: application.programId.school,
          application,
          student: student,
          firstname_lastname: `${student.firstname}, ${student.lastname}`,
          program_name: application.programId.program_name,
          program: `${application.programId.school} - ${application.programId.program_name} (${application.programId.degree})`,
          editors: student.editors
            ?.map((editor) => editor.firstname)
            .join(', '),
          agents: student.agents?.map((agent) => agent.firstname).join(', '),
          semester: application.programId.semester,
          degree: application.programId.degree,
          toefl: application.programId.toefl,
          ielts: application.programId.ielts,
          testdaf: application.programId.testdaf,
          whoupdated: application.programId.whoupdated,
          updatedAt: application.programId.updatedAt,
          program_id: application.programId._id.toString(),
          application_deadline: application_deadline_calculator(
            student,
            application
          ),
          decided: application.decided,
          closed: application.closed,
          admission: application.admission,
          student_id: student._id.toString(),
          deadline: application_deadline_calculator(student, application),
          days_left:
            parseInt(
              getNumberOfDays(
                new Date(),
                application_deadline_calculator(student, application)
              )
            ) || '-',
          base_docs:
            application.closed === 'O' ? '-' : isMissingBaseDocs ? 'X' : 'O',
          uniassist:
            application.closed === 'O'
              ? '-'
              : check_program_uni_assist_needed(application)
              ? application.uni_assist &&
                application.uni_assist.status === DocumentStatus.Uploaded
                ? 'O'
                : 'X'
              : 'Not Needed',
          cv: application.closed === 'O' ? '-' : is_cv_done ? 'O' : 'X',
          ml_rl:
            application.decided === 'O'
              ? application.closed === 'O'
                ? '-'
                : is_program_ml_rl_essay_finished(application)
                ? 'O'
                : 'X'
              : 'X',
          ready:
            application.decided === 'O'
              ? application.closed === 'O'
                ? '-'
                : !isMissingBaseDocs &&
                  (!check_program_uni_assist_needed(application) ||
                    (check_program_uni_assist_needed(application) &&
                      application.uni_assist &&
                      application.uni_assist.status ===
                        DocumentStatus.Uploaded)) &&
                  is_cv_done &&
                  is_program_ml_rl_essay_finished(application)
                ? 'Ready!'
                : 'No'
              : 'Undecided',
          show: application.decided === 'O' ? true : false,
          status:
            application_deadline_calculator(student, application) === 'CLOSE'
              ? 100
              : progressBarCounter(student, application)
        });
      }
    }
  }
  return applications;
};

export const getNextProgramName = (student) => {
  const getNextProgram = programs_refactor([student])
    .filter(
      (application) => application.decided === 'O' && application.closed === '-'
    )
    .sort((a, b) => (a.application_deadline > b.application_deadline ? 1 : -1));
  return getNextProgram.length !== 0 ? getNextProgram[0].program : '-';
};
export const getNextProgramDeadline = (student) => {
  const getNextProgram = programs_refactor([student])
    .filter(
      (application) => application.decided === 'O' && application.closed === '-'
    )
    .sort((a, b) => (a.application_deadline > b.application_deadline ? 1 : -1));
  return getNextProgram.length !== 0
    ? getNextProgram[0].application_deadline
    : '-';
};
export const getNextProgramDayleft = (student) => {
  const getNextProgram = programs_refactor([student])
    .filter(
      (application) => application.decided === 'O' && application.closed === '-'
    )
    .sort((a, b) => (a.application_deadline > b.application_deadline ? 1 : -1));
  return getNextProgram.length !== 0 ? getNextProgram[0].days_left : '-';
};
export const getNextProgramStatus = (student) => {
  const getNextProgram = programs_refactor([student])
    .filter(
      (application) => application.decided === 'O' && application.closed === '-'
    )
    .sort((a, b) => (a.application_deadline > b.application_deadline ? 1 : -1));
  return getNextProgram.length !== 0 ? (
    <span
      className={`${
        progressBarCounter(student, getNextProgram[0].application) < 100
          ? progressBarCounter(student, getNextProgram[0].application) < 75
            ? progressBarCounter(student, getNextProgram[0].application) < 30
              ? 'text-danger' // 15 > x
              : 'text-secondary' // 60 > x > 15
            : 'text-warning' // 100 > x >60
          : ''
      }`}
    >
      {`${progressBarCounter(student, getNextProgram[0].application)} %`}
    </span>
  ) : (
    '-'
  );
};

export const numStudentYearDistribution = (students) => {
  const map = {};
  for (let i = 0; i < students.length; i++) {
    if (students[i].application_preference.expected_application_date) {
      map[students[i].application_preference.expected_application_date] = map[
        students[i].application_preference.expected_application_date
      ]
        ? map[students[i].application_preference.expected_application_date] + 1
        : 1;
    } else {
      map['TBD'] = map['TBD'] ? map['TBD'] + 1 : 1;
    }
  }
  return map;
};

export const frequencyDistribution = (tasks) => {
  const map = {};
  for (let i = 0; i < tasks.length; i++) {
    map[tasks[i].deadline] = map[tasks[i].deadline]
      ? tasks[i].show
        ? {
            show: map[tasks[i].deadline].show + 1,
            potentials: map[tasks[i].deadline].potentials
          }
        : tasks[i].isPotentials
        ? {
            show: map[tasks[i].deadline].show,
            potentials: map[tasks[i].deadline].potentials + 1
          }
        : {
            show: map[tasks[i].deadline].show,
            potentials: map[tasks[i].deadline].potentials
          }
      : tasks[i].show
      ? { show: 1, potentials: 0 }
      : tasks[i].isPotentials
      ? { show: 0, potentials: 1 }
      : { show: 0, potentials: 0 };
  }
  return map;
};

export const isDocumentsMissingAssign = (application) => {
  const keys = Object.keys(file_category_const);
  let flag = false;
  for (let i = 0; i < keys.length; i += 1) {
    flag =
      flag ||
      (application.decided === 'O' &&
        application.programId[keys[i]] === 'yes' &&
        application.doc_modification_thread.findIndex(
          (thread) =>
            thread.doc_thread_id.file_type === file_category_const[keys[i]]
        ) === -1);
  }
  return flag;
};
