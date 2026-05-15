import type { Reroute } from '@sveltejs/kit'
import { baseLocale, deLocalizeUrl } from '$lib/paraglide/runtime'

export const reroute: Reroute = ({ url }) => {
  const prefix = url.pathname.split('/').filter(Boolean)[0]

  // block base locale prefix access manually
  if (prefix?.toLowerCase() === baseLocale.toLowerCase()) {
    return url.pathname
  }

  return deLocalizeUrl(url).pathname
}
