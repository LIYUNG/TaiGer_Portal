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

const TaskStatus = {
  Finished: 'finished',
  Locked: 'locked',
  Open: 'Open',
  Pending: 'pending',
  NotNeeded: 'notneeded'
};
const RLs_CONSTANT = ['RL_A', 'RL_B', 'RL_C'];

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

module.exports = {
  DocumentStatus,
  CheckListStatus,
  TaskStatus,
  RLs_CONSTANT,
  profile_name_list
};
