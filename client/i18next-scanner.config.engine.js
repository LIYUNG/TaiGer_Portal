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
      'programList',
      'portalManagement',
      'uniassist',
      'logs',
      'common',
      'dashboard',
      'cvmlrl',
      'tickets',
      'customerCenter',
      'Note',
      'courses',
      'survey',
      'visa'
    ],

    defaultLng: 'en',
    defaultNs: 'translation',

    // Put a blank string as initial translation
    // (useful for Weblate be marked as 'not yet translated', see later)
    defaultValue: '',

    // Location of translation files
    resource: {
      loadPath: 'src/i18n/{{lng}}/{{ns}}.json',
      savePath: 'src/i18n/{{lng}}/{{ns}}.json',
      jsonIndent: 4
    },

    nsSeparator: false, // namespace separator
    keySeparator: false, // key separator
    customParser: (code, file) => {
      const keys = [];
      // Match patterns like `t(subMenuItem.title)` and extract the variable
      const regex = /t\(([^)]+)\)/g;
      let match;
      while ((match = regex.exec(code)) !== null) {
        keys.push(match[1].replace(/["'`]/g, '').trim()); // Strip quotes or spaces
      }
      return keys;
    },
    allowDynamicKeys: true,
    interpolation: {
      prefix: '{{',
      suffix: '}}'
    }
  }
};
