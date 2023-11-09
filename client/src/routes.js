import React from 'react';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const DashboardDefault = React.lazy(() => import('./Demo/Dashboard/Dashboard'));

const AllArchivStudent = React.lazy(() =>
  import('./Demo/ArchivStudent/AllIndex')
);
const ArchivStudent = React.lazy(() => import('./Demo/ArchivStudent/index'));

const CommunicationSinglePage = React.lazy(() =>
  import('./Demo/Communications/CommunicationSinglePage')
);
const UniAssist = React.lazy(() => import('./Demo/UniAssist/index'));
const PortalCredentialPage = React.lazy(() =>
  import('./Demo/PortalCredentialPage/index')
);
const BaseDocuments = React.lazy(() =>
  import('./Demo/BaseDocuments/BaseDocuments')
);
const MyCourses = React.lazy(() => import('./Demo/MyCourses/index'));
const MyCoursesAnalysis = React.lazy(() =>
  import('./Demo/MyCourses/CourseAnalysis')
);
const CoursesAnalysisWidget = React.lazy(() =>
  import('./Demo/MyCourses/CourseWidget')
);
const CVMLRLOverview = React.lazy(() => import('./Demo/CVMLRLCenter/index'));
const CVMLRLDashboard = React.lazy(() =>
  import('./Demo/CVMLRLCenter/indexAll')
);
const AllApplicantsOverview = React.lazy(() =>
  import('./Demo/ApplicantsOverview/allStudentIndex')
);
const MyStudentOverviewPage = React.lazy(() =>
  import('./Demo/StudentOverview/MyStudentsOverview')
);
const StudentOverviewPage = React.lazy(() =>
  import('./Demo/StudentOverview/index')
);
const InternalDashboard = React.lazy(() =>
  import('./Demo/TaiGerOrg/InternalDashboard/index')
);
const Accounting = React.lazy(() => import('./Demo/Accounting/index'));
const SingleBalanceSheetOverview = React.lazy(() =>
  import('./Demo/Accounting/SingleBalanceSheetOverview')
);
const ProgramConflict = React.lazy(() =>
  import('./Demo/TaiGerOrg/ProgramConflict/index')
);
const TaiGerPermissions = React.lazy(() => import('./Demo/TaiGerOrg/index'));
const TaiGerUsersLog = React.lazy(() => import('./Demo/TaiGerOrg/Log/index'));
const TaiGerUserLog = React.lazy(() =>
  import('./Demo/TaiGerOrg/Log/SingleUserPage')
);
const TaiGerOrg = React.lazy(() =>
  import('./Demo/TaiGerOrg/TaiGerMember/index')
);
const TaiGerOrgAgent = React.lazy(() => import('./Demo/TaiGerOrg/AgentPage'));
const TaiGerMemberProfile = React.lazy(() =>
  import('./Demo/TaiGerPublicProfile/AgentProfile')
);
const AllOfficeHours = React.lazy(() => import('./Demo/OfficeHours/all_index'));
const TaiGerOfficeHours = React.lazy(() =>
  import('./Demo/OfficeHours/taiger_index')
);
const OfficeHours = React.lazy(() => import('./Demo/OfficeHours/index'));
const TaiGerOrgEditor = React.lazy(() => import('./Demo/TaiGerOrg/EditorPage'));
const TaiGerOrgAdmin = React.lazy(() => import('./Demo/TaiGerOrg/AdminPage'));
const ProgramList = React.lazy(() => import('./Demo/Program/ProgramList'));
const ApplicationsOverview = React.lazy(() =>
  import('./Demo/ApplicantsOverview/index')
);
const LearningResources = React.lazy(() =>
  import('./Demo/LearningResources/index')
);
const ContactUs = React.lazy(() => import('./Demo/Contact/index'));
const StudentApplications = React.lazy(() =>
  import('./Demo/StudentApplications/StudentApplicationsIndividual')
);
const SingleProgram = React.lazy(() => import('./Demo/Program/SingleProgram'));
const UsersTable = React.lazy(() => import('./Demo/Users/UsersTable'));
const Survey = React.lazy(() => import('./Demo/Survey/index'));
const Settings = React.lazy(() => import('./Demo/Settings/index'));
const Profile = React.lazy(() => import('./Demo/Profile/index'));
const Admissions = React.lazy(() => import('./Demo/Admissions/Admissions'));
const StudentDatabase = React.lazy(() =>
  import('./Demo/StudentDatabase/index')
);
const CVMLRL_Modification_Thread = React.lazy(() =>
  import(
    './Demo/CVMLRLCenter/DocModificationThreadPage/DocModificationThreadPage'
  )
);
const SingleStudentPage = React.lazy(() =>
  import('./Demo/StudentDatabase/SingleStudentPage')
);
// const GoogleMap = React.lazy(() => import('./Demo/Maps/GoogleMap/index'));

const DocsApplication = React.lazy(() => import('./Demo/Documentation/index'));
const InternaldocsPage = React.lazy(() =>
  import('./Demo/Documentation/internal_index')
);
const DocsPage = React.lazy(() => import('./Demo/Documentation/SingleDoc'));
const DocsInternalPage = React.lazy(() =>
  import('./Demo/Documentation/SingleInternalDoc')
);
const DocCreatePage = React.lazy(() =>
  import('./Demo/Documentation/DocCreatePage')
);

const InternalDocCreatePage = React.lazy(() =>
  import('./Demo/Documentation/InternalDocCreatePage')
);

const InterviewTraining = React.lazy(() =>
  import('./Demo/InterviewTraining/index')
);

const SingleInterview = React.lazy(() =>
  import('./Demo/InterviewTraining/SingleInterview')
);

const Download = React.lazy(() => import('./Demo/DownloadCenter/DownloadPage'));

const AgentsAssignment = React.lazy(() =>
  import('./Demo/AssignmentAgentsEditors/AssignAgents/index')
);

const EditorsAssignment = React.lazy(() =>
  import('./Demo/AssignmentAgentsEditors/AssignEditors/index')
);

const routes = [
  {
    path: '/assignment/agents',
    exact: true,
    name: 'AssignAgents',
    component: AgentsAssignment
  },
  {
    path: '/assignment/editors',
    exact: true,
    name: 'AssignEditors',
    component: EditorsAssignment
  },
  {
    path: '/dashboard/default',
    exact: true,
    name: 'Dashboard',
    component: DashboardDefault
  },
  {
    path: '/admissions-overview',
    exact: true,
    name: 'Admissions',
    component: Admissions
  },
  {
    path: '/archiv/students',
    exact: true,
    name: 'Archiv Students',
    component: ArchivStudent
  },
  {
    path: '/archiv/students/all',
    exact: true,
    name: 'Archiv Students',
    component: AllArchivStudent
  },
  {
    path: '/programs/:programId',
    exact: true,
    name: 'SingleProgram',
    component: SingleProgram
  },
  {
    path: '/document-modification/:documentsthreadId',
    exact: true,
    name: 'CVMLRL Modification Thread',
    component: CVMLRL_Modification_Thread
  },
  {
    path: '/programs',
    exact: true,
    name: 'Program Table',
    component: ProgramList
  },
  {
    path: '/resources',
    exact: true,
    name: 'Learning Resources',
    component: LearningResources
  },
  {
    path: '/contact',
    exact: true,
    name: 'Contact',
    component: ContactUs
  },
  {
    path: '/student-applications',
    exact: true,
    name: 'Applications Overview',
    component: ApplicationsOverview
  },
  {
    path: '/student-applications/:student_id',
    exact: true,
    name: 'Student Applications',
    component: StudentApplications
  },
  {
    path: '/users',
    exact: true,
    name: 'Users Table',
    component: UsersTable
  },
  {
    path: '/student-database',
    exact: true,
    name: 'StudentDatabase',
    component: StudentDatabase
  },
  {
    path: '/student-database/:studentId/:tab',
    exact: true,
    name: 'SingleStudentPage',
    component: SingleStudentPage
  },
  // {
  //   path: '/maps/google-map',
  //   exact: true,
  //   name: 'Google Map',
  //   component: GoogleMap
  // },
  {
    path: '/docs/taiger/internal',
    exact: true,
    name: 'Documentation',
    component: InternaldocsPage
  },
  {
    path: '/docs/:category',
    exact: true,
    name: 'Documentation',
    component: DocsApplication
  },
  {
    path: '/docs/internal/search/:documentation_id',
    exact: true,
    name: 'DocumentationPage',
    component: DocsInternalPage
  },
  {
    path: '/docs/search/:documentation_id',
    exact: true,
    name: 'DocumentationPage',
    component: DocsPage
  },
  {
    path: '/internal/database/public-docs',
    exact: true,
    name: 'DocCreatePage',
    component: DocCreatePage
  },
  {
    path: '/internal/database/internal-docs',
    exact: true,
    name: 'InternalDocCreatePage',
    component: InternalDocCreatePage
  },
  // {
  //   path: '/interview-training',
  //   exact: true,
  //   name: 'InterviewTraining',
  //   component: InterviewTraining
  // },
  // {
  //   path: '/interview-training/:interview_id',
  //   exact: true,
  //   name: 'SingleInterview',
  //   component: SingleInterview
  // },
  {
    path: '/download',
    exact: true,
    name: 'Download',
    component: Download
  },
  {
    path: '/my-courses/analysis/:student_id',
    exact: true,
    name: 'My MyCourses Analysis',
    component: MyCoursesAnalysis
  },
  {
    path: '/my-courses/:student_id',
    exact: true,
    name: 'My Courses',
    component: MyCourses
  },
  {
    path: '/my-courses',
    exact: true,
    name: 'My Courses',
    component: MyCourses
  },
  {
    path: '/base-documents',
    exact: true,
    name: 'Base Documents',
    component: BaseDocuments
  },
  {
    path: '/uni-assist',
    exact: true,
    name: 'Uni Assist Tasks',
    component: UniAssist
  },
  {
    path: '/portal-informations',
    exact: true,
    name: 'Portal Information',
    component: PortalCredentialPage
  },
  {
    path: '/portal-informations/:student_id',
    exact: true,
    name: 'Portal Information',
    component: PortalCredentialPage
  },
  {
    path: '/dashboard/cv-ml-rl',
    exact: true,
    name: 'CV/ML/RL Dashboard',
    component: CVMLRLDashboard
  },
  {
    path: '/internal/widgets/course-analyser',
    exact: true,
    name: 'Course Analyser',
    component: CoursesAnalysisWidget
  },
  {
    path: '/internal/widgets/:admin_id',
    exact: true,
    name: 'My MyCourses Analysis',
    component: MyCoursesAnalysis
  },
  {
    path: '/cv-ml-rl-center',
    exact: true,
    name: 'CV/ML/RL Center',
    component: CVMLRLOverview
  },
  {
    path: '/communications/:student_id',
    exact: true,
    name: 'My Chat',
    component: CommunicationSinglePage
  },
  {
    path: '/settings',
    exact: true,
    name: 'Settings',
    component: Settings
  },
  {
    path: '/profile',
    exact: true,
    name: 'Profile',
    component: Profile
  },
  {
    path: '/profile/:user_id',
    exact: true,
    name: 'Profile',
    component: Profile
  },
  {
    path: '/survey',
    exact: true,
    name: '',
    component: Survey
  },
  {
    path: '/teams/permissions',
    exact: true,
    name: '',
    component: TaiGerPermissions
  },
  {
    path: '/teams/members',
    exact: true,
    name: '',
    component: TaiGerOrg
  },
  {
    path: '/dashboard/internal',
    exact: true,
    name: '',
    component: InternalDashboard
  },
  {
    path: '/all-students-applications',
    exact: true,
    name: '',
    component: AllApplicantsOverview
  },
  {
    path: '/students-overview',
    exact: true,
    name: '',
    component: MyStudentOverviewPage
  },
  {
    path: '/students-overview/all',
    exact: true,
    name: '',
    component: StudentOverviewPage
  },
  {
    path: '/internal/program-conflict',
    exact: true,
    name: '',
    component: ProgramConflict
  },
  {
    path: '/internal/accounting',
    exact: true,
    name: '',
    component: Accounting
  },
  {
    path: '/internal/logs',
    exact: true,
    name: '',
    component: TaiGerUsersLog
  },
  {
    path: '/internal/logs/:user_id',
    exact: true,
    name: '',
    component: TaiGerUserLog
  },
  {
    path: '/internal/accounting/users/:taiger_user_id',
    exact: true,
    name: '',
    component: SingleBalanceSheetOverview
  },
  {
    path: '/events/all',
    exact: true,
    name: '',
    component: AllOfficeHours
  },
  {
    path: '/events/taiger/:user_id',
    exact: true,
    name: '',
    component: TaiGerOfficeHours
  },
  {
    path: '/events/students/:user_id',
    exact: true,
    name: '',
    component: OfficeHours
  },
  {
    path: '/teams/agents/profile/:user_id',
    exact: true,
    name: '',
    component: TaiGerMemberProfile
  },
  {
    path: '/teams/agents/:user_id',
    exact: true,
    name: '',
    component: TaiGerOrgAgent
  },
  {
    path: '/teams/agents/archiv/:user_id',
    exact: true,
    name: 'Archiv Students',
    component: ArchivStudent
  },
  {
    path: '/teams/editors/:user_id',
    exact: true,
    name: '',
    component: TaiGerOrgEditor
  },
  {
    path: '/teams/editors/archiv/:user_id',
    exact: true,
    name: 'Archiv Students',
    component: ArchivStudent
  },
  {
    path: '/teams/admins/:user_id',
    exact: true,
    name: '',
    component: TaiGerOrgAdmin
  }
  // {
  //   path: "/",
  //   component: DashboardDefault,
  // },
];

export default routes;
