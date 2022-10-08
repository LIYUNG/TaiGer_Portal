export const check_survey_filled = (academic_background) => {
  if (
    !academic_background ||
    !academic_background.university ||
    !academic_background.language
  ) {
    return false;
  }
  // TODO: can add more mandatory field
  if (
    !academic_background.university.expected_application_date ||
    !academic_background.university.expected_application_semester
  ) {
    return false;
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

export const check_all_applications_decided = (keys, student) => {
  for (let i = 0; i < keys.length; i += 1) {
    if (student.applications) {
    }
    for (let j = 0; j < student.applications.length; j += 1)
      if (
        !student.applications[j].decided ||
        (student.applications[j].decided !== undefined &&
          student.applications[j].decided !== 'O')
      ) {
        return false;
      }
  }
  return true;
};

export const check_all_applications_submitted = (keys, student) => {
  if (student.applications.length === 0) {
    return false;
  }
  for (let i = 0; i < keys.length; i += 1) {
    for (let j = 0; j < student.applications.length; j += 1)
      if (
        !student.applications[j].closed ||
        (student.applications[j].closed !== undefined &&
          student.applications[j].closed !== 'O')
      ) {
        return false;
      }
  }
  return true;
};

export const check_generaldocs = (student) => {
  if (
    student.generaldocs_threads.findIndex(
      (thread) => thread.doc_thread_id.file_type === 'CV'
    ) === -1 ||
    student.generaldocs_threads.filter((thread) =>
      thread.doc_thread_id.file_type.includes('RL')
    ).length < 2
  ) {
    return true;
  } else {
    return false;
  }
};
