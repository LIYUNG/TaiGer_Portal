module.exports = {
  input: [
    'src/**/*.{js,jsx}',
    // Use ! to filter out files or directories
    '!src/**/*.test.{js,jsx}',
    '!src/i18next/**',
    '!node_modules/**'
  ],
  output: './',
  options: {
    debug: true,
    sort: true,
    // read strings from functions: IllegalMoveError('KEY') or t('KEY')
    func: {
      list: ['i18next.t', 't'],
      extensions: ['.js', '.jsx']
    },

    trans: {
      component: 'Trans',
      i18nKey: 'i18nKey',
      defaultsKey: 'defaults',
      extensions: ['.js', '.jsx'],
      fallbackKey: function (ns, value) {
        return value;
      },

      // https://react.i18next.com/latest/trans-component#usage-with-simple-html-elements-like-less-than-br-greater-than-and-others-v10.4.0
      supportBasicHtmlNodes: true, // Enables keeping the name of simple nodes (e.g. <br/>) in translations instead of indexed keys.
      keepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'], // Which nodes are allowed to be kept in translations during defaultValue generation of <Trans>.

      // https://github.com/acornjs/acorn/tree/master/acorn#interface
      acorn: {
        ecmaVersion: 2020,
        sourceType: 'module' // defaults to 'module'
      }
    },
    removeUnusedKeys: true,

    // Create and update files `en.json`, `fr.json`, `es.json`
    lngs: ['en', 'zh-TW'],

    ns: [
      // The namespace I use
      'admissions',
      'auth',
      'documents',
      'translation',
      'interviews',
      'common',
      'dashboard',
      'cvmlrl',
      'tickets',
      'customerCenter',
      'Note',
      'courses',
      'survey'
    ],

    defaultLng: 'en',
    defaultNs: 'translation',

    // Put a blank string as initial translation
    // (useful for Weblate be marked as 'not yet translated', see later)
    defaultValue: '',

    // Location of translation files
    resource: {
      loadPath: './src/i18next/{{lng}}.json',
      savePath: './src/i18next/{{lng}}.json',
      jsonIndent: 4
    },

    nsSeparator: false, // namespace separator
    keySeparator: false, // key separator
    interpolation: {
      prefix: '{{',
      suffix: '}}'
    }
  }
};
