import adapter from '@sveltejs/adapter-auto'
import type { Config } from '@sveltejs/kit'

const config = {
  kit: {
    adapter: adapter(),
  },
  compilerOptions: {
    // TODO remove runes enforcement in Svelte 6
    runes: ({ filename }) =>
      filename.split(/[/\\]/).includes('node_modules') ? undefined : true,
  },
} satisfies Config

export default config
