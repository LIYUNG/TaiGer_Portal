import React from 'react';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const DashboardDefault = React.lazy(() => import('./Demo/Dashboard/Dashboard'));

const ArchivStudent = React.lazy(() => import('./Demo/ArchivStudent/index'));
const UIBasicBreadcrumbPagination = React.lazy(() =>
  import('./Demo/UIElements/Basic/BreadcrumbPagination')
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
const InternalDashboard = React.lazy(() =>
  import('./Demo/TaiGerOrg/InternalDashboard/index')
);
const Accounting = React.lazy(() => import('./Demo/Accounting/index'));
const ProgramConflict = React.lazy(() =>
  import('./Demo/TaiGerOrg/ProgramConflict/index')
);
const TaiGerOrg = React.lazy(() => import('./Demo/TaiGerOrg/index'));
const TaiGerOrgAgent = React.lazy(() => import('./Demo/TaiGerOrg/AgentPage'));
const TaiGerOrgEditor = React.lazy(() => import('./Demo/TaiGerOrg/EditorPage'));
const TaiGerOrgAdmin = React.lazy(() => import('./Demo/TaiGerOrg/AdminPage'));
const ProgramList = React.lazy(() => import('./Demo/Program/ProgramList'));
const ApplicationsOverview = React.lazy(() =>
  import('./Demo/ApplicantsOverview/index')
);
const StudentApplications = React.lazy(() =>
  import('./Demo/StudentApplications/StudentApplicationsIndividual')
);
const SingleProgram = React.lazy(() => import('./Demo/Program/SingleProgram'));
const UsersTable = React.lazy(() => import('./Demo/Users/UsersTable'));
const Survey = React.lazy(() => import('./Demo/Survey/index'));
const Settings = React.lazy(() => import('./Demo/Settings/index'));
// const Nvd3Chart = React.lazy(() => import('./Demo/Charts/Nvd3Chart/index'));
// const Statistics = React.lazy(() =>
//   import('./Demo/Statistics/Nvd3Chart/index')
// );
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
const GoogleMap = React.lazy(() => import('./Demo/Maps/GoogleMap/index'));

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
    path: '/basic/breadcrumb-paging',
    exact: true,
    name: 'Basic Breadcrumb Pagination',
    component: UIBasicBreadcrumbPagination
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
  //   path: '/statistics',
  //   exact: true,
  //   name: 'Statistics',
  //   component: Statistics
  // },
  // {
  //   path: '/charts/nvd3',
  //   exact: true,
  //   name: 'Nvd3 Chart',
  //   component: Nvd3Chart
  // },
  {
    path: '/maps/google-map',
    exact: true,
    name: 'Google Map',
    component: GoogleMap
  },
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
    path: '/settings',
    exact: true,
    name: 'Settings',
    component: Settings
  },
  {
    path: '/survey',
    exact: true,
    name: '',
    component: Survey
  },
  {
    path: '/teams',
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
