export default {
  items: [
    {
      id: 'navigation_sidebar',
      title: 'Navigation',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          url: '/dashboard/default',
          icon: 'feather icon-home'
        },
        {
          id: 'my-students',
          title: 'My Students',
          type: 'collapse',
          icon: 'feather icon-users',
          children: [
            {
              id: 'my-students-application-overview',
              title: 'Application Overview',
              type: 'item',
              url: '/student-applications',
              icon: 'feather icon-book',
              target: false,
              breadcrumbs: false
            },
            {
              id: 'base_documents',
              title: 'Base Documents',
              type: 'item',
              url: '/base-documents',
              classes: 'nav-item',
              icon: 'feather icon-eye'
            },
            {
              id: 'editor_center',
              title: 'CV/ML/RL Center',
              type: 'item',
              url: '/cv-ml-rl-center',
              classes: 'nav-item',
              icon: 'feather icon-edit-1'
            },
            {
              id: 'archiv-student',
              title: 'Archiv Students',
              type: 'item',
              icon: 'feather icon-users',
              url: '/archiv/students'
            }
          ]
        },
        {
          id: 'basic',
          title: 'Component',
          type: 'collapse',
          icon: 'feather icon-box',
          children: [
            {
              id: 'button',
              title: 'Button',
              type: 'item',
              url: '/basic/button'
            },
            {
              id: 'badges',
              title: 'Badges',
              type: 'item',
              url: '/basic/badges'
            },
            {
              id: 'forms',
              title: 'Forms',
              type: 'item',
              url: '/forms/form-basic'
            },
            {
              id: 'collapse',
              title: 'Collapse',
              type: 'item',
              url: '/basic/collapse'
            },
            {
              id: 'tabs-pills',
              title: 'Tabs & Pills',
              type: 'item',
              url: '/basic/tabs-pills'
            },
            {
              id: 'typography',
              title: 'Typography',
              type: 'item',
              url: '/basic/typography'
            }
          ]
        },
        {
          id: 'academicsurvey',
          title: 'My Survey',
          type: 'item',
          url: '/survey',
          icon: 'feather icon-file-text'
        },
        {
          id: 'my-courses',
          title: 'My Courses',
          type: 'item',
          url: '/my-courses',
          icon: 'feather icon-file-text'
        },
        {
          id: 'applications-overview',
          title: 'Applications Overview',
          type: 'item',
          icon: 'feather icon-book',
          url: '/student-applications'
        },
        {
          id: 'application_overivew',
          title: 'Applications Overview',
          type: 'collapse',
          classes: 'nav-item',
          icon: 'feather icon-book',
          children: [
            {
              id: 'applications_overview_stidemt',
              title: 'My Applications',
              type: 'item',
              icon: 'feather icon-book',
              url: '/student-applications',
              target: false
            },
            {
              id: 'base_documents',
              title: 'My Documents',
              type: 'item',
              url: '/base-documents',
              classes: 'nav-item',
              icon: 'feather icon-eye',
              target: false,
              breadcrumbs: false
            },
            {
              id: 'editor_center',
              title: 'CV ML RL Overview',
              type: 'item',
              url: '/cv-ml-rl-center',
              classes: 'nav-item',
              icon: 'feather icon-edit-1',
              target: false,
              breadcrumbs: false
            },
            {
              id: 'application_portal_management',
              title: 'Portals Management',
              type: 'item',
              url: '/portal-informations',
              classes: 'nav-item',
              icon: 'feather icon-layout',
              target: false,
              breadcrumbs: false
            },
            {
              id: 'uni_assist_tasks',
              title: 'Uni-Assist Tasks',
              type: 'item',
              url: '/uni-assist',
              classes: 'nav-item',
              icon: 'feather icon-navigation',
              target: false,
              breadcrumbs: false
            }
          ]
        },
        {
          id: 'students_tasks_overview',
          title: 'Tasks Overview',
          type: 'item',
          url: '/tasks/students/overview',
          classes: 'nav-item',
          icon: 'feather icon-eye'
        },
        {
          id: 'student_task',
          title: 'My Tasks Overview',
          type: 'item',
          url: '/tasks',
          classes: 'nav-item',
          icon: 'feather icon-eye'
        },
        {
          id: 'user-table',
          title: 'User List',
          type: 'item',
          icon: 'feather icon-users',
          url: '/users'
        },
        {
          id: 'program-table',
          title: 'Program List',
          type: 'item',
          icon: 'feather icon-list',
          url: '/programs'
        },

        {
          id: 'statistics',
          title: 'Statistics',
          type: 'item',
          icon: 'feather icon-bar-chart-2',
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
          icon: 'feather icon-users',
          children: [
            {
              id: 'all-application-overview',
              title: 'All Application Overview',
              type: 'item',
              url: '/all-students-applications',
              classes: 'nav-item',
              icon: 'fa fa-university'
            },
            {
              id: 'tasks_dashboard',
              title: 'Tasks Dashboard',
              type: 'item',
              url: '/dashboard/cv-ml-rl',
              classes: 'nav-item',
              icon: 'feather icon-edit-1'
            },
            {
              id: 'all-students-application-overview',
              title: 'Student Overview',
              type: 'item',
              url: '/students-overview',
              classes: 'nav-item',
              icon: 'fa fa-users'
            },
            {
              id: 'internal_program_conflict',
              title: 'Program Conflict',
              type: 'item',
              icon: 'feather icon-package',
              url: '/internal/program-conflict'
            },
            {
              id: 'admissions_overview',
              title: 'TaiGer Admissions',
              type: 'item',
              icon: 'feather icon-award',
              url: '/admissions-overview'
            },
            {
              id: 'archiv-student',
              title: 'Archiv Students',
              type: 'item',
              icon: 'feather icon-users',
              url: '/archiv/students/all'
            },
            {
              id: 'prev_students_database',
              title: 'Student Database',
              type: 'item',
              url: '/student-database',
              classes: 'nav-item',
              icon: 'feather icon-cloud'
            }
          ]
        },
        {
          id: 'taiger_widgets',
          title: 'Tools',
          type: 'collapse',
          classes: 'nav-item',
          icon: 'feather icon-codepen',
          children: [
            {
              id: 'course-analyser',
              title: 'Course Analyser',
              type: 'item',
              url: '/internal/widgets/course-analyser',
              icon: 'feather icon-gitlab',
              target: false,
              breadcrumbs: false
            },
            {
              id: 'wdiget-placeholder',
              title: 'Placeholder',
              type: 'item',
              url: '/internal/widgets/course-analyser',
              icon: 'feather icon-github',
              target: false,
              breadcrumbs: false
            }
          ]
        },
        {
          id: 'teams_overview',
          title: 'TaiGer Teams',
          type: 'collapse',
          classes: 'nav-item',
          icon: 'fa fa-coffee',
          children: [
            {
              id: 'teams_member_permission',
              title: 'Permissions',
              type: 'item',
              icon: 'fa fa-key',
              url: '/teams/permissions'
            },
            {
              id: 'teams_member',
              title: 'TaiGer Teams',
              type: 'item',
              icon: 'fa fa-user',
              url: '/teams/members'
            },
            {
              id: 'internal_dashboard',
              title: 'TaiGer Dashboard',
              type: 'item',
              icon: 'feather icon-target',
              url: '/dashboard/internal'
            },

            {
              id: 'internal_accounting',
              title: 'TaiGer Accounting',
              type: 'item',
              icon: 'fa fa-euro',
              url: '/internal/accounting'
            }
          ]
        },
        {
          id: 'contact_us',
          title: 'Contact Us',
          type: 'item',
          url: '/contact',
          classes: 'nav-item',
          icon: 'feather icon-mail'
        },
        {
          id: 'menu-level',
          title: 'Menu Levels',
          type: 'collapse',
          icon: 'feather icon-menu',
          children: [
            {
              id: 'menu-level-1.1',
              title: 'Menu Level 1.1',
              type: 'item',
              url: '#!'
            },
            {
              id: 'menu-level-1.2',
              title: 'Menu Level 2.2',
              type: 'collapse',
              children: [
                {
                  id: 'menu-level-2.1',
                  title: 'Menu Level 2.1',
                  type: 'item',
                  url: '#'
                }
              ]
            }
          ]
        },
        {
          id: 'internal_backend',
          title: 'Docs Database',
          type: 'collapse',
          classes: 'nav-item',
          icon: 'feather icon-codepen',
          children: [
            {
              id: 'documents-creation',
              title: 'Docs Database',
              type: 'item',
              url: '/internal/database/public-docs',
              icon: 'feather icon-help-circle',
              target: false,
              breadcrumbs: false
            },
            {
              id: 'internal-documents-creation',
              title: 'Internal Docs Database',
              type: 'item',
              url: '/internal/database/internal-docs',
              icon: 'feather icon-help-circle',
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
          icon: 'feather icon-help-circle',
          children: [
            {
              id: 'howtostart',
              title: 'How to Start',
              type: 'item',
              url: '/docs/howtostart',
              icon: 'feather icon-help-circle',
              target: false,
              breadcrumbs: false
            },
            {
              id: 'base-documents',
              title: 'Base Documents',
              type: 'item',
              url: '/docs/base-documents',
              icon: 'feather icon-help-circle',
              target: false,
              breadcrumbs: false
            },
            {
              id: 'cv-ml-rl',
              title: 'CV/ML/RL',
              type: 'item',
              url: '/docs/cv-ml-rl',
              icon: 'feather icon-help-circle',
              target: false,
              breadcrumbs: false
            },
            {
              id: 'doc-uniassist',
              title: 'Uni-Assist',
              type: 'item',
              url: '/docs/uniassist',
              icon: 'feather icon-help-circle',
              target: false,
              breadcrumbs: false
            },
            {
              id: 'visa',
              title: 'Visa',
              type: 'item',
              url: '/docs/visa',
              icon: 'feather icon-book',
              target: false,
              breadcrumbs: false
            },
            {
              id: 'internal-docs',
              title: 'Internal Docs',
              type: 'item',
              url: '/docs/taiger/internal',
              icon: 'feather icon-help-circle',
              target: false,
              breadcrumbs: false
            }
          ]
        },
        {
          id: 'download',
          title: 'Download Center',
          type: 'item',
          url: '/download',
          classes: 'nav-item',
          icon: 'feather icon-download'
        }
        // {
        //   id: 'interview-training',
        //   title: 'Interview Training',
        //   type: 'item',
        //   icon: 'feather icon-briefcase',
        //   url: '/interview-training'
        // }
        // {
        //   id: "disabled-menu",
        //   title: "Disabled Menu",
        //   type: "item",
        //   url: "#",
        //   classes: "nav-item disabled",
        //   icon: "feather icon-power",
        // },
        // {
        //   id: "buy-now",
        //   title: "Buy Now",
        //   type: "item",
        //   icon: "feather icon-user",
        //   classes: "nav-item",
        //   url: "https://codedthemes.com",
        //   target: true,
        //   external: true,
        //   badge: {
        //     title: "v1.0",
        //     type: "label-primary",
        //   },
        // },
      ]
    }
  ]
};
