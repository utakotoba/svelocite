import { defineConfig } from 'oxlint'

export default defineConfig({
  plugins: [
    'eslint',
    'import',
    'typescript',
    'oxc',
    'jsdoc',
    'promise',
    'unicorn',
  ],
  rules: {
    'typescript/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
        fixStyle: 'separate-type-imports',
      },
    ],
  },
})
