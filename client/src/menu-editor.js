export default {
  items: [
    {
      id: "navigation_editor",
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
          id: "archiv-students",
          title: "Archiv Students",
          type: "item",
          icon: "feather icon-users",
          url: "/archiv/students",
        },
        // {
        //   id: "program-table",
        //   title: "Program List",
        //   type: "item",
        //   icon: "feather icon-list",
        //   url: "/programs",
        // },
        // {
        //     id: 'charts',
        //     title: 'Charts',
        //     type: 'item',
        //     icon: 'feather icon-pie-chart',
        //     url: '/charts/nvd3'
        // },
        {
          id: "editor_center",
          title: "Editor Center",
          type: "item",
          url: "/editor-center",
          classes: "nav-item",
          icon: "feather icon-edit-2",
        },
        {
          id: "download",
          title: "Download",
          type: "item",
          url: "/download",
          classes: "nav-item",
          icon: "feather icon-download",
        },
        {
          id: "taigerai",
          title: "TaiGer AI",
          type: "item",
          url: "/taigerai",
          classes: "nav-item",
          icon: "feather icon-box",
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
  ],
};
