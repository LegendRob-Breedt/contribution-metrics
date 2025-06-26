import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import neverthrow from '@ninoseki/eslint-plugin-neverthrow'

export default [
  // Base JavaScript configuration
  js.configs.recommended,
  
  // TypeScript files configuration (excluding test files)
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.config.ts'],
    ignores: ['**/*.test.ts', '**/*.spec.ts', 'src/test/**/*'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier,
      neverthrow,
    },
    rules: {
      // TypeScript recommended rules
      ...typescript.configs.recommended.rules,
      
      // Prettier integration
      'prettier/prettier': 'error',
      
      // Custom TypeScript rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // Neverthrow rules for functional error handling
      'neverthrow/must-use-result': 'error',
    },
  },
  
  // Test files configuration (without neverthrow rules)
  {
    files: ['**/*.test.ts', '**/*.spec.ts', 'src/test/**/*'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier,
    },
    rules: {
      // TypeScript recommended rules
      ...typescript.configs.recommended.rules,
      
      // Prettier integration
      'prettier/prettier': 'error',
      
      // Custom TypeScript rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // No neverthrow rules for test files
    },
  },
  
  // Ignore patterns
  {
    ignores: [
      'dist/',
      'node_modules/',
      'coverage/',
      'src/test/**/*', // Exclude test files from project parsing
    ],
  },
]
