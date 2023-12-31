const DEMO = {
  BLANK_LINK: '#',
  ASSIGN_AGENT_LINK: '/assignment/agents',
  ASSIGN_EDITOR_LINK: '/assignment/editors',
  ACCOUNTING_USER_ID_LINK: (user_id) => {
    return `/internal/accounting/users/${user_id}`;
  },
  COURSES_LINK: '/my-courses',
  COMMUNICATIONS_LINK: (student_id) => {
    return `/communications/${student_id}`;
  },
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
  SINGLE_PROGRAM_LINK: (program_id) => {
    return `/programs/${program_id}`;
  },
  PORTALS_MANAGEMENT_LINK: '/portal-informations',
  PORTALS_MANAGEMENT_STUDENTID_LINK: (student_id) => {
    return `/portal-informations/${student_id}`;
  },
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
  TEAM_AGENT_LINK: (agent_id) => {
    return `/teams/agents/${agent_id}`;
  },
  TEAM_AGENT_ARCHIV_LINK: (agent_id) => {
    return `/teams/agents/archiv/${agent_id}`;
  },
  TEAM_AGENT_PROFILE_LINK: (agent_id) => {
    return `/teams/agents/profile/${agent_id}`;
  },
  TEAM_EDITOR_LINK: (editor_id) => {
    return `/teams/editors/${editor_id}`;
  },
  TEAM_EDITOR_ARCHIV_LINK: (editor_id) => {
    return `/teams/editors/archiv/${editor_id}`;
  },
  TEAM_EDITOR_PROFILE_LINK: (editor_id) => {
    return `/teams/editors/profile/${editor_id}`;
  },
  SETTINGS: '/settings',
  PROFILE: '/profile'
};

export default DEMO;
