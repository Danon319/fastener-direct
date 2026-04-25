import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import prettierConfig from 'eslint-config-prettier'

export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // React 17+ не требует импорта React в каждом файле
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      // Отключаем обязательную проверку PropTypes — мы используем JSDoc
      'react/prop-types': 'off',

      // JSX использование переменных — теперь ESLint понимает
      'react/jsx-uses-vars': 'error',

      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  prettierConfig,
]