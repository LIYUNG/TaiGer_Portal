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

        - ${student.applications[i].programId.school} ${student.applications[i].programId.program_name} ${student.applications[i].closed}`;
        x += 1;
      } else {
        unsubmitted_applications += `

        - ${student.applications[i].programId.school} - ${student.applications[i].programId.program_name}  ${student.applications[i].closed}`;
      }
    }
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
        The following documents are not okay, please replay your editor as soon as possible:

        - ${student.applications[i].programId.school} ${student.applications[i].programId.program_name} ${student.applications[i].doc_modification_thread[j].doc_thread_id.file_type}`;
            kk += 1;
          } else {
            missing_doc_list += `

        - ${student.applications[i].programId.school} ${student.applications[i].programId.program_name} ${student.applications[i].doc_modification_thread[j].doc_thread_id.file_type}`;
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
        The following documents are not okay, please replay your editor as soon as possible:

        - ${student.applications[i].programId.school} ${student.applications[i].programId.program_name} ${student.applications[i].doc_modification_thread[j].doc_thread_id.file_type}`;
            kk += 1;
          } else {
            missing_doc_list += `

        - ${student.applications[i].programId.school} ${student.applications[i].programId.program_name} ${student.applications[i].doc_modification_thread[j].doc_thread_id.file_type}`;
          }
        }
      } else if (user.role === 'Agent') {
        if (
          !student.applications[i].doc_modification_thread[j].isFinalVersion
        ) {
          if (kk === 0) {
            missing_doc_list = `
        The following documents are not okay, please replay your editor as soon as possible:

        - ${student.applications[i].programId.school} ${student.applications[i].programId.program_name} ${student.applications[i].doc_modification_thread[j].doc_thread_id.file_type}`;
            kk += 1;
          } else {
            missing_doc_list += `

        - ${student.applications[i].programId.school} ${student.applications[i].programId.program_name} ${student.applications[i].doc_modification_thread[j].doc_thread_id.file_type}`;
          }
        }
      }
    }
  }
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

const ml_rl_essay_summary = (student) => {
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
        The following base documents are still missing, please upload them as soon as possible:

        - ${profile_list[profile_keys_list[i]]}`;
      } else {
        missing_base_documents += `

        - ${profile_list[profile_keys_list[i]]}`;
      }
    }
    if (object_init[profile_keys_list[i]] === 'rejected') {
      if (yy === 0) {
        yy += 1;
        rejected_base_documents = `
        The following base documents are not okay, please upload them again as soon as possible:
         
        - ${profile_list[profile_keys_list[i]]}`;
      } else {
        rejected_base_documents += `

        - ${profile_list[profile_keys_list[i]]}`;
      }
    }
  }
  return { rejected_base_documents, missing_base_documents };
};

module.exports = {
  DocumentStatus,
  CheckListStatus,
  TaskStatus,
  RLs_CONSTANT,
  ml_rl_essay_summary,
  unsubmitted_applications_summary,
  cv_ml_rl_unfinished_summary,
  profile_list,
  profile_keys_list,
  profile_name_list,
  getNumberOfDays
};
