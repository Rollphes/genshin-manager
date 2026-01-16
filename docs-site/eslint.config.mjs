import eslintJs from '@eslint/js'
import nextPlugin from '@next/eslint-plugin-next'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

export default [
  // Base ESLint recommended config
  eslintJs.configs.recommended,

  // TypeScript ESLint configs for .ts and .tsx files
  ...tseslint.config(
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: [
        tseslint.configs.strict,
        tseslint.configs.strictTypeChecked,
        tseslint.configs.stylistic,
        tseslint.configs.stylisticTypeChecked,
      ],
      languageOptions: {
        parserOptions: {
          project: './tsconfig.json',
        },
      },
      rules: {
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/member-ordering': 'warn',
        '@typescript-eslint/explicit-member-accessibility': [
          'error',
          {
            accessibility: 'explicit',
            overrides: {
              accessors: 'explicit',
              constructors: 'no-public',
              methods: 'explicit',
              properties: 'explicit',
              parameterProperties: 'explicit',
            },
          },
        ],
        '@typescript-eslint/explicit-function-return-type': 'error',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'default',
            format: ['camelCase'],
            leadingUnderscore: 'allow',
          },
          {
            selector: 'import',
            format: ['camelCase', 'PascalCase'],
          },
          {
            selector: 'variable',
            format: ['camelCase'],
            leadingUnderscore: 'allow',
            trailingUnderscore: 'allow',
          },
          {
            // Allow PascalCase for React components and UPPER_CASE for Next.js HTTP methods
            selector: 'variable',
            modifiers: ['const'],
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          },
          {
            // Allow UPPER_CASE for destructured Next.js HTTP methods (GET, POST, etc.)
            selector: 'variable',
            modifiers: ['destructured', 'exported'],
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          },
          {
            selector: 'variable',
            modifiers: ['const', 'global'],
            types: ['boolean', 'number', 'string'],
            format: ['UPPER_CASE'],
          },
          {
            selector: 'variable',
            modifiers: ['const', 'global', 'exported'],
            types: ['boolean', 'number', 'string', 'array', 'function'],
            format: ['camelCase', 'UPPER_CASE'],
          },
          {
            selector: 'variable',
            modifiers: ['const', 'global', 'exported'],
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          },
          {
            selector: 'property',
            modifiers: ['requiresQuotes'],
            format: null,
          },
          {
            selector: 'property',
            modifiers: ['static', 'readonly'],
            types: ['boolean', 'number', 'string'],
            format: ['UPPER_CASE'],
          },
          {
            selector: 'typeLike',
            format: ['PascalCase'],
          },
          {
            selector: 'objectLiteralProperty',
            format: null,
          },
          {
            selector: 'enumMember',
            format: ['UPPER_CASE'],
          },
          {
            selector: 'typeProperty',
            format: ['camelCase', 'snake_case', 'UPPER_CASE'],
          },
          {
            selector: 'function',
            modifiers: ['exported'],
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          },
        ],
        // Allow async functions without await for Next.js generateStaticParams
        '@typescript-eslint/require-await': 'off',
      },
    },
    {
      extends: [eslintPluginPrettierRecommended, eslintConfigPrettier],
      rules: {
        'prettier/prettier': [
          'error',
          {
            singleQuote: true,
            semi: false,
          },
        ],
      },
    },
  ),

  // React and Next.js configurations
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@next/next': nextPlugin,
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      next: {
        rootDir: '.',
      },
    },
    rules: {
      // React rules
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,

      // React Hooks rules
      ...reactHooksPlugin.configs.recommended.rules,

      // Next.js specific rules
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      '@next/next/no-img-element': 'error',
    },
  },

  // Import sorting configuration
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
    },
  },

  // General JavaScript rules
  {
    rules: {
      'no-unused-vars': 'off',
      complexity: ['error'],
      curly: ['error', 'multi-or-nest', 'consistent'],
      'dot-notation': 'error',
      eqeqeq: ['error', 'smart'],
      'no-new': 'error',
      'no-new-wrappers': 'error',
      'no-param-reassign': 'error',
      'no-throw-literal': 'error',
      'func-style': ['warn', 'declaration'],
      // Allow relative imports for CSS and local files in Next.js
      'no-restricted-imports': 'off',
    },
  },

  // Ignore patterns
  {
    ignores: [
      'node_modules/',
      '.next/',
      '.source/',
      'out/',
      '*.config.js',
      '*.config.mjs',
      'next-env.d.ts',
    ],
  },
]
