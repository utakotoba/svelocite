import type { Handle } from '@sveltejs/kit'
import { paraglideMiddleware } from '$lib/paraglide/server'
import { getTextDirection } from '$lib/paraglide/runtime'

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

export const handle = paraglide
