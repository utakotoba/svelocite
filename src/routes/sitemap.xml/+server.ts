import { locales, localizeHref } from '$lib/paraglide/runtime'
import { collectRouteExports } from '$lib/server/route-collector'
import type { SitemapEntry } from '$lib/server/sitemap'
import type { RequestHandler } from '@sveltejs/kit'
import { response } from 'super-sitemap'

const EXCLUDE_PATTERNS = ['/+error', '/+404']

// MARK: - get handler

const metadata = collectRouteExports<SitemapEntry>({
  exportName: '_sitemap',
  excludePatterns: EXCLUDE_PATTERNS,
})

export const GET: RequestHandler = async ({ url }) => {
  return await response({
    origin: url.origin,
    excludeRoutePatterns: EXCLUDE_PATTERNS,
    // global defaults
    defaultChangefreq: 'daily',
    defaultPriority: 0.7,
    // paraglide
    processPaths: (paths) => {
      return paths.flatMap((entry) => {
        const base = typeof entry === 'string' ? entry : entry.path || '/'
        const meta = metadata.get(base)
        return locales.map((locale) => ({
          ...entry,
          path: localizeHref(base, { locale }),
          lastmod: meta?.lastmod
            ? new Date(meta.lastmod).toISOString().split('T')[0]
            : undefined,
          changefreq: meta?.changefreq,
          priority: meta?.priority,
        }))
      })
    },
  })
}
