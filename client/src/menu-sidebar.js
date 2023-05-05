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
              id: 'breadcrumb-pagination',
              title: 'Breadcrumb & Pagination',
              type: 'item',
              url: '/basic/breadcrumb-paging'
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
          title: 'Academic Survey',
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
          id: 'agent_center',
          title: 'Base Documents',
          type: 'item',
          url: '/base-documents',
          classes: 'nav-item',
          icon: 'feather icon-eye'
        },
        {
          id: 'application_portal_management',
          title: 'Portals Management',
          type: 'item',
          url: '/portal-informations',
          classes: 'nav-item',
          icon: 'feather icon-layout'
        },
        {
          id: 'uni_assist_tasks',
          title: 'Uni-Assist Tasks',
          type: 'item',
          url: '/uni-assist',
          classes: 'nav-item',
          icon: 'feather icon-navigation'
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
          id: 'applications-overview',
          title: 'Applications Overview',
          type: 'item',
          icon: 'feather icon-book',
          url: '/student-applications'
        },
        {
          id: 'interview-training',
          title: 'Interview Training',
          type: 'item',
          icon: 'feather icon-briefcase',
          url: '/interview-training'
        },
        {
          id: 'statistics',
          title: 'Statistics',
          type: 'item',
          icon: 'feather icon-bar-chart-2',
          url: '/statistics'
        },
        // {
        //   id: 'charts',
        //   title: 'Charts',
        //   type: 'item',
        //   icon: 'feather icon-pie-chart',
        //   url: '/charts/nvd3'
        // },
        {
          id: 'maps',
          title: 'Map',
          type: 'item',
          icon: 'feather icon-map',
          url: '/maps/google-map'
        },
        {
          id: 'download',
          title: 'Download Center',
          type: 'item',
          url: '/download',
          classes: 'nav-item',
          icon: 'feather icon-download'
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
          url: '/archiv/students'
        },
        {
          id: 'docs',
          title: 'Documentation',
          type: 'collapse',
          classes: 'nav-item',
          icon: 'feather icon-help-circle',
          children: [
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
            // {
            //   id: 'doc-application',
            //   title: 'Application',
            //   type: 'item',
            //   url: '/docs/application',
            //   target: false,
            //   breadcrumbs: false
            // },
            // {
            //   id: 'doc-certification',
            //   title: 'Certification',
            //   type: 'item',
            //   url: '/docs/certification',
            //   target: false,
            //   breadcrumbs: false
            // },
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
          id: 'prev_students_database',
          title: 'Student Database',
          type: 'item',
          url: '/student-database',
          classes: 'nav-item',
          icon: 'feather icon-cloud'
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
          icon: 'feather icon-menu',
          children: [
            {
              id: 'teams_member',
              title: 'TaiGer Teams',
              type: 'item',
              icon: 'feather icon-star',
              url: '/teams'
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
              icon: 'feather icon-bank',
              url: '/internal/accounting'
            }
          ]
        },
        // {
        //   id: 'settings',
        //   title: 'Settings',
        //   type: 'item',
        //   url: '/settings',
        //   classes: 'nav-item',
        //   icon: 'feather icon-settings'
        // },
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
        }
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
    // {
    //   id: 'taiger_internal_sidebar',
    //   title: 'Taiger Internal',
    //   type: 'group',
    //   icon: 'icon-navigation',
    //   children: []
    // }
  ]
};
