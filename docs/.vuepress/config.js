const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'eXo developers documentation',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: '',
    editLinks: false,
    docsDir: '',
    editLinkText: '',
    lastUpdated: false,
    nav: [
      {
        text: 'Getting Started',
        link: '/guide/getting-started/Introduction.html',
      },
      {
        text: 'Technical Administration',
        link: '/administration/',
      },
      {
        text: 'REST API',
        link: '/guide/developer-guide/rest-api',
      },
      {
        text: 'Q&A',
        link: 'https://github.com/exoplatform/exo-community/discussions'
      }
    ],
    sidebar: {
      '/guide': [
        {
          title: 'Getting Started',
          collapsable: false,
          path: '/guide/getting-started/Introduction.html',
          children: [
            '/guide/getting-started/Introduction',
            '/guide/getting-started/start-community',
          ]
        },
        '/guide/userAndAdminGuide',
        {
          title: 'Developer guide',
          collapsable: false,
          path: '/guide/developer-guide/getting-started',
          children: [
            '/guide/developer-guide/getting-started',
            '/guide/developer-guide/prepare-extension-project',
            {
              title: 'Simple Integration',
              collapsable: true,
              path: '/guide/developer-guide/simple-integration/',
              children: [
                '/guide/developer-guide/simple-integration/activity-type',
                '/guide/developer-guide/simple-integration/event-listeners',
                '/guide/developer-guide/simple-integration/notification',
              ]
            },
            {
              title: 'Intermediate Integration',
              collapsable: true,
              path: '/guide/developer-guide/intermediate-integration/',
              children: [
                '/guide/developer-guide/intermediate-integration/front-end-application',
                '/guide/developer-guide/intermediate-integration/rest-service',
              ]
            },
            //{
            //  title: 'Advanced Integration',
            //  collapsable: true,
            //  path: '/guide/developer-guide/advanced-integration/',
            //  children: [
            //    '/guide/developer-guide/advanced-integration/extension-points',
            //  ]
            //},
            {
              title: 'REST API',
              collapsable: true,
              path: '/guide/developer-guide/rest-api',
              children: [
                ['/guide/openapi/agenda', 'Agenda REST Api'],
                ['/guide/openapi/anti-malware', 'Anti Malware REST Api'],
                ['/guide/openapi/app-center', 'App Center REST Api'],
                ['/guide/openapi/chat', 'Chat REST Api'],
                ['/guide/openapi/commons', 'Commons REST Api'],
                ['/guide/openapi/dlp', 'Data Leak Protection REST Api'],
                ['/guide/openapi/documents', 'Documents REST Api'],
                ['/guide/openapi/ecms', 'ECMS REST Api'],
                ['/guide/openapi/gamification', 'Gamification REST Api'],
                ['/guide/openapi/gatein_portal', 'Portal REST Api'],
                ['/guide/openapi/kudos', 'Kudos REST Api'],
                ['/guide/openapi/multifactor-authentication', 'Multi-factor Authentication REST Api'],
                ['/guide/openapi/news', 'News REST Api'],
                ['/guide/openapi/notes', 'Notes REST Api'],
                ['/guide/openapi/onlyoffice', 'Onlyoffice REST Api'],
                ['/guide/openapi/perk-store', 'Perk store REST Api'],
                ['/guide/openapi/poll', 'Poll REST Api'],
                ['/guide/openapi/processes', 'Processes REST Api'],
                ['/guide/openapi/social', 'Social REST Api'],
                ['/guide/openapi/tasks', 'Tasks REST Api'],
                ['/guide/openapi/wallet', 'Wallet REST Api'],
                ['/guide/openapi/web-conferencing', 'Web Conferencing REST Api'],
              ]
            },
            {
              title: 'Miscellaneous',
              collapsable: true,
              path: '/guide/developer-guide/miscellaneous/debug-dev-mode',
              children: [
                '/guide/developer-guide/miscellaneous/debug-dev-mode',
                //'/guide/developer-guide/miscellaneous/feature-flags',
                //'/guide/developer-guide/miscellaneous/properties-reference',
              ]
            },
          ]
        }
      ],
      '/administration/': [
        {
          title: 'Technical Administration Guide',
          collapsable: false,
          path: '/administration/',
          children: [
            '/administration/configuration',
            '/administration/database',
            '/administration/backup-restore',
            '/administration/indexing',
            '/administration/LDAP',
            '/administration/oauth-integration',
            '/administration/addons-management',
            '/administration/security',
            '/administration/jmx-rest-management'
          ]
        },
      ],
    
      '/': [ // Your fallback (this is your landing page)
        '' // this is your README.md (main)
      ]       
    }
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
