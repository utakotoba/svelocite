import { paraglideVitePlugin as paraglide } from '@inlang/paraglide-js'
import { enhancedImages } from '@sveltejs/enhanced-img'
import { sveltekit } from '@sveltejs/kit/vite'
import unocss from 'unocss/vite'
import { defineConfig } from 'vite'

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
