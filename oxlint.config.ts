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
})
