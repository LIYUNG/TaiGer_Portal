import React from 'react';
import { appConfig } from './config';
import {
  getAllActiveStudentsLoader,
  getApplicationStudentLoader,
  getMyAcademicBackgroundLoader,
  getStudentAndDocLinksLoader,
  getStudentsLoader,
  // getEssaysLoader,
  combinedLoader,
  getAllActiveEssaysLoader,
  getAllStudentsLoader,
  getAllArchivedStudentsLoader,
  getAllComplaintTicketsLoader,
  getComplaintTicketLoader,
  getDistinctSchoolsLoader,
  getCourseKeywordSetsLoader,
  getProgramRequirementsLoader,
  getProgramsAndCourseKeywordSetsLoader,
  getProgramRequirementLoader
} from './api/dataLoader';
import DefaultErrorPage from './Demo/Utils/DefaultErrorPage';
import StudentApplicationsAssignPage from './Demo/StudentApplications/assignPage';
import CourseKeywordsOverviewNew from './Demo/CourseAnalysis/CourseKeywordsEdit/CourseKeywordsNew';
import ProgramRequirementsNewIndex from './Demo/CourseAnalysis/ProgramRequirements/ProgramRequirementsNewIndex';
import ProgramRequirementsEditIndex from './Demo/CourseAnalysis/ProgramRequirements/ProgramRequirementsEditIndex';

const CreateComplaintTicket = React.lazy(() =>
  import('./Demo/CustomerSupport/CreateTicket')
);
const Questionnaire = React.lazy(() =>
  import('./Demo/InterviewTraining/Questionnaire')
);
const AddInterview = React.lazy(() =>
  import('./Demo/InterviewTraining/AddInterview')
);
const InterviewResponseTable = React.lazy(() =>
  import('./Demo/InterviewTraining/InterviewResponseTable')
);

const DashboardDefault = React.lazy(() => import('./Demo/Dashboard'));

const CourseKeywordsEdit = React.lazy(() =>
  import('./Demo/CourseAnalysis/CourseKeywordsEdit')
);

const ProgramRequirements = React.lazy(() =>
  import('./Demo/CourseAnalysis/ProgramRequirements')
);

const AllArchivStudent = React.lazy(() =>
  import('./Demo/ArchivStudent/AllIndex')
);
const ArchivStudent = React.lazy(() => import('./Demo/ArchivStudent/index'));

const CommunicationSinglePage = React.lazy(() =>
  import('./Demo/Communications/CommunicationSinglePage')
);

const CommunicationExpandPage = React.lazy(() =>
  import('./Demo/Communications/CommunicationExpandPage')
);

const UniAssist = React.lazy(() => import('./Demo/UniAssist/index'));
const PortalCredentialPage = React.lazy(() =>
  import('./Demo/PortalCredentialPage/index')
);
const BaseDocuments = React.lazy(() =>
  import('./Demo/BaseDocuments/BaseDocuments')
);

const AllBaseDocuments = React.lazy(() =>
  import('./Demo/BaseDocuments/AllBaseDocuments')
);

const MyCourses = React.lazy(() => import('./Demo/MyCourses/index'));
const MyCoursesAnalysis = React.lazy(() =>
  import('./Demo/MyCourses/CourseAnalysis')
);
const CoursesAnalysisWidget = React.lazy(() =>
  import('./Demo/MyCourses/CourseWidget')
);
const CVMLRLGenerator = React.lazy(() =>
  import('./Demo/TaiGerAI/CVMLRLGenerator')
);
const AgentSupportDocuments = React.lazy(() =>
  import('./Demo/AgentSupportDocuments/index')
);
const CVMLRLOverview = React.lazy(() => import('./Demo/CVMLRLCenter/index'));
const CVMLRLDashboard = React.lazy(() =>
  import('./Demo/CVMLRLCenter/indexAll')
);
const EssayDashboard = React.lazy(() => import('./Demo/EssayDashboard/index'));
const AllApplicantsOverview = React.lazy(() =>
  import('./Demo/ApplicantsOverview/allStudentIndex')
);
const CustomerSupport = React.lazy(() => import('./Demo/CustomerSupport'));

const CustomerTicketDetailPage = React.lazy(() =>
  import('./Demo/CustomerSupport/CustomerTicketDetailPage')
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
const ProgramTaskDelta = React.lazy(() =>
  import('./Demo/TaiGerOrg/ProgramTaskDelta/index')
);
const TaiGerPermissions = React.lazy(() => import('./Demo/TaiGerOrg/index'));
const TaiGerUsersLog = React.lazy(() => import('./Demo/TaiGerOrg/Log/index'));
const TaiGerUserLog = React.lazy(() =>
  import('./Demo/TaiGerOrg/Log/PortalSingleUserLog')
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
  import('./Demo/StudentApplications/index')
);
const SingleProgram = React.lazy(() => import('./Demo/Program/SingleProgram'));
const ProgramChangeRequestPage = React.lazy(() =>
  import('./Demo/Program/ProgramChangeRequestPage')
);
const SchoolConfig = React.lazy(() => import('./Demo/Program/SchoolConfig'));
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
const CVMLRL_Modification_ThreadInput = React.lazy(() =>
  import(
    './Demo/CVMLRLCenter/DocModificationThreadPage/DocModificationThreadInput'
  )
);
const SingleStudentPage = React.lazy(() =>
  import('./Demo/StudentDatabase/SingleStudentPage')
);

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

const EssayWritersAssignment = React.lazy(() =>
  import('./Demo/AssignmentAgentsEditors/AssignEssayWriters/index')
);
// TODO: conditional configuration.
const routes = [
  {
    path: '/assignment',
    children: [
      {
        path: 'agents',
        errorElement: <DefaultErrorPage />,
        loader: getStudentsLoader,
        element: <AgentsAssignment />
      },
      {
        path: 'editors',
        errorElement: <DefaultErrorPage />,
        loader: getStudentsLoader,
        element: <EditorsAssignment />
      },
      {
        path: 'essay-writers',
        errorElement: <DefaultErrorPage />,
        loader: getAllActiveEssaysLoader,
        element: <EssayWritersAssignment />
      }
    ]
  },
  {
    path: '/dashboard/default',
    errorElement: <DefaultErrorPage />,
    loader: combinedLoader,
    // loader: getStudentsLoader,
    element: <DashboardDefault />
  },
  {
    path: '/courses/analysis/keywords',
    errorElement: <DefaultErrorPage />,
    loader: getCourseKeywordSetsLoader,
    element: <CourseKeywordsEdit />
  },
  {
    path: '/courses/analysis/keywords/new',
    errorElement: <DefaultErrorPage />,
    element: <CourseKeywordsOverviewNew />
  },
  {
    path: '/courses/analysis/programs',
    errorElement: <DefaultErrorPage />,
    loader: getProgramRequirementsLoader,
    // loader: getStudentsLoader,
    element: <ProgramRequirements />
  },
  {
    path: '/courses/analysis/programs/requirements/new', //TODO: create the page
    errorElement: <DefaultErrorPage />,
    loader: getProgramsAndCourseKeywordSetsLoader,
    element: <ProgramRequirementsNewIndex />
  },
  {
    path: '/courses/analysis/programs/requirements/:requirementId', //TODO: create the page
    errorElement: <DefaultErrorPage />,
    loader: getProgramRequirementLoader,
    element: <ProgramRequirementsEditIndex />
  },
  {
    path: '/admissions-overview',
    exact: true,
    name: 'Admissions',
    Component: Admissions
  },
  {
    path: '/archiv/students',
    exact: true,
    name: 'Archiv Students',
    Component: ArchivStudent
  },
  {
    path: '/archiv/students/all',
    errorElement: <DefaultErrorPage />,
    loader: getAllArchivedStudentsLoader,
    element: <AllArchivStudent />
  },
  {
    path: '/programs/:programId/change-requests',
    exact: true,
    name: 'SingleProgram',
    Component: ProgramChangeRequestPage
  },
  {
    path: '/programs/config',
    exact: true,
    name: 'SchoolConfig',
    loader: getDistinctSchoolsLoader,
    Component: SchoolConfig
  },
  {
    path: '/programs/:programId',
    exact: true,
    name: 'SingleProgram',
    Component: SingleProgram
  },
  {
    path: '/document-modification/:documentsthreadId',
    exact: true,
    name: 'CVMLRL Modification Thread',
    Component: CVMLRL_Modification_Thread
  },
  {
    path: '/programs',
    exact: true,
    name: 'Program Table',
    Component: ProgramList
  },
  {
    path: '/resources',
    exact: true,
    name: 'Learning Resources',
    Component: LearningResources
  },
  {
    path: '/contact',
    errorElement: <DefaultErrorPage />,
    loader: getStudentsLoader,
    element: <ContactUs />
  },
  {
    path: '/student-applications',
    errorElement: <DefaultErrorPage />,
    loader: getStudentsLoader,
    element: <ApplicationsOverview />
  },
  {
    path: '/student-applications/:student_id',
    errorElement: <DefaultErrorPage />,
    loader: getApplicationStudentLoader,
    element: <StudentApplications />
  },
  {
    path: '/student-applications/edit/:student_id',
    errorElement: <DefaultErrorPage />,
    loader: getApplicationStudentLoader,
    element: <StudentApplicationsAssignPage />
  },
  {
    path: '/users',
    exact: true,
    name: 'Users Table',
    Component: UsersTable
  },
  {
    path: '/student-database',
    errorElement: <DefaultErrorPage />,
    loader: getAllStudentsLoader,
    element: <StudentDatabase />
  },
  {
    path: '/student-database/:studentId',
    errorElement: <DefaultErrorPage />,
    loader: getStudentAndDocLinksLoader,
    element: <SingleStudentPage />
  },
  // {
  //   path: '/maps/google-map',
  //   exact: true,
  //   name: 'Google Map',
  //   Component: GoogleMap
  // },
  {
    path: '/docs/taiger/internal',
    exact: true,
    name: 'Documentation',
    Component: InternaldocsPage
  },
  {
    path: '/docs/:category',
    exact: true,
    name: 'Documentation',
    Component: DocsApplication
  },
  {
    path: '/docs/internal/search/:documentation_id',
    exact: true,
    name: 'DocumentationPage',
    Component: DocsInternalPage
  },
  {
    path: '/docs/search/:documentation_id',
    exact: true,
    name: 'DocumentationPage',
    Component: DocsPage
  },
  {
    path: '/internal/database/public-docs',
    exact: true,
    name: 'DocCreatePage',
    Component: DocCreatePage
  },
  {
    path: '/internal/database/internal-docs',
    exact: true,
    name: 'InternalDocCreatePage',
    Component: InternalDocCreatePage
  },
  {
    path: '/download',
    exact: true,
    name: 'Download',
    Component: Download
  },
  {
    path: '/my-courses/analysis/:student_id',
    exact: true,
    name: 'My Courses Analysis',
    Component: MyCoursesAnalysis
  },
  {
    path: '/my-courses/:student_id',
    exact: true,
    name: 'My Courses 2',
    Component: MyCourses
  },
  {
    path: '/my-courses',
    exact: true,
    name: 'My Courses 1',
    Component: MyCourses
  },
  {
    path: '/base-documents',
    exact: true,
    name: 'Documents',
    Component: BaseDocuments
  },
  {
    path: '/agent-support-documents',
    exact: true,
    name: 'AgentSupportDocuments',
    Component: AgentSupportDocuments
  },
  {
    path: '/all-base-documents',
    errorElement: <DefaultErrorPage />,
    loader: getAllActiveStudentsLoader,
    element: <AllBaseDocuments />
  },
  {
    path: '/portal-informations',
    exact: true,
    name: 'Portal Information',
    Component: PortalCredentialPage
  },
  {
    path: '/portal-informations/:student_id',
    exact: true,
    name: 'Portal Information',
    Component: PortalCredentialPage
  },
  {
    path: '/dashboard/cv-ml-rl',
    exact: true,
    name: 'CV/ML/RL Dashboard',
    Component: CVMLRLDashboard
  },
  {
    path: '/dashboard/essay',
    exact: true,
    name: 'CV/ML/RL Dashboard',
    Component: EssayDashboard
  },
  {
    path: '/internal/widgets/course-analyser',
    exact: true,
    name: 'Course Analyser',
    loader: getProgramRequirementsLoader,
    Component: CoursesAnalysisWidget
  },
  {
    path: '/internal/widgets/:admin_id',
    exact: true,
    name: 'My MyCourses Analysis',
    Component: MyCoursesAnalysis
  },
  {
    path: '/cv-ml-rl-center',
    exact: true,
    name: 'CV/ML/RL Center',
    Component: CVMLRLOverview
  },
  {
    path: '/settings',
    exact: true,
    name: 'Settings',
    Component: Settings
  },
  {
    path: '/profile',
    exact: true,
    name: 'Profile',
    Component: Profile
  },
  {
    path: '/profile/:user_id',
    exact: true,
    name: 'Profile',
    Component: Profile
  },
  {
    path: '/survey',
    errorElement: <DefaultErrorPage />,
    loader: getMyAcademicBackgroundLoader,
    element: <Survey />
  },
  {
    path: '/teams/permissions',
    exact: true,
    name: '',
    Component: TaiGerPermissions
  },
  {
    path: '/teams/members',
    exact: true,
    name: '',
    Component: TaiGerOrg
  },
  {
    path: '/dashboard/internal',
    exact: true,
    name: '',
    Component: InternalDashboard
  },
  {
    path: '/all-students-applications',
    errorElement: <DefaultErrorPage />,
    loader: getAllActiveStudentsLoader,
    element: <AllApplicantsOverview />
  },
  {
    path: '/students-overview',
    errorElement: <DefaultErrorPage />,
    loader: getStudentsLoader,
    element: <MyStudentOverviewPage />
  },
  {
    path: '/customer-center',
    errorElement: <DefaultErrorPage />,
    loader: getAllComplaintTicketsLoader,
    element: <CustomerSupport />
  },
  {
    path: '/customer-center/add-ticket',
    errorElement: <DefaultErrorPage />,
    element: <CreateComplaintTicket />
  },
  {
    path: '/customer-center/tickets/:complaintTicketId',
    errorElement: <DefaultErrorPage />,
    loader: getComplaintTicketLoader,
    element: <CustomerTicketDetailPage />
  },
  {
    path: '/students-overview/all',
    errorElement: <DefaultErrorPage />,
    loader: getAllActiveStudentsLoader,
    element: <StudentOverviewPage />
  },
  {
    path: '/internal/program-conflict',
    exact: true,
    name: '',
    Component: ProgramConflict
  },
  {
    path: '/internal/program-task-delta',
    exact: true,
    name: '',
    Component: ProgramTaskDelta
  },
  {
    path: '/internal/accounting',
    exact: true,
    name: '',
    Component: Accounting
  },
  {
    path: '/internal/logs',
    exact: true,
    name: '',
    Component: TaiGerUsersLog
  },
  {
    path: '/internal/logs/:user_id',
    exact: true,
    name: '',
    Component: TaiGerUserLog
  },
  {
    path: '/internal/accounting/users/:taiger_user_id',
    exact: true,
    name: '',
    Component: SingleBalanceSheetOverview
  },
  {
    path: '/teams/agents/profile/:user_id',
    exact: true,
    name: '',
    Component: TaiGerMemberProfile
  },
  {
    path: '/teams/agents/:user_id',
    exact: true,
    name: '',
    Component: TaiGerOrgAgent
  },
  {
    path: '/teams/agents/archiv/:user_id',
    exact: true,
    name: 'Archiv Students',
    Component: ArchivStudent
  },
  {
    path: '/teams/editors/:user_id',
    exact: true,
    name: '',
    Component: TaiGerOrgEditor
  },
  {
    path: '/teams/editors/archiv/:user_id',
    exact: true,
    name: 'Archiv Students',
    Component: ArchivStudent
  },
  {
    path: '/teams/admins/:user_id',
    exact: true,
    name: '',
    Component: TaiGerOrgAdmin
  },
  {
    path: '/',
    errorElement: <DefaultErrorPage />,
    loader: combinedLoader,
    element: <DashboardDefault />
  }
];

if (appConfig.vpdEnable) {
  routes.push({
    path: '/uni-assist',
    exact: true,
    name: 'Uni Assist Tasks',
    Component: UniAssist
  });
}

if (appConfig.interviewEnable) {
  routes.push({
    path: '/interview-training',
    exact: true,
    name: 'InterviewTraining',
    Component: InterviewTraining
  });
  routes.push({
    path: '/interview-training/add',
    exact: true,
    name: 'AddInterview',
    Component: AddInterview
  });
  routes.push({
    path: '/interview-training/survey',
    exact: true,
    name: 'InterviewResponseTable',
    Component: InterviewResponseTable
  });
  routes.push({
    path: '/interview-training/:interview_id/survey',
    exact: true,
    name: 'InterviewSurvey',
    Component: Questionnaire
  });
  routes.push({
    path: '/interview-training/:interview_id',
    exact: true,
    name: 'SingleInterview',
    Component: SingleInterview
  });
}

if (appConfig.AIEnable) {
  routes.push({
    path: '/document-modification/:documentsthreadId/survey',
    exact: true,
    name: 'CVMLRL Modification Thread',
    Component: CVMLRL_Modification_ThreadInput
  });
  routes.push({
    path: '/cvmlrl/generator',
    exact: true,
    name: 'CVMLRL Generator',
    Component: CVMLRLGenerator
  });
}

if (appConfig.meetingEnable) {
  routes.push({
    path: '/events/all',
    exact: true,
    name: '',
    Component: AllOfficeHours
  });
  routes.push({
    path: '/events/taiger/:user_id',
    exact: true,
    name: '',
    Component: TaiGerOfficeHours
  });
  routes.push({
    path: '/events/students/:user_id',
    exact: true,
    name: '',
    Component: OfficeHours
  });
}

if (appConfig.messengerEnable) {
  routes.push({
    path: '/communications/std/:student_id',
    exact: true,
    name: 'My Chat',
    Component: CommunicationSinglePage
  });
  routes.push({
    path: '/communications/t/:student_id',
    exact: true,
    name: 'All Chat',
    Component: CommunicationExpandPage
  });
}

export default routes;
