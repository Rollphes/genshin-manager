module.exports = {
  extends: [],
  rules: {
    // Custom rules for [prefix] format
    'type-enum': [
      2,
      'always',
      [
        '[feat]',
        '[fix]',
        '[refactor]',
        '[update]',
        '[docs]',
        '[style]',
        '[test]',
        '[perf]',
        '[ci]',
        '[build]',
        '[chore]',
        '[revert]'
      ]
    ],
    'type-case': [0], // Disable type case checking
    'type-empty': [2, 'never'], // Type must not be empty
    'subject-empty': [2, 'never'], // Subject must not be empty
    'subject-min-length': [2, 'always', 3], // Subject minimum length
    'subject-max-length': [2, 'always', 100], // Subject maximum length
    'header-max-length': [2, 'always', 100], // Header maximum length
    'body-leading-blank': [0], // Disable body leading blank line
    'body-empty': [2, 'always'], // Body must be empty (single line only)
    'footer-leading-blank': [0], // Disable footer leading blank line
    'footer-empty': [2, 'always'], // Footer must be empty (single line only)
    'header-full-stop': [2, 'never', '.'], // No full stop at end of header
    'subject-full-stop': [2, 'never', '.'], // No full stop at end of subject
    'subject-case': [0] // Disable subject case checking
  },
  parserPreset: {
    parserOpts: {
      // Custom parser to handle [prefix] format
      headerPattern: /^(\[[\w]+\])\s(.*)$/,
      headerCorrespondence: ['type', 'subject']
    }
  }
};
