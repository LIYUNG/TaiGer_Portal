import { getNumberOfDays, convertDate, profile_list } from './contants';
export const is_TaiGer_role = (user) =>
  user.role === 'Admin' || user.role === 'Agent' || user.role === 'Editor';
export const is_TaiGer_AdminAgent = (user) =>
  user.role === 'Admin' || user.role === 'Agent';
export const is_TaiGer_Admin = (user) => user.role === 'Admin';
export const is_TaiGer_Editor = (user) => user.role === 'Editor';
export const is_TaiGer_Agent = (user) => user.role === 'Agent';
export const is_TaiGer_Student = (user) => user.role === 'Student';
export const is_TaiGer_Guest = (user) => user.role === 'Guest';

export const showButtonIfMyStudent = (user, student) => {
  if (
    is_TaiGer_Admin(user) ||
    is_TaiGer_Student(user) ||
    is_TaiGer_Guest(user)
  ) {
    return true;
  }
  // check user as Agetn Editor, if student belongs to him/her
  if (
    student.agents.findIndex((agent) =>
      typeof agent === String
        ? user._id.toString() === agent
        : user._id.toString() === agent._id.toString()
    ) !== -1 ||
    student.editors.findIndex((editor) =>
      typeof editor === String
        ? user._id.toString() === editor
        : user._id.toString() === editor._id.toString()
    ) !== -1
  ) {
    return true;
  }

  return false;
};

export const showButtonIfMyStudentB = (user, student) => {
  if (
    user.role === 'Admin' ||
    user.role === 'Student' ||
    user.role === 'Guest'
  ) {
    return true;
  }
  // check user as Agetn Editor, if student belongs to him/her
  if (
    student.agents.findIndex((agent) =>
      typeof agent === String
        ? user._id.toString() === agent
        : user._id.toString() === agent.toString()
    ) !== -1 ||
    student.editors.findIndex((editor) =>
      typeof editor === String
        ? user._id.toString() === editor
        : user._id.toString() === editor.toString()
    ) !== -1
  ) {
    return true;
  }

  return false;
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
  if (!academic_background || !academic_background.language) {
    return false;
  }
  if (academic_background.language.english_isPassed === 'O') {
    return true;
  }

  return false;
};

export const check_english_language_Notneeded = (academic_background) => {
  if (!academic_background || !academic_background.language) {
    return false;
  }
  if (academic_background.language.english_isPassed === '--') {
    return true;
  }

  return false;
};

export const check_german_language_passed = (academic_background) => {
  if (!academic_background || !academic_background.language) {
    return false;
  }
  if (academic_background.language.german_isPassed === 'O') {
    return true;
  }

  return false;
};

export const check_german_language_Notneeded = (academic_background) => {
  if (!academic_background || !academic_background.language) {
    return false;
  }
  if (academic_background.language.german_isPassed === '--') {
    return true;
  }

  return false;
};

export const are_base_documents_missing = (student) => {
  let documentlist2_keys = Object.keys(profile_list);
  let object_init = {};
  for (let i = 0; i < documentlist2_keys.length; i++) {
    object_init[documentlist2_keys[i]] = 'missing';
  }
  if (student.profile === undefined) {
    return true;
  }
  if (student.profile.length === 0) {
    return true;
  }

  for (let i = 0; i < student.profile.length; i++) {
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

  for (let i = 0; i < documentlist2_keys.length; i++) {
    if (
      object_init[documentlist2_keys[i]] !== 'accepted' &&
      object_init[documentlist2_keys[i]] !== 'notneeded'
    ) {
      return true;
    }
  }
  return false;
};

export const are_base_documents_uploaded = (student) => {
  let documentlist2_keys = Object.keys(profile_list);
  let object_init = {};
  for (let i = 0; i < documentlist2_keys.length; i++) {
    object_init[documentlist2_keys[i]] = 'missing';
  }
  if (student.profile === undefined) {
    return true;
  }
  if (student.profile.length === 0) {
    return true;
  }

  for (let i = 0; i < student.profile.length; i++) {
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

  for (let i = 0; i < documentlist2_keys.length; i++) {
    if (object_init[documentlist2_keys[i]] === 'uploaded') {
      return true;
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
        object_init[documentlist2_keys[i]] = 'missing';
      }
      if (students[i].profile === undefined) {
        return false;
      }
      if (students[i].profile.length === 0) {
        return false;
      }

      for (let j = 0; j < students[i].profile.length; j += 1) {
        if (students[i].profile[j].status === 'uploaded') {
          object_init[students[i].profile[j].name] = 'uploaded';
        } else if (students[i].profile[j].status === 'accepted') {
          object_init[students[i].profile[j].name] = 'accepted';
        } else if (students[i].profile[j].status === 'rejected') {
          object_init[students[i].profile[j].name] = 'rejected';
        } else if (students[i].profile[j].status === 'missing') {
          object_init[students[i].profile[j].name] = 'missing';
        } else if (students[i].profile[j].status === 'notneeded') {
          object_init[students[i].profile[j].name] = 'notneeded';
        }
      }

      for (let i = 0; i < documentlist2_keys.length; i++) {
        if (object_init[documentlist2_keys[i]] === 'uploaded') {
          return true;
        }
      }
    }
  }
  return false;
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
  let documentlist2_keys = Object.keys(profile_list);
  let object_init = {};
  for (let i = 0; i < documentlist2_keys.length; i++) {
    object_init[documentlist2_keys[i]] = 'missing';
  }
  if (student.profile === undefined) {
    return false;
  }
  if (student.profile.length === 0) {
    return false;
  }
  for (let i = 0; i < student.profile.length; i++) {
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

  for (let i = 0; i < documentlist2_keys.length; i++) {
    if (object_init[documentlist2_keys[i]] === 'rejected') {
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
    ((!academic_background.language.english_isPassed ||
      academic_background.language.english_isPassed === '-') &&
      (!academic_background.language.german_isPassed ||
        academic_background.language.german_isPassed === '-'))
  ) {
    return false;
  }
  // if test date expired:
  const today = new Date();
  if (
    (academic_background.language.english_isPassed === 'X' &&
      getNumberOfDays(academic_background.language.english_test_date, today) >
        1) ||
    (academic_background.language.english_isPassed === 'X' &&
      academic_background.language.english_test_date === '') ||
    (academic_background.language.german_isPassed === 'X' &&
      getNumberOfDays(academic_background.language.german_test_date, today) >
        1) ||
    (academic_background.language.german_isPassed === 'X' &&
      academic_background.language.german_test_date === '')
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
    !academic_background.university.attended_high_school ||
    !academic_background.university.high_school_isGraduated ||
    academic_background.university.high_school_isGraduated === '-' ||
    !academic_background.university.Has_Exchange_Experience ||
    academic_background.university.Has_Exchange_Experience === '-' ||
    !academic_background.university.attended_university ||
    !academic_background.university.attended_university_program
    // ||
    // !academic_background.university.isGraduated
  ) {
    return false;
  }

  return true;
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
  if (
    student.application_preference &&
    student.application_preference.expected_application_date !== ''
  ) {
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
  let deadline_day = parseInt(
    application.programId.application_deadline.split('-')[1]
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
    application.programId.application_deadline.split('-')[0]
  }/${application.programId.application_deadline.split('-')[1]}`;
};

export const GetCVDeadline = (student) => {
  var today = new Date();
  let daysLeftMin = 3000;
  let CVDeadline = '';
  student.applications.forEach((application) => {
    if (application.decided === 'O') {
      const applicationDeadline = application_deadline_calculator(
        student,
        application
      );
      const daysLeft = parseInt(getNumberOfDays(today, applicationDeadline));

      if (daysLeft < daysLeftMin) {
        daysLeftMin = daysLeft;
        CVDeadline = applicationDeadline;
      }
    }
  });
  return daysLeftMin === 3000
    ? { daysLeftMin: '-', CVDeadline: '-' }
    : { daysLeftMin, CVDeadline };
};

export const check_application_preference_filled = (application_preference) => {
  if (!application_preference) {
    return false;
  }
  // TODO: can add more mandatory field
  if (
    !application_preference.expected_application_date ||
    !application_preference.expected_application_semester
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

export const num_applications_decided = (student) => {
  if (student.applications === undefined) {
    return 0;
  }
  const num_apps_decided = student.applications.filter(
    (app) => app.decided === 'O'
  ).length;
  return num_apps_decided;
};

export const num_applications_submitted = (student) => {
  if (student.applications === undefined) {
    return 0;
  }
  const num_apps_closed = student.applications.filter(
    (app) => app.closed === 'O'
  ).length;
  return num_apps_closed;
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

export const check_all_applications_submitted = (keys, student) => {
  if (!student.applications || student.applications.length === 0) {
    return false;
  }

  return student.applications.every((app) => app.closed === 'O');
};

export const check_program_uni_assist_needed = (application) => {
  if (!application.programId.uni_assist) {
    return false;
  }
  if (application.programId.uni_assist.includes('Yes')) {
    return true;
  }

  return false;
};

export const is_uni_assist_vpd_needed = (application) => {
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
      application.uni_assist.status === 'notneeded'
    ) {
      return false;
    }

    if (
      application.uni_assist &&
      (application.uni_assist.status !== 'uploaded' ||
        application.uni_assist.vpd_file_path === '')
    ) {
      return true;
    }
  }

  return false;
};

export const check_uni_assist_needed = (student) => {
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
      application.uni_assist.status !== 'notneeded' &&
      (application.uni_assist.status === 'uploaded' ||
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
        student.applications[j].uni_assist.status === 'notneeded'
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
    application.doc_modification_thread.length === 0 ||
    application.doc_modification_thread.every((thread) => thread.isFinalVersion)
  );
};

export const is_cv_assigned = (student) => {
  // check CV
  if (!student.generaldocs_threads) {
    return false;
  }
  if (
    student.generaldocs_threads.findIndex(
      (thread) => thread.doc_thread_id.file_type === 'CV'
    ) === -1
  ) {
    return false;
  }

  return true;
};

export const isCVFinished = (student) => {
  const cv_thread =
    student.generaldocs_threads &&
    student.generaldocs_threads.find(
      (thread) => thread.doc_thread_id.file_type === 'CV'
    );
  return !!(cv_thread && cv_thread.isFinalVersion);
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
              students[i].applications[j].uni_assist.status === 'notneeded'
            ) {
              continue;
            }
            if (
              students[i].applications[j].uni_assist &&
              (students[i].applications[j].uni_assist.status !== 'uploaded' ||
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
      application.uni_assist.status === 'uploaded' ||
      application.uni_assist.status === 'notneeded'
    ) {
      return true;
    }
    if (application.uni_assist.vpd_file_path === '') {
      return false;
    }
  }

  return true;
};

export const is_personal_data_filled = (student) => {
  if (
    student.birthday === undefined ||
    student.firstname_chinese === undefined ||
    student.lastname_chinese === undefined
  ) {
    return false;
  }
  if (
    student.birthday === '' ||
    student.firstname_chinese === '' ||
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
        student.applications[j].uni_assist.status === 'notneeded'
      ) {
        continue;
      }
      if (
        student.applications[j].uni_assist &&
        (student.applications[j].uni_assist.status !== 'uploaded' ||
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

export const open_tasks = (students) => {
  const tasks = [];
  for (const student of students) {
    const { CVDeadline, daysLeftMin } = GetCVDeadline(student);
    for (const thread of student.generaldocs_threads) {
      tasks.push({
        firstname_lastname: `${student.firstname}, ${student.lastname}`,
        latest_message_left_by_id: thread.latest_message_left_by_id,
        isFinalVersion: thread.isFinalVersion,
        file_type: thread.doc_thread_id.file_type,
        student_id: student._id.toString(),
        thread_id: thread.doc_thread_id._id.toString(),
        deadline: CVDeadline,
        show: true,
        aged_days: parseInt(
          getNumberOfDays(thread.doc_thread_id.updatedAt, new Date())
        ),
        days_left: daysLeftMin,
        document_name: `${thread.doc_thread_id.file_type}`,
        latest_reply:
          thread.doc_thread_id.messages.length > 0
            ? `${
                thread.doc_thread_id.messages[
                  thread.doc_thread_id.messages.length - 1
                ].user_id.firstname
              } ${
                thread.doc_thread_id.messages[
                  thread.doc_thread_id.messages.length - 1
                ].user_id.lastname
              }`
            : 'Empty',
        updatedAt: convertDate(thread.doc_thread_id.updatedAt)
      });
    }
    for (const application of student.applications) {
      for (const thread of application.doc_modification_thread) {
        tasks.push({
          firstname_lastname: `${student.firstname}, ${student.lastname}`,
          latest_message_left_by_id: thread.latest_message_left_by_id,
          isFinalVersion: thread.isFinalVersion,
          file_type: thread.doc_thread_id.file_type,
          student_id: student._id.toString(),
          deadline: application_deadline_calculator(student, application),
          aged_days: parseInt(
            getNumberOfDays(thread.doc_thread_id.updatedAt, new Date())
          ),
          days_left: parseInt(
            getNumberOfDays(
              new Date(),
              application_deadline_calculator(student, application)
            )
          ),
          program_id: application.programId._id.toString(),
          show: application.decided === 'O' ? true : false,
          thread_id: thread.doc_thread_id._id.toString(),
          document_name: `${thread.doc_thread_id.file_type} - ${application.programId.school} - ${application.programId.degree} -${application.programId.program_name}`,
          latest_reply:
            thread.doc_thread_id.messages.length > 0
              ? `${
                  thread.doc_thread_id.messages[
                    thread.doc_thread_id.messages.length - 1
                  ].user_id.firstname
                } ${
                  thread.doc_thread_id.messages[
                    thread.doc_thread_id.messages.length - 1
                  ].user_id.lastname
                }`
              : 'Empty',
          updatedAt: convertDate(thread.doc_thread_id.updatedAt)
        });
      }
    }
  }
  return tasks;
};

export const open_tasks_with_editors = (students) => {
  const tasks = [];
  for (const student of students) {
    const { CVDeadline, daysLeftMin } = GetCVDeadline(student);
    for (const thread of student.generaldocs_threads) {
      tasks.push({
        firstname_lastname: `${student.firstname}, ${student.lastname}`,
        latest_message_left_by_id: thread.latest_message_left_by_id,
        isFinalVersion: thread.isFinalVersion,
        file_type: thread.doc_thread_id.file_type,
        student_id: student._id.toString(),
        editors: student.editors,
        agents: student.agents,
        show: true,
        thread_id: thread.doc_thread_id._id.toString(),
        deadline: CVDeadline,
        aged_days: parseInt(
          getNumberOfDays(thread.doc_thread_id.updatedAt, new Date())
        ),
        days_left: daysLeftMin,
        document_name: `${thread.doc_thread_id.file_type}`,
        latest_reply:
          thread.doc_thread_id.messages &&
          thread.doc_thread_id.messages.length > 0
            ? `${
                thread.doc_thread_id.messages[
                  thread.doc_thread_id.messages.length - 1
                ].user_id.firstname
              } ${
                thread.doc_thread_id.messages[
                  thread.doc_thread_id.messages.length - 1
                ].user_id.lastname
              }`
            : 'Empty',
        updatedAt: convertDate(thread.doc_thread_id.updatedAt)
      });
    }
    for (const application of student.applications) {
      for (const thread of application.doc_modification_thread) {
        tasks.push({
          firstname_lastname: `${student.firstname}, ${student.lastname}`,
          latest_message_left_by_id: thread.latest_message_left_by_id,
          isFinalVersion: thread.isFinalVersion,
          file_type: thread.doc_thread_id.file_type,
          student_id: student._id.toString(),
          editors: student.editors,
          agents: student.agents,
          deadline: application_deadline_calculator(student, application),
          aged_days: parseInt(
            getNumberOfDays(thread.doc_thread_id.updatedAt, new Date())
          ),
          days_left: parseInt(
            getNumberOfDays(
              new Date(),
              application_deadline_calculator(student, application)
            )
          ),
          program_id: application.programId._id.toString(),
          show: application.decided === 'O' ? true : false,
          thread_id: thread.doc_thread_id._id.toString(),
          document_name: `${thread.doc_thread_id.file_type} - ${application.programId.school} - ${application.programId.degree} -${application.programId.program_name}`,
          latest_reply:
            thread.doc_thread_id.messages &&
            thread.doc_thread_id.messages.length > 0
              ? `${
                  thread.doc_thread_id.messages[
                    thread.doc_thread_id.messages.length - 1
                  ].user_id.firstname
                } ${
                  thread.doc_thread_id.messages[
                    thread.doc_thread_id.messages.length - 1
                  ].user_id.lastname
                }`
              : 'Empty',
          updatedAt: convertDate(thread.doc_thread_id.updatedAt)
        });
      }
    }
  }
  return tasks;
};

export const programs_refactor = (students) => {
  const applications = [];
  for (const student of students) {
    var application_deadline;
    let isMissingBaseDocs = false;

    let keys = Object.keys(profile_list);
    let object_init = {};
    for (let i = 0; i < keys.length; i++) {
      object_init[keys[i]] = 'missing';
    }

    if (student.profile) {
      for (let i = 0; i < student.profile.length; i++) {
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
    } else {
    }
    for (let i = 0; i < keys.length; i += 1) {
      if (
        object_init[keys[i]] !== 'accepted' &&
        object_init[keys[i]] !== 'notneeded'
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
        school: 'No University',
        firstname_lastname: `${student.firstname}, ${student.lastname}`,
        program_name: 'No Program',
        semester: '-',
        degree: '-',
        toefl: '-',
        ielts: '-',
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
        show: '-'
      });
    } else {
      for (const application of student.applications) {
        applications.push({
          school: application.programId.school,
          firstname_lastname: `${student.firstname}, ${student.lastname}`,
          program_name: application.programId.program_name,
          semester: application.programId.semester,
          degree: application.programId.degree,
          toefl: application.programId.toefl,
          ielts: application.programId.ielts,
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
          days_left: parseInt(
            getNumberOfDays(
              new Date(),
              application_deadline_calculator(student, application)
            )
          ),
          base_docs:
            application.closed === 'O' ? '-' : isMissingBaseDocs ? 'X' : 'O',
          uniassist:
            application.closed === 'O'
              ? '-'
              : check_program_uni_assist_needed(application)
              ? application.uni_assist &&
                application.uni_assist.status === 'uploaded'
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
                      application.uni_assist.status === 'uploaded')) &&
                  is_cv_done &&
                  is_program_ml_rl_essay_finished(application)
                ? 'Ready!'
                : 'No'
              : 'Undecided',
          show: application.decided === 'O' ? true : false
        });
      }
    }
  }
  return applications;
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
        : {
            show: map[tasks[i].deadline].show,
            potentials: map[tasks[i].deadline].potentials + 1
          }
      : tasks[i].show
      ? { show: 1, potentials: 0 }
      : { show: 0, potentials: 1 };
  }
  return map;
};

export const file_category_const = {
  ml_required: 'ML',
  essay_required: 'Essay',
  portfolio_required: 'Portfolio',
  supplementary_form_required: 'Supplementary_Form'
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
