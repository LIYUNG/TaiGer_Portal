const DEMO = {
  BLANK_LINK: '#',
  COURSES_LINK: '/my-courses',
  DASHBOARD_LINK: '/dashboard/default',
  DOCUMENT_MODIFICATION_LINK: (thread_id) => {
    return `/document-modification/${thread_id}`;
  },
  DOCUMENT_MODIFICATION_INPUT_LINK: (thread_id) => {
    return `/document-modification/student-input/${thread_id}`;
  },
  MY_INTERVIEW_LINK: '/interview-training/my-interviews',
  INTERVIEW_LINK: '/interview-training',
  UNI_ASSIST_LINK: '/uni-assist',
  CV_ML_RL_CENTER_LINK: '/cv-ml-rl-center',
  CV_ML_RL_DOCS_LINK: '/docs/cv-ml-rl',
  CV_ML_RL_DASHBOARD_LINK: '/dashboard/cv-ml-rl',
  BASE_DOCUMENTS_LINK: '/base-documents',
  PORTALS_MANAGEMENT_LINK: '/portal-informations',
  SURVEY_LINK: '/survey',
  STUDENT_APPLICATIONS_LINK: '/student-applications',
  STUDENT_APPLICATIONS_ID_LINK: (student_id) => {
    return `/student-applications/${student_id}`;
  },
  STUDENT_DATABASE_STUDENTID_LINK: (student_id, path) => {
    return `/student-database/${student_id}${path}`;
  },
  STUDENT_DATABASE_LINK: '/student-database',
  EVENT_STUDENT_LINK: '/events/students',
  EVENT_TAIGER_LINK: '/events/taiger',
  SETTINGS: '/settings',
  PROFILE: '/profile'
};

export default DEMO;
