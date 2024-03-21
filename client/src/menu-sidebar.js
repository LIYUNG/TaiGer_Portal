import React from 'react';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import LocalPostOfficeOutlinedIcon from '@mui/icons-material/LocalPostOfficeOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import AssignmentLateOutlinedIcon from '@mui/icons-material/AssignmentLateOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import StorageIcon from '@mui/icons-material/Storage';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArticleIcon from '@mui/icons-material/Article';
import BarChartIcon from '@mui/icons-material/BarChart';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import EuroIcon from '@mui/icons-material/Euro';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import DrawIcon from '@mui/icons-material/Draw';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import HistoryIcon from '@mui/icons-material/History';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import { appConfig } from './config';

let application_overview = [
  {
    id: 'applications_overview_stidemt',
    title: 'My Applications',
    type: 'item',
    icon: <DrawIcon />,
    url: '/student-applications',
    target: false
  },
  {
    id: 'my-documents',
    title: 'My Documents',
    type: 'item',
    url: '/base-documents',
    classes: 'nav-item',
    icon: <DrawIcon />,
    target: false,
    breadcrumbs: false
  },
  {
    id: 'cvmlrl-overview',
    title: 'CV ML RL Overview',
    type: 'item',
    url: '/cv-ml-rl-center',
    classes: 'nav-item',
    icon: <DrawIcon />,
    target: false,
    breadcrumbs: false
  },
  {
    id: 'application_portal_management',
    title: 'Portals Management',
    type: 'item',
    url: '/portal-informations',
    classes: 'nav-item',
    icon: <DrawIcon />,
    target: false,
    breadcrumbs: false
  }
];

if (appConfig.vpdEnable) {
  application_overview.push({
    id: 'uni_assist_tasks',
    title: 'Uni-Assist Tasks',
    type: 'item',
    url: '/uni-assist',
    icon: <DrawIcon />,
    target: false,
    breadcrumbs: false
  });
}

let all_students_nestedList = [
  {
    id: 'all-application-overview',
    title: 'All Application Overview',
    type: 'item',
    url: '/all-students-applications',
    icon: <AssignmentTurnedInOutlinedIcon />
  },
  {
    id: 'all-base-documents-overview',
    title: 'All Documents',
    type: 'item',
    url: '/all-base-documents',
    icon: <InsertDriveFileIcon />
  },
  {
    id: 'tasks_dashboard',
    title: 'Tasks Dashboard',
    type: 'item',
    url: '/dashboard/cv-ml-rl',
    icon: <BorderColorOutlinedIcon />
  },
  {
    id: 'essays_dashboard',
    title: 'Essay Dashboard',
    type: 'item',
    url: '/dashboard/essay',
    icon: <BorderColorOutlinedIcon />
  },
  {
    id: 'interview-training',
    title: 'Interview Training',
    type: 'item',
    icon: <HeadsetMicOutlinedIcon />,
    url: '/interview-training'
  },
  {
    id: 'all-students-overview',
    title: 'Student Overview',
    type: 'item',
    url: '/students-overview/all',
    icon: <GroupOutlinedIcon />
  },
  {
    id: 'internal_program_conflict',
    title: 'Program Conflict',
    type: 'item',
    icon: <AssignmentLateOutlinedIcon />,
    url: '/internal/program-conflict'
  },
  {
    id: 'admissions_overview',
    title: `${appConfig.companyName} Admissions`,
    type: 'item',
    icon: <EmojiEventsOutlinedIcon />,
    url: '/admissions-overview'
  }
];

if (appConfig.meetingEnable) {
  all_students_nestedList.push({
    id: 'all-calendar-events',
    title: 'Calendar Events',
    type: 'item',
    icon: <CalendarTodayOutlinedIcon />,
    url: '/events/all'
  });
}

all_students_nestedList = [
  ...all_students_nestedList,
  {
    id: 'archiv-student',
    title: 'Archiv Students',
    type: 'item',
    icon: <ArchiveOutlinedIcon />,
    url: '/archiv/students/all'
  },
  {
    id: 'prev_students_database',
    title: 'Student Database',
    type: 'item',
    url: '/student-database',
    classes: 'nav-item',
    icon: <StorageIcon />
  }
];

let documentations_nestedList = [
  {
    id: 'howtostart',
    title: 'How to Start',
    type: 'item',
    url: '/docs/howtostart',
    icon: <ArticleIcon />,
    target: false,
    breadcrumbs: false
  },
  {
    id: 'base-documents',
    title: 'Documents',
    type: 'item',
    url: '/docs/base-documents',
    icon: <InsertDriveFileIcon />,
    target: false,
    breadcrumbs: false
  },
  {
    id: 'cv-ml-rl',
    title: 'CV/ML/RL',
    type: 'item',
    url: '/docs/cv-ml-rl',
    icon: <BorderColorIcon />,
    target: false,
    breadcrumbs: false
  }
];

if (appConfig.vpdEnable) {
  documentations_nestedList.push({
    id: 'doc-uniassist',
    title: 'Uni-Assist',
    type: 'item',
    url: '/docs/uniassist',
    icon: <ArticleIcon />,
    target: false,
    breadcrumbs: false
  });
}

documentations_nestedList = [
  ...documentations_nestedList,
  {
    id: 'visa',
    title: 'Visa',
    type: 'item',
    url: '/docs/visa',
    icon: <ArticleIcon />,
    target: false,
    breadcrumbs: false
  },
  {
    id: 'internal-docs',
    title: 'Internal Docs',
    type: 'item',
    url: '/docs/taiger/internal',
    icon: <ArticleIcon />,
    target: false,
    breadcrumbs: false
  }
];

let taiger_teams_items = [
  {
    id: 'teams_member_permission',
    title: 'Permissions',
    type: 'item',
    icon: <VpnKeyIcon />,
    url: '/teams/permissions'
  },
  {
    id: 'teams_member',
    title: `${appConfig.companyName} Members`,
    type: 'item',
    icon: <SupervisorAccountIcon />,
    url: '/teams/members'
  }
];

if (appConfig.AIEnable) {
  taiger_teams_items.push({
    id: 'cvmlrl-generator',
    title: 'CVMLRL Generator',
    type: 'item',
    url: '/cvmlrl/generator',
    icon: <DrawIcon />,
    target: false,
    breadcrumbs: false
  });
}
taiger_teams_items = [
  ...taiger_teams_items,
  {
    id: 'user_logs',
    title: 'User Logs',
    type: 'item',
    icon: <HistoryIcon />,
    url: '/internal/logs'
  },
  {
    id: 'internal_dashboard',
    title: `${appConfig.companyName} Dashboard`,
    type: 'item',
    icon: <BarChartIcon />,
    url: '/dashboard/internal'
  },
  {
    id: 'internal_accounting',
    title: `${appConfig.companyName} Accounting`,
    type: 'item',
    icon: <EuroIcon />,
    url: '/internal/accounting'
  }
];

export const MenuSidebar = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    url: '/dashboard/default',
    icon: <HomeOutlinedIcon />
  },
  {
    id: 'my-students',
    title: 'My Students',
    type: 'collapse',
    icon: <PersonOutlineOutlinedIcon />,
    children: [
      {
        id: 'my-students-application-overview',
        title: 'Application Overview',
        type: 'item',
        url: '/student-applications',
        icon: <PersonOutlineOutlinedIcon />,
        target: false,
        breadcrumbs: false
      },
      {
        id: 'base-documents',
        title: 'Documents',
        type: 'item',
        url: '/base-documents',
        classes: 'nav-item',
        icon: <InsertDriveFileIcon />
      },
      {
        id: 'my-students-overview',
        title: 'Student Overview',
        type: 'item',
        url: '/students-overview',
        classes: 'nav-item',
        icon: <GroupOutlinedIcon />
      },
      {
        id: 'agent-support-documents',
        title: 'Agent Support',
        type: 'item',
        url: '/agent-support-documents',
        icon: <BorderColorIcon />,
        target: false,
        breadcrumbs: false
      },
      {
        id: 'essay-center',
        title: 'Essay Center',
        type: 'item',
        url: '/essay-center',
        icon: <BorderColorIcon />,
        target: false,
        breadcrumbs: false
      },
      {
        id: 'editor_center',
        title: 'CV/ML/RL Center',
        type: 'item',
        url: '/cv-ml-rl-center',
        classes: 'nav-item',
        icon: <BorderColorIcon />
      },
      {
        id: 'archiv-student',
        title: 'Archiv Students',
        type: 'item',
        icon: <ArchiveOutlinedIcon />,
        url: '/archiv/students'
      }
    ]
  },
  {
    id: 'academicsurvey',
    title: 'My Profile',
    type: 'item',
    url: '/survey',
    icon: <ArticleIcon />
  },
  {
    id: 'my-courses',
    title: 'My Courses',
    type: 'item',
    url: '/my-courses',
    icon: <ArticleIcon />
  },
  {
    id: 'applications-overview',
    title: 'Applications Overview',
    type: 'item',
    icon: <ArticleIcon />,
    url: '/student-applications'
  },
  {
    id: 'application_overivew',
    title: 'My Applications',
    type: 'collapse',
    classes: 'nav-item',
    icon: <ArticleIcon />,
    children: application_overview
  },
  {
    id: 'students_tasks_overview',
    title: 'Tasks Overview',
    type: 'item',
    url: '/tasks/students/overview',
    classes: 'nav-item',
    icon: <ArticleIcon />
  },
  {
    id: 'student_task',
    title: 'My Tasks Overview',
    type: 'item',
    url: '/tasks',
    classes: 'nav-item',
    icon: <ArticleIcon />
  },
  {
    id: 'user-table',
    title: 'User List',
    type: 'item',
    icon: <PeopleAltOutlinedIcon />,
    url: '/users'
  },
  {
    id: 'program-table',
    title: 'Program List',
    type: 'item',
    icon: <SchoolOutlinedIcon />,
    url: '/programs'
  },

  {
    id: 'statistics',
    title: 'Statistics',
    type: 'item',
    icon: <EqualizerIcon />,
    url: '/statistics'
  },
  {
    id: 'maps',
    title: 'Map',
    type: 'item',
    icon: 'feather icon-map',
    url: '/maps/google-map'
  },

  // {
  //   id: 'learning-resources',
  //   title: 'Learning Resources',
  //   type: 'item',
  //   icon: 'feather icon-book',
  //   url: '/resources'
  // },

  {
    id: 'all-students',
    title: 'All Students',
    type: 'collapse',
    icon: <GroupOutlinedIcon />,
    children: all_students_nestedList
  },
  {
    id: 'taiger_widgets',
    title: 'Tools',
    type: 'collapse',
    classes: 'nav-item',
    icon: <HelpOutlineIcon />,
    children: [
      {
        id: 'course-analyser',
        title: 'Course Analyser',
        type: 'item',
        url: '/internal/widgets/course-analyser',
        icon: <BarChartIcon />,
        target: false,
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'teams_overview',
    title: `${appConfig.companyName} Teams`,
    type: 'collapse',
    classes: 'nav-item',
    icon: <Diversity3Icon />,
    children: taiger_teams_items
  },
  {
    id: 'contact_us',
    title: 'Contact Us',
    type: 'item',
    url: '/contact',
    classes: 'nav-item',
    icon: <LocalPostOfficeOutlinedIcon />
  },
  {
    id: 'internal_backend',
    title: 'Docs Database',
    type: 'collapse',
    classes: 'nav-item',
    icon: <StorageIcon />,
    children: [
      {
        id: 'documents-creation',
        title: 'Docs Database',
        type: 'item',
        url: '/internal/database/public-docs',
        icon: <StorageIcon />,
        target: false,
        breadcrumbs: false
      },
      {
        id: 'internal-documents-creation',
        title: 'Internal Docs Database',
        type: 'item',
        url: '/internal/database/internal-docs',
        icon: <StorageIcon />,
        target: false,
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'docs',
    title: 'Documentation',
    type: 'collapse',
    classes: 'nav-item',
    icon: <HelpOutlineIcon />,
    children: documentations_nestedList
  },
  {
    id: 'download',
    title: 'Download Center',
    type: 'item',
    url: '/download',
    classes: 'nav-item',
    icon: <DownloadIcon />
  }
];
