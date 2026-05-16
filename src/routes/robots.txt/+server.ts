import { locales, localizeUrl } from '$lib/paraglide/runtime'
import { collectRoutes } from '$lib/server/route-collector'
import { isCrawlable, SEO_EXPORT_NAME, type SeoOptions } from '$lib/server/seo'
import type { RequestHandler } from '@sveltejs/kit'

const routes = collectRoutes<SeoOptions>({
  exportName: SEO_EXPORT_NAME,
})

type Locale = (typeof locales)[number]

function localizedPath(origin: string, route: string, locale: Locale): string {
  const localized = localizeUrl(new URL(route, origin), { locale })

  if (localized.pathname !== '/' && localized.pathname.endsWith('/')) {
    localized.pathname = localized.pathname.slice(0, -1)
  }

  return localized.pathname
}

function disallowedPaths(origin: string): string[] {
  return Array.from(
    new Set(
      routes.flatMap(({ exported, route }) =>
        isCrawlable(exported)
          ? []
          : locales.map((locale) => localizedPath(origin, route, locale)),
      ),
    ),
  ).sort((a, b) => a.localeCompare(b))
}

// MARK: - get handler

export const GET: RequestHandler = async ({ url }) => {
  const headers = {
    'Content-Type': 'text/plain; charset=utf-8',
  }

  const disallow = disallowedPaths(url.origin).map(
    (path) => `Disallow: ${path}`,
  )

  const body = [
    'User-agent: *',
    ...(disallow.length > 0 ? disallow : ['Allow: /']),
    '',
    `Sitemap: ${url.origin}/sitemap.xml`,
  ]

  return new Response(body.join('\n').trim(), { headers })
}
