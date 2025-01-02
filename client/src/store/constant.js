const DEMO = {
    AGENT_SUPPORT_DOCUMENTS: (tab) => {
        return `/agent-support-documents#${tab}`;
    },
    ASSIGN_AGENT_LINK: '/assignment/agents',
    ASSIGN_EDITOR_LINK: '/assignment/editors',
    ASSIGN_ESSAY_WRITER_LINK: '/assignment/essay-writers',
    ACCOUNTING_LINK: '/internal/accounting',
    ACCOUNTING_USER_ID_LINK: (user_id) => {
        return `/internal/accounting/users/${user_id}`;
    },
    BASE_DOCUMENTS_LINK: '/base-documents',
    BLANK_LINK: '#',
    COURSES_LINK: '/my-courses',
    COURSES_INPUT_LINK: (student_id) => {
        return `/my-courses/${student_id}`;
    },
    COURSES_ANALYSIS_RESULT_LINK: (student_id) => {
        return `/my-courses/analysis/${student_id}`;
    },
    COURSES_ANALYSIS_EXPLANATION_LINK: '/docs/search/64c3817811e606a89a10ea47',
    COMMUNICATIONS_LINK: (student_id) => {
        return `/communications/std/${student_id}`;
    },
    COMMUNICATIONS_TAIGER_MODE_LINK: (student_id) => {
        return `/communications/t/${student_id}`;
    },
    CUSTOMER_CENTER_LINK: '/customer-center',
    CUSTOMER_CENTER_ADD_TICKET_LINK: '/customer-center/add-ticket',
    CUSTOMER_CENTER_TICKET_DETAIL_PAGE_LINK: (ticket_id) => {
        return `/customer-center/tickets/${ticket_id}`;
    },
    CV_ML_RL_CENTER_LINK: '/cv-ml-rl-center',
    CV_ML_RL_DOCS_LINK: '/docs/cv-ml-rl',
    CV_ML_RL_DASHBOARD_LINK: '/dashboard/cv-ml-rl',
    DASHBOARD_LINK: '/dashboard/default',
    DOCUMENT_MODIFICATION_LINK: (thread_id) => {
        return `/document-modification/${thread_id}`;
    },
    DOCS_ROOT_LINK: (category) => {
        return `/docs/${category}`;
    },
    DOCUMENT_MODIFICATION_INPUT_LINK: (thread_id) => {
        return `/document-modification/${thread_id}/survey`;
    },
    EVENT_STUDENT_LINK: '/events/students',
    EVENT_STUDENT_STUDENTID_LINK: (student_id) => {
        return `/events/students/${student_id}`;
    },
    EVENT_TAIGER_LINK: (user_id) => {
        return `/events/taiger/${user_id}`;
    },
    EVENT_TAIGER_USERID_LINK: '/events/taiger',
    FORGOT_PASSWORD_LINK: '/account/forgot-password',
    LANDING_PAGE_LINK: '/account/home',
    INTERVIEW_LINK: '/interview-training',
    INTERVIEW_ADD_LINK: '/interview-training/add',
    INTERVIEW_SINGLE_LINK: (interview_id) => {
        return `/interview-training/${interview_id}`;
    },
    INTERVIEW_SINGLE_SURVEY_LINK: (interview_id) => {
        return `/interview-training/${interview_id}/survey`;
    },
    INTERNAL_WIDGET_COURSE_ANALYSER_LINK: '/internal/widgets/course-analyser',
    INTERNAL_WIDGET_LINK: (user_id) => {
        return `/internal/widgets/${user_id}`;
    },
    INTERNAL_WIDGET_V2_LINK: (user_id) => {
        return `/internal/widgets/course-analyser/v2/${user_id}`;
    },
    COURSES_ANALYSIS_RESULT_V2_LINK: (user_id) => {
        return `/my-courses/analysis/v2/${user_id}`;
    },
    INTERNAL_LOGS_LINK: '/internal/logs',
    INTERNAL_LOGS_USER_ID_LINK: (user_id) => {
        return `/internal/logs/${user_id}`;
    },
    LOGIN_LINK: '/account/login',
    MY_INTERVIEW_LINK: '/interview-training/my-interviews',
    PROFILE: '/profile',
    APPLICATION_HASH: '#applications',
    PROFILE_HASH: '#profile',
    CVMLRL_HASH: '#cvmlrl',
    PORTAL_HASH: '#portal',
    UNIASSIST_HASH: '#uniassist',
    SURVEY_HASH: '#survey',
    COURSES_HASH: '#courses',
    NOTES_HASH: '#notes',
    PROFILE_STUDENT_LINK: (user_id) => {
        return `/profile/${user_id}`;
    },
    PROGRAMS: '/programs',
    SCHOOL_CONFIG: '/programs/config',
    NEW_PROGRAM: '/programs/create',
    PROGRAM_EDIT: (program_id) => `/programs/${program_id}/edit`,
    COURSE_DATABASE: '/courses/analysis/courses/all',
    COURSE_DATABASE_EDIT: (courseId) =>
        `/courses/analysis/courses/edit/${courseId}`,
    COURSE_DATABASE_NEW: '/courses/analysis/courses/new',
    KEYWORDS_EDIT: '/courses/analysis/keywords',
    KEYWORDS_NEW: '/courses/analysis/keywords/new',
    CREATE_NEW_PROGRAM_ANALYSIS: '/courses/analysis/programs/requirements/new',
    EDIT_PROGRAM_ANALYSIS: (requirementId) => {
        return `/courses/analysis/programs/requirements/${requirementId}`;
    },
    PROGRAM_ANALYSIS: '/courses/analysis/programs',
    SINGLE_PROGRAM_LINK: (program_id) => {
        return `/programs/${program_id}`;
    },
    PORTALS_MANAGEMENT_LINK: '/portal-informations',
    PORTALS_MANAGEMENT_STUDENTID_LINK: (student_id) => {
        return `/portal-informations/${student_id}`;
    },
    SETTINGS: '/settings',
    STUDENT_APPLICATIONS_LINK: '/student-applications',
    STUDENT_APPLICATIONS_ID_LINK: (student_id) => {
        return `/student-applications/${student_id}`;
    },
    STUDENT_DATABASE_STUDENTID_LINK: (student_id, path) => {
        return `/student-database/${student_id}${path}`;
    },
    STUDENT_DATABASE_LINK: '/student-database',
    SURVEY_LINK: '/survey',
    TEAM_ADMIN_LINK: (admin_id) => {
        return `/teams/admins/${admin_id}`;
    },
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
    TEAM_MANAGER_LINK: (manager_id) => {
        return `/teams/managers/${manager_id}`;
    },
    TEAM_MEMBERS_LINK: '/teams/members',
    HOWTOSTART_DOCS_LINK: '/docs/howtostart',
    UNI_ASSIST_DOCS_LINK: '/docs/uniassist',
    VISA_DOCS_LINK: '/docs/visa',
    UNI_ASSIST_LINK: '/uni-assist'
};

export default DEMO;
