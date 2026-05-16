import { getTextDirection } from '$lib/paraglide/runtime'
import { paraglideMiddleware } from '$lib/paraglide/server'
import { collectRoutes } from '$lib/server/route-collector'
import { isIndexable, SEO_EXPORT_NAME, type SeoOptions } from '$lib/server/seo'
import type { Handle } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'

const seoOpts = new Map(
  collectRoutes<SeoOptions>({
    exportName: SEO_EXPORT_NAME,
  }).map(({ exported, route }) => [route, exported]),
)

const seo: Handle = async ({ event, resolve }) => {
  const response = await resolve(event)
  const cfg = event.route.id ? seoOpts.get(event.route.id) : undefined

  if (!isIndexable(cfg)) response.headers.set('X-Robots-Tag', 'noindex')

  return response
}

const paraglide: Handle = ({ event, resolve }) =>
  paraglideMiddleware(event.request, ({ request: localized, locale }) => {
    event.request = localized
    return resolve(event, {
      transformPageChunk: ({ html }) => {
        return html
          .replace('%lang%', locale)
          .replace('%dir%', getTextDirection(locale))
      },
    })
  })

export const handle = sequence(seo, paraglide)
