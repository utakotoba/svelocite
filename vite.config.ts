import { defineConfig } from 'vite'
import unocss from 'unocss/vite'
import { sveltekit } from '@sveltejs/kit/vite'
import { enhancedImages } from '@sveltejs/enhanced-img'
import { paraglideVitePlugin as paraglide } from '@inlang/paraglide-js'

export default defineConfig({
  plugins: [
    paraglide({
      project: './.inlang',
      outdir: './src/lib/paraglide',
      strategy: ['url', 'baseLocale'],
    }),
    unocss(),
    enhancedImages(),
    sveltekit(),
  ],
})
