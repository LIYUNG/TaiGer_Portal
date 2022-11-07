import React from "react";
import $ from "jquery";

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const DashboardDefault = React.lazy(() => import("./Demo/Dashboard/Dashboard"));
const ArchivStudent = React.lazy(() => import("./Demo/ArchivStudent/index"));
const UIBasicButton = React.lazy(() =>
  import("./Demo/UIElements/Basic/Button")
);
const UIBasicBadges = React.lazy(() =>
  import("./Demo/UIElements/Basic/Badges")
);
const UIBasicBreadcrumbPagination = React.lazy(() =>
  import("./Demo/UIElements/Basic/BreadcrumbPagination")
);
const UIBasicCollapse = React.lazy(() =>
  import("./Demo/UIElements/Basic/Collapse")
);
const UIBasicTabsPills = React.lazy(() =>
  import("./Demo/UIElements/Basic/TabsPills")
);
const UIBasicBasicTypography = React.lazy(() =>
  import("./Demo/UIElements/Basic/Typography")
);
const FormsElements = React.lazy(() => import("./Demo/Forms/FormsElements"));

const UniAssist = React.lazy(() =>
  import('./Demo/UniAssist/index')
);
const BaseDocuments = React.lazy(() =>
  import('./Demo/AgentCenter/BaseDocuments')
);
const Checklist = React.lazy(() =>
  import('./Demo/CheckList/index')
);

const MyCourses = React.lazy(() => import('./Demo/MyCourses/index'));
const CVMLRLCenter = React.lazy(() =>
  import("./Demo/CVMLRLCenter/CVMLRLCenter")
);
const CVMLRLOverview = React.lazy(() =>
  import('./Demo/CVMLRLCenter/CVMLRLOverview')
);
const ProgramTable = React.lazy(() => import('./Demo/Program/ProgramTable'));
const ApplicationsOverview = React.lazy(() =>
  import('./Demo/ApplicantsOverview/index')
);
const StudentApplications = React.lazy(() =>
  import('./Demo/StudentApplications/StudentApplicationsIndividual')
);
const SingleProgram = React.lazy(() => import("./Demo/Program/SingleProgram"));
const UsersTable = React.lazy(() => import("./Demo/Users/UsersTable"));
const Survey = React.lazy(() => import("./Demo/Survey/index"));
const InterviewTraining = React.lazy(() =>
  import('./Demo/InterviewTraining/index')
);
const SingleInterviewTraining = React.lazy(() =>
  import('./Demo/InterviewTraining/SingleInterviewTraining')
);
const Settings = React.lazy(() => import("./Demo/Settings/index"));
const Nvd3Chart = React.lazy(() => import("./Demo/Charts/Nvd3Chart/index"));
const Statistics = React.lazy(() =>
  import("./Demo/Statistics/Nvd3Chart/index")
);
const Admissions = React.lazy(() => import('./Demo/Admissions/Admissions'));
const StudentDatabase = React.lazy(() =>
  import("./Demo/StudentDatabase/index")
);
const CVMLRL_Modification_Thread = React.lazy(() =>
  import(
    "./Demo/CVMLRLCenter/DocModificationThreadPage/DocModificationThreadPage"
  )
);
const TasksOverview = React.lazy(() => import('./Demo/Task/TasksOverview'));
const Task = React.lazy(() => import('./Demo/Task/Task'));
const MyTask = React.lazy(() => import("./Demo/Task/MyTask"));

const SingleStudentPage = React.lazy(() =>
  import('./Demo/StudentDatabase/SingleStudentPage')
);
const GoogleMap = React.lazy(() => import("./Demo/Maps/GoogleMap/index"));

const DocsApplication = React.lazy(() =>
  import('./Demo/Documentation/index')
);

const DocsPage = React.lazy(() => import('./Demo/Documentation/SingleDoc'));

const Download = React.lazy(() => import("./Demo/DownloadCenter/DownloadPage"));
const TaiGerAI = React.lazy(() =>
  import("./Demo/TaiGerAI/Application/CoursesAnalyser")
);

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
    path: '/basic/button',
    exact: true,
    name: 'Basic Button',
    component: UIBasicButton
  },
  {
    path: '/basic/badges',
    exact: true,
    name: 'Basic Badges',
    component: UIBasicBadges
  },
  {
    path: '/basic/breadcrumb-paging',
    exact: true,
    name: 'Basic Breadcrumb Pagination',
    component: UIBasicBreadcrumbPagination
  },
  {
    path: '/basic/collapse',
    exact: true,
    name: 'Basic Collapse',
    component: UIBasicCollapse
  },
  {
    path: '/basic/tabs-pills',
    exact: true,
    name: 'Basic Tabs & Pills',
    component: UIBasicTabsPills
  },
  {
    path: '/basic/typography',
    exact: true,
    name: 'Basic Typography',
    component: UIBasicBasicTypography
  },
  {
    path: '/forms/form-basic',
    exact: true,
    name: 'Forms Elements',
    component: FormsElements
  },
  {
    path: '/programs/:programId',
    exact: true,
    name: 'SingleProgram',
    component: SingleProgram
  },
  {
    path: '/tasks/:student_id',
    exact: true,
    name: 'Task Overview',
    component: Task
  },
  {
    path: '/tasks/students/overview',
    exact: true,
    name: 'Task Overview',
    component: TasksOverview
  },
  {
    path: '/tasks',
    exact: true,
    name: 'My Task',
    component: MyTask
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
    component: ProgramTable
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
  {
    path: '/statistics',
    exact: true,
    name: 'Statistics',
    component: Statistics
  },
  {
    path: '/charts/nvd3',
    exact: true,
    name: 'Nvd3 Chart',
    component: Nvd3Chart
  },
  {
    path: '/maps/google-map',
    exact: true,
    name: 'Google Map',
    component: GoogleMap
  },
  {
    path: '/docs/:category',
    exact: true,
    name: 'Documentation',
    component: DocsApplication
  },
  {
    path: '/docs/search/:documentation_id',
    exact: true,
    name: 'DocumentationPage',
    component: DocsPage
  },
  {
    path: '/download',
    exact: true,
    name: 'Download',
    component: Download
  },
  {
    path: '/taigerai',
    exact: true,
    name: 'TaiGer AI',
    component: TaiGerAI
  },
  {
    path: '/checklist',
    exact: true,
    name: 'Check List',
    component: Checklist
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
    path: '/cv-ml-rl-center',
    exact: true,
    name: 'CV/ML/RL Center',
    component: CVMLRLOverview
  },
  {
    path: '/interview-training',
    exact: true,
    name: 'InterviewTraining',
    component: InterviewTraining
  },
  {
    path: '/interview-training/:interview_id',
    exact: true,
    name: 'SingleInterviewTraining',
    component: SingleInterviewTraining
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
  }
  // {
  //   path: "/",
  //   component: DashboardDefault,
  // },
];

export default routes;
