import { baseLocale, locales, localizeUrl } from '$lib/paraglide/runtime'
import { collectRoutes } from '$lib/server/route-collector'
import type { SitemapEntry } from '$lib/server/sitemap'
import type { RequestHandler } from '@sveltejs/kit'
import XMLBuilder from 'fast-xml-builder'

const EXCLUDE_PATTERNS = ['/+error', '/+404']
const XMLNS = 'http://www.sitemaps.org/schemas/sitemap/0.9'
const XHTML_XMLNS = 'http://www.w3.org/1999/xhtml'

const builder = new XMLBuilder({
  format: true,
  indentBy: '  ',
  attributeNamePrefix: '@_',
  ignoreAttributes: false,
  suppressEmptyNode: true,
})

const routes = collectRoutes<SitemapEntry>({
  excludePatterns: EXCLUDE_PATTERNS,
  exportName: '_sitemap',
})

type Locale = (typeof locales)[number]

interface AlternateLink {
  '@_rel': 'alternate'
  '@_hreflang': Locale | 'x-default'
  '@_href': string
}

interface UrlNode {
  changefreq?: SitemapEntry['changefreq']
  lastmod?: string
  loc: string
  priority?: SitemapEntry['priority']
  'xhtml:link': AlternateLink[]
}

function localizedUrl(origin: string, route: string, locale: Locale): string {
  const localized = localizeUrl(new URL(route, origin), { locale })

  if (localized.pathname !== '/' && localized.pathname.endsWith('/')) {
    localized.pathname = localized.pathname.slice(0, -1)
  }

  return localized.href
}

const formatLastmod = (lastmod: SitemapEntry['lastmod']) =>
  lastmod instanceof Date ? lastmod.toISOString() : lastmod

function alternates(origin: string, route: string): AlternateLink[] {
  const link = (hreflang: Locale | 'x-default', href: string) => ({
    '@_rel': 'alternate' as const,
    '@_hreflang': hreflang,
    '@_href': href,
  })

  return [
    link('x-default', localizedUrl(origin, route, baseLocale)),
    ...locales.map((locale) =>
      link(locale, localizedUrl(origin, route, locale)),
    ),
  ]
}

function urlNode(
  origin: string,
  route: string,
  locale: Locale,
  entry?: SitemapEntry,
): UrlNode {
  const lastmod = formatLastmod(entry?.lastmod)

  return {
    loc: localizedUrl(origin, route, locale),
    ...(lastmod ? { lastmod } : {}),
    ...(entry?.changefreq ? { changefreq: entry.changefreq } : {}),
    ...(entry?.priority !== undefined ? { priority: entry.priority } : {}),
    'xhtml:link': alternates(origin, route),
  }
}

// MARK: - get handler

export const GET: RequestHandler = async ({ url }) => {
  const body = builder.build({
    urlset: {
      '@_xmlns': XMLNS,
      '@_xmlns:xhtml': XHTML_XMLNS,
      url: routes.flatMap(({ exported, route }) =>
        locales.map((locale) => urlNode(url.origin, route, locale, exported)),
      ),
    },
  })

  const headers = {
    'Cache-Control': 'max-age=0, s-maxage=3600',
    'Content-Type': 'application/xml; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
  }

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${body}`, {
    headers,
  })
}
