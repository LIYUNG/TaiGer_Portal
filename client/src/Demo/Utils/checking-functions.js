export const showButtonIfMyStudent = (user, student) => {
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

export const check_if_there_is_language_info = (academic_background) => {
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

export const check_if_there_is_english_language_info = (
  academic_background
) => {
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

export const check_german_language_passed = (academic_background) => {
  if (!academic_background || !academic_background.language) {
    return false;
  }
  if (academic_background.language.german_isPassed === 'O') {
    return true;
  }

  return false;
};

export const are_base_documents_missing = (student) => {
  let documentlist2_keys = Object.keys(window.profile_list);
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
      object_init[documentlist2_keys[i]] !== 'accepted' ||
      object_init[documentlist2_keys[i]] !== 'notneeded'
    ) {
      return true;
    }
  }
  return false;
};

export const check_base_documents = (student) => {
  let documentlist2_keys = Object.keys(window.profile_list);
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
    return false;
  }
  for (let i = 0; i < documentlist2_keys.length; i++) {
    if (object_init[documentlist2_keys[i]] === 'uploaded') {
      return false;
    }
  }
  return true;
};

export const check_base_documents_rejected = (student) => {
  let documentlist2_keys = Object.keys(window.profile_list);
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
  if (!application.programId.application_deadline) {
    return 'No Data';
  }
  if (application.programId.application_deadline.includes('olling')) {
    // include Rolling
    return 'Rolling';
  }
  // let year_now = new Date().getFullYear();
  let application_year = '<TBD>';
  if (
    student.application_preference &&
    student.application_preference.expected_application_date !== ''
  ) {
    application_year = parseInt(
      student.application_preference.expected_application_date
    );
  }
  if (!application.programId.application_deadline) {
    return `${application_year}-<TBD>`;
  }
  let application_semester = application.programId.semester;
  let deadline_month = parseInt(
    application.programId.application_deadline.split('-')[0]
  );
  let deadline_day = parseInt(
    application.programId.application_deadline.split('-')[1]
  );
  if (application_semester === undefined) {
    return 'Err';
  }
  if (application_semester === 'WS') {
    if (deadline_month > 9) {
      application_year = application_year - 1;
    }
  }
  if (application_semester === 'SS') {
    if (deadline_month > 3) {
      application_year = application_year - 1;
    }
  }

  return `${application_year}-${deadline_month}-${deadline_day}`;
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

export const checkSurveyCompleted = (keys, object_init) => {
  for (let i = 0; i < keys.length; i += 1) {
    if (
      object_init[keys[i]] !== 'accepted' &&
      object_init[keys[i]] !== 'notneeded' &&
      object_init[keys[i]] !== 'uploaded'
    ) {
      return true;
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
  if (student.applications === undefined) {
    return false;
  }
  if (student.applying_program_count === 0) {
    return false;
  }
  if (student.applications.length < student.applying_program_count) {
    return false;
  }
  if (!student.applications || student.applications.length === 0) {
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
  if (student.applications === undefined) {
    return false;
  }
  if (student.applications.length === 0) {
    return false;
  }
  for (let i = 0; i < keys.length; i += 1) {
    for (let j = 0; j < student.applications.length; j += 1) {
      if (
        !student.applications[j].closed ||
        (student.applications[j].closed !== undefined &&
          student.applications[j].closed !== 'O')
      ) {
        return false;
      }
    }
  }
  return true;
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

export const check_uni_assist_needed = (student) => {
  if (student.applications === undefined) {
    return false;
  }
  for (let j = 0; j < student.applications.length; j += 1) {
    if (
      student.applications[j].decided === 'O' &&
      student.applications[j].programId.uni_assist &&
      (student.applications[j].programId.uni_assist.includes('VPD') ||
        student.applications[j].programId.uni_assist.includes('FULL'))
    ) {
      return true;
    }
  }
  return false;
};

export const num_uni_assist_vpd_uploaded = (student) => {
  let counter = 0;
  if (student.applications === undefined) {
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
      if (
        student.applications[j].uni_assist &&
        (student.applications[j].uni_assist.status === 'uploaded' ||
          student.applications[j].uni_assist.vpd_file_path !== '' ||
          student.applications[j].uni_assist.vpd_file_path === null)
      ) {
        counter += 1;
      }
    }
  }
  return counter;
};

export const num_uni_assist_vpd_needed = (student) => {
  let counter = 0;
  if (student.applications === undefined) {
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
  for (let i = 0; i < application.doc_modification_thread.length; i += 1) {
    if (!application.doc_modification_thread[i].isFinalVersion) {
      return false;
    }
  }
  return true;
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

export const is_cv_finished = (student) => {
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
  const cv_thread = student.generaldocs_threads.find(
    (thread) => thread.doc_thread_id.file_type === 'CV'
  );

  if (!cv_thread.isFinalVersion) {
    return false;
  }
  return true;
};

export const is_program_ready_to_submit = (application) => {
  // check ML, RL, Essay
  for (let i = 0; i < application.doc_modification_thread.length; i += 1) {
    if (!application.doc_modification_thread[i].isFinalVersion) {
      return false;
    }
  }
  // check uni-assist?
  if (
    application.programId.uni_assist &&
    application.programId.uni_assist.includes('Yes') &&
    (!application.uni_assist || application.uni_assist.status !== 'uploaded')
  ) {
    return false;
  }
  // check basedocuments

  // Check CV
  return true;
};

export const is_program_closed = (application) => {
  if (application.closed === 'O') {
    return true;
  }
  return false;
};

export const is_all_uni_assist_vpd_uploaded = (student) => {
  if (student.applications === undefined) {
    return false;
  }
  for (let j = 0; j < student.applications.length; j += 1) {
    if (
      student.applications[j].decided === 'O' &&
      student.applications[j].programId.uni_assist &&
      (student.applications[j].programId.uni_assist.includes('VPD') ||
        student.applications[j].programId.uni_assist.includes('FULL'))
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
