### svelocite

Ly's Svelte Kit starter template with modern Svelte 5.

it includes:

- [UnoCSS](https://unocss.dev/) loaded globally with [Attributify](https://unocss.dev/presets/attributify) preset
- [inlang](https://inlang.com/) and [Paraglide JS](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) based i18n
- localized canonical and hreflang links in head and `sitemap.xml`
- route-level `_seo` config for indexing, crawling (`robots.txt`), and sitemap metadata
- [OXC](https://oxc.rs/) toolchain: `oxfmt`, `oxlint`

### [note] route seo

routes can export `_seo` from `+page.server.ts` or `+layout.server.ts`.

```ts
import { defineSeo } from '$lib/server/seo'

export const _seo = defineSeo({
  index: false,
  sitemap: false,
})
```

`index: false` adds an `X-Robots-Tag: noindex` header and excludes the route from the sitemap. `crawl: false` adds localized `Disallow` entries in `robots.txt` and also excludes the route from the sitemap. `sitemap` can hold `changefreq`, `lastmod`, and `priority`.

### license

MIT. Copyright (c) 2026 Ly (Ling Yu). See [LICENSE](./LICENSE).
