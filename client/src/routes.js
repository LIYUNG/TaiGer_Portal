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
const AgentCenter = React.lazy(() => import("./Demo/AgentCenter/AgentCenter"));
const EditorCenter = React.lazy(() =>
  import("./Demo/EditorCenter/EditorCenter")
);
const ProgramTable = React.lazy(() => import("./Demo/Program/ProgramTable"));
const SingleProgram = React.lazy(() => import("./Demo/Program/SingleProgram"));
const UsersTable = React.lazy(() => import("./Demo/Users/UsersTable"));
const Profile = React.lazy(() => import("./Demo/Profile/index"));
const Survey = React.lazy(() => import("./Demo/Survey/index"));
const Settings = React.lazy(() => import("./Demo/Settings/index"));
const Nvd3Chart = React.lazy(() => import("./Demo/Charts/Nvd3Chart/index"));
const Statistics = React.lazy(() =>
  import("./Demo/Statistics/Nvd3Chart/index")
);
const StudentDatabase = React.lazy(() =>
  import("./Demo/StudentDatabase/index")
);
const ArchivStudentDatabase = React.lazy(() =>
  import("./Demo/StudentDatabase/ArchivStudent")
);
const GoogleMap = React.lazy(() => import("./Demo/Maps/GoogleMap/index"));
const DocsApplication = React.lazy(() =>
  import("./Demo/Documentation/Application/Application")
);
const DocsCertification = React.lazy(() =>
  import("./Demo/Documentation/Certification/Certification")
);
const DocsUniassist = React.lazy(() =>
  import("./Demo/Documentation/Uniassist/Uniassist")
);
const DocsVisa = React.lazy(() => import("./Demo/Documentation/Visa/Visa"));
const Download = React.lazy(() => import("./Demo/DownloadCenter/DownloadPage"));
const TaiGerAI = React.lazy(() =>
  import("./Demo/TaiGerAI/Application/CoursesAnalyser")
);

const routes = [
  {
    path: "/dashboard/default",
    exact: true,
    name: "Dashboard",
    component: DashboardDefault,
  },
  {
    path: "/archiv/students",
    exact: true,
    name: "Archiv Students",
    component: ArchivStudent,
  },
  {
    path: "/basic/button",
    exact: true,
    name: "Basic Button",
    component: UIBasicButton,
  },
  {
    path: "/basic/badges",
    exact: true,
    name: "Basic Badges",
    component: UIBasicBadges,
  },
  {
    path: "/basic/breadcrumb-paging",
    exact: true,
    name: "Basic Breadcrumb Pagination",
    component: UIBasicBreadcrumbPagination,
  },
  {
    path: "/basic/collapse",
    exact: true,
    name: "Basic Collapse",
    component: UIBasicCollapse,
  },
  {
    path: "/basic/tabs-pills",
    exact: true,
    name: "Basic Tabs & Pills",
    component: UIBasicTabsPills,
  },
  {
    path: "/basic/typography",
    exact: true,
    name: "Basic Typography",
    component: UIBasicBasicTypography,
  },
  {
    path: "/forms/form-basic",
    exact: true,
    name: "Forms Elements",
    component: FormsElements,
  },
  {
    path: "/programs/:programId",
    exact: true,
    name: "SingleProgram",
    component: SingleProgram,
  },
  {
    path: "/programs",
    exact: true,
    name: "Program Table",
    component: ProgramTable,
  },
  {
    path: "/users",
    exact: true,
    name: "Users Table",
    component: UsersTable,
  },
  {
    path: "/student-database",
    exact: true,
    name: "StudentDatabase",
    component: StudentDatabase,
  },
  {
    path: "/student-database/:studentId",
    exact: true,
    name: "ArchivStudentDatabase",
    component: ArchivStudentDatabase,
  },
  {
    path: "/statistics",
    exact: true,
    name: "Statistics",
    component: Statistics,
  },
  {
    path: "/charts/nvd3",
    exact: true,
    name: "Nvd3 Chart",
    component: Nvd3Chart,
  },
  {
    path: "/maps/google-map",
    exact: true,
    name: "Google Map",
    component: GoogleMap,
  },
  {
    path: "/docs/application",
    exact: true,
    name: "Documentation",
    component: DocsApplication,
  },
  {
    path: "/docs/certification",
    exact: true,
    name: "Documentation",
    component: DocsCertification,
  },
  {
    path: "/docs/uniassist",
    exact: true,
    name: "Documentation",
    component: DocsUniassist,
  },
  {
    path: "/docs/visa",
    exact: true,
    name: "Documentation",
    component: DocsVisa,
  },
  {
    path: "/download",
    exact: true,
    name: "Download",
    component: Download,
  },
  {
    path: "/taigerai",
    exact: true,
    name: "TaiGer AI",
    component: TaiGerAI,
  },
  {
    path: "/agent-center",
    exact: true,
    name: "Agent Center",
    component: AgentCenter,
  },
  {
    path: "/editor-center",
    exact: true,
    name: "Editor Center",
    component: EditorCenter,
  },
  {
    path: "/settings",
    exact: true,
    name: "Settings",
    component: Settings,
  },
  {
    path: "/survey",
    exact: true,
    name: "",
    component: Survey,
  },
  {
    path: "/profile",
    exact: true,
    name: "Profile",
    component: Profile,
  },
  // {
  //   path: "/",
  //   component: DashboardDefault,
  // },
];

export default routes;
