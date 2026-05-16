import type { RequestHandler } from '@sveltejs/kit'

// MARK: - get handler

export const GET: RequestHandler = async ({ url }) => {
  const headers = {
    'Content-Type': 'text/plain',
  }

  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${url.origin}/sitemap.xml`,
  ]

  return new Response(body.join('\n').trim(), { headers })
}
