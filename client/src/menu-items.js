export default {
  items: [
    {
      id: "navigation",
      title: "Navigation",
      type: "group",
      icon: "icon-navigation",
      children: [
        {
          id: "dashboard",
          title: "Dashboard",
          type: "item",
          url: "/dashboard/default",
          icon: "feather icon-home",
        },
        {
          id: "basic",
          title: "Component",
          type: "collapse",
          icon: "feather icon-box",
          children: [
            {
              id: "button",
              title: "Button",
              type: "item",
              url: "/basic/button",
            },
            {
              id: "badges",
              title: "Badges",
              type: "item",
              url: "/basic/badges",
            },
            {
              id: "breadcrumb-pagination",
              title: "Breadcrumb & Pagination",
              type: "item",
              url: "/basic/breadcrumb-paging",
            },
            {
              id: "collapse",
              title: "Collapse",
              type: "item",
              url: "/basic/collapse",
            },
            {
              id: "tabs-pills",
              title: "Tabs & Pills",
              type: "item",
              url: "/basic/tabs-pills",
            },
            {
              id: "typography",
              title: "Typography",
              type: "item",
              url: "/basic/typography",
            },
          ],
        },
        {
          id: "user-table",
          title: "User List",
          type: "item",
          icon: "feather icon-users",
          url: "/users",
        },
        {
          id: "program-table",
          title: "Program List",
          type: "item",
          icon: "feather icon-list",
          url: "/programs",
        },
        // {
        //     id: 'charts',
        //     title: 'Charts',
        //     type: 'item',
        //     icon: 'feather icon-pie-chart',
        //     url: '/charts/nvd3'
        // },
        // {
        //     id: 'maps',
        //     title: 'Map',
        //     type: 'item',
        //     icon: 'feather icon-map',
        //     url: '/maps/google-map'
        // },
        // {
        // {
        //   id: "upload",
        //   title: "Upload Documents",
        //   type: "item",
        //   url: "/upload",
        //   classes: "nav-item",
        //   icon: "feather icon-upload",
        // },
        {
          id: "taigerai",
          title: "TaiGer AI",
          type: "item",
          url: "/taigerai",
          classes: "nav-item",
          icon: "feather icon-code",
        },
        {
          id: "docs",
          title: "Documentation",
          type: "collapse",
          classes: "nav-item",
          icon: "feather icon-help-circle",
          children: [
            {
              id: "doc-application",
              title: "Application",
              type: "item",
              url: "/docs/application",
              target: false,
              breadcrumbs: false,
            },
            {
              id: "doc-certification",
              title: "Certification",
              type: "item",
              url: "/docs/certification",
              target: false,
              breadcrumbs: false,
            },
            {
              id: "doc-uniassist",
              title: "Uni-Assist",
              type: "item",
              url: "/docs/uniassist",
              target: false,
              breadcrumbs: false,
            },
            {
              id: "doc-visa",
              title: "Visa",
              type: "item",
              url: "/docs/visa",
              target: false,
              breadcrumbs: false,
            },
          ],
        },
        {
          id: "menu-level",
          title: "Menu Levels",
          type: "collapse",
          icon: "feather icon-menu",
          children: [
            {
              id: "menu-level-1.1",
              title: "Menu Level 1.1",
              type: "item",
              url: "#!",
            },
            {
              id: "menu-level-1.2",
              title: "Menu Level 2.2",
              type: "collapse",
              children: [
                {
                  id: "menu-level-2.1",
                  title: "Menu Level 2.1",
                  type: "item",
                  url: "#",
                },
              ],
            },
          ],
        },
        {
          id: "disabled-menu",
          title: "Disabled Menu",
          type: "item",
          url: "#",
          classes: "nav-item disabled",
          icon: "feather icon-power",
        },
        /*{
                    id: 'buy-now',
                    title: 'Buy Now',
                    type: 'item',
                    icon: 'feather icon-user',
                    classes: 'nav-item',
                    url: 'https://codedthemes.com',
                    target: true,
                    external: true,
                    badge: {
                        title: 'v1.0',
                        type: 'label-primary'
                    }
                }*/
      ],
    },
    // {
    //     id: 'ui-forms',
    //     title: 'Forms & Tables',
    //     type: 'group',
    //     icon: 'icon-group',
    //     children: [

    //     ]
    // },
    // {
    //     id: 'pages',
    //     title: 'Pages',
    //     type: 'group',
    //     icon: 'icon-pages',
    //     children: [

    //     ]
    // }
  ],
};