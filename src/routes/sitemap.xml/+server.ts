import { baseLocale, locales, localizeUrl } from '$lib/paraglide/runtime'
import { collectRoutes } from '$lib/server/route-collector'
import {
  getSitemapOptions,
  SEO_EXPORT_NAME,
  type SeoOptions,
  type SitemapOptions,
} from '$lib/server/seo'
import type { RequestHandler } from '@sveltejs/kit'
import XMLBuilder from 'fast-xml-builder'

// MARK: - constants

const EXCLUDE_PATTERNS = ['/+error', '/+404']
const XMLNS = 'http://www.sitemaps.org/schemas/sitemap/0.9'
const XHTML_XMLNS = 'http://www.w3.org/1999/xhtml'

// MARK: - defaults
const DEFAULT_CHANGEFREQ = 'daily' satisfies NonNullable<
  SitemapOptions['changefreq']
>
const DEFAULT_LASTMOD = new Date().toISOString()
const DEFAULT_PRIORITY = 0.5 satisfies NonNullable<SitemapOptions['priority']>

// MARK: - sitemap builder

const builder = new XMLBuilder({
  format: true,
  indentBy: '  ',
  attributeNamePrefix: '@_',
  ignoreAttributes: false,
  suppressEmptyNode: true,
})

const routes = collectRoutes<SeoOptions>({
  excludePatterns: EXCLUDE_PATTERNS,
  exportName: SEO_EXPORT_NAME,
})

type Locale = (typeof locales)[number]

interface AlternateLink {
  '@_rel': 'alternate'
  '@_hreflang': Locale | 'x-default'
  '@_href': string
}

interface UrlNode {
  changefreq: NonNullable<SitemapOptions['changefreq']>
  lastmod: string
  loc: string
  priority: NonNullable<SitemapOptions['priority']>
  'xhtml:link': AlternateLink[]
}

function localizedUrl(origin: string, route: string, locale: Locale): string {
  const localized = localizeUrl(new URL(route, origin), { locale })

  if (localized.pathname !== '/' && localized.pathname.endsWith('/')) {
    localized.pathname = localized.pathname.slice(0, -1)
  }

  return localized.href
}

const formatLastmod = (
  lastmod: NonNullable<SitemapOptions['lastmod']>,
): string => (lastmod instanceof Date ? lastmod.toISOString() : lastmod)

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
  entry?: SitemapOptions,
): UrlNode {
  const {
    changefreq = DEFAULT_CHANGEFREQ,
    lastmod = DEFAULT_LASTMOD,
    priority = DEFAULT_PRIORITY,
  } = entry ?? {}

  return {
    changefreq,
    lastmod: formatLastmod(lastmod),
    loc: localizedUrl(origin, route, locale),
    priority,
    'xhtml:link': alternates(origin, route),
  }
}

// MARK: - get handler

export const GET: RequestHandler = async ({ url }) => {
  const body = builder.build({
    urlset: {
      '@_xmlns': XMLNS,
      '@_xmlns:xhtml': XHTML_XMLNS,
      url: routes.flatMap(({ exported, route }) => {
        const entry = getSitemapOptions(exported)
        return entry
          ? locales.map((locale) => urlNode(url.origin, route, locale, entry))
          : []
      }),
    },
  })

  const headers = {
    'Cache-Control': 'max-age=0, s-maxage=3600',
    'Content-Type': 'application/xml; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
  }

  return new Response(
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>',
      body,
    ].join('\n'),
    { headers },
  )
}
