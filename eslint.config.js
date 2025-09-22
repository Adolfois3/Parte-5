import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jest from 'eslint-plugin-jest' // Importa el plugin de Jest

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/prop-types': 0,
    },
  },
  // Configuración específica para los archivos de prueba
  {
    files: ['**/*.test.js', '**/*.test.jsx'],
    languageOptions: {
      // Agrega las variables globales de Jest/Vitest
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },
    plugins: {
      jest: jest,
    },
    rules: {
      ...jest.configs.recommended.rules,
      'no-unused-vars': 'off', // Desactiva la regla en los tests
    },
  },
];