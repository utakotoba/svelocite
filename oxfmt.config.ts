import { defineConfig } from 'oxfmt'

export default defineConfig({
  printWidth: 80,
  semi: false,
  singleQuote: true,
  jsdoc: true,
  sortImports: {
    order: 'desc',
  },
  sortPackageJson: true,
  sortTailwindcss: true,
  svelte: true,
})
