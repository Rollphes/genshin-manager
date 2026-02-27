import eslintJs from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import jsdoc from 'eslint-plugin-jsdoc'
import noBarrelFiles from 'eslint-plugin-no-barrel-files'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'

export default [
  eslintJs.configs.recommended,
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
        ecmaVersion: 2018,
        parserOptions: {
          project: true,
          tsconfigRootDir: import.meta.dirname,
        },
        globals: {
          BigInt: true,
        },
      },
      rules: {
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {
            prefer: 'type-imports',
            fixStyle: 'separate-type-imports',
          },
        ],
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/member-ordering': 'warn',
        '@typescript-eslint/no-deprecated': 'off',
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
            selector: 'variable',
            modifiers: ['const', 'global'],
            types: ['boolean', 'number', 'string'],
            format: ['UPPER_CASE'],
          },
          {
            selector: 'variable',
            modifiers: ['const', 'global', 'exported'],
            types: ['boolean', 'number', 'string', 'array', 'function'],
            format: ['camelCase'],
          },
          {
            selector: 'variable',
            modifiers: ['const', 'global', 'exported'],
            format: ['camelCase', 'PascalCase'],
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
            format: ['PascalCase'],
          },
          {
            selector: 'typeProperty',
            format: ['camelCase', 'snake_case', 'UPPER_CASE'],
          },
          {
            selector: 'function',
            modifiers: ['exported'],
            format: ['camelCase', 'PascalCase'],
          },
        ],
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
  {
    plugins: {
      jsdoc,
    },
    rules: {
      'jsdoc/require-jsdoc': [
        'error',
        {
          publicOnly: true,
          require: {
            ArrowFunctionExpression: true,
            ClassDeclaration: true,
            ClassExpression: true,
            FunctionDeclaration: true,
            FunctionExpression: true,
            MethodDefinition: true,
          },
          contexts: [
            'VariableDeclaration',
            'TSInterfaceDeclaration',
            'TSTypeAliasDeclaration',
            'TSPropertySignature',
            'TSMethodSignature',
          ],
        },
      ],
      'jsdoc/require-param-description': 'error',
      'jsdoc/require-param': 'error',
      'jsdoc/check-param-names': 'error',
      'jsdoc/require-returns-check': 'error',
      'jsdoc/no-undefined-types': 'error',
      'jsdoc/check-types': 'error',
      'jsdoc/require-hyphen-before-param-description': [
        'error',
        'always',
        { tags: { throws: 'always', returns: 'never' } },
      ],
      'jsdoc/require-throws': 'error',
      'jsdoc/require-description': [
        'error',
        {
          contexts: [
            'ArrowFunctionExpression',
            'ClassDeclaration',
            'ClassExpression',
            'FunctionDeclaration',
            'FunctionExpression',
            'MethodDefinition',
            'PropertyDefinition',
            'VariableDeclaration',
            'TSInterfaceDeclaration',
            'TSTypeAliasDeclaration',
            'TSPropertySignature',
            'TSMethodSignature',
          ],
        },
      ],
      'jsdoc/check-tag-names': [
        'error',
        {
          definedTags: ['warning', 'key', 'value', 'remarks', 'link'],
        },
      ],
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      'no-barrel-files': noBarrelFiles,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'no-barrel-files/no-barrel-files': 'error',
    },
  },
  {
    files: ['src/index.ts'],
    rules: {
      'no-barrel-files/no-barrel-files': 'off',
    },
  },
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
      'no-restricted-imports': [
        'error',
        {
          patterns: ['./', '../', '~/'],
        },
      ],
    },
  },
  {
    ignores: ['dist/', 'node_modules/', '*.config.js', '*.config.ts', '*.config.mjs'],
  },
]