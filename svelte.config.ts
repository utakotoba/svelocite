import type { Config } from '@sveltejs/kit'
import adapter from '@sveltejs/adapter-auto'

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
