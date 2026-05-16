import type { SitemapConfig } from 'super-sitemap'

// MARK: - types

type PathObj = ReturnType<
  Exclude<SitemapConfig['processPaths'], undefined>
>[number]

/**
 * Per-route configuration of sitemap in generation.
 *
 * Slice of {@link PathObj} in `super-sitemap` package
 */
export type SitemapEntry = Omit<PathObj, 'path' | 'lastmod' | 'alternates'> & {
  // allow built-in `Date` for convince
  lastmod?: Date | string
}

// MARK: - helpers

/**
 * Type helper to create {@link SitemapEntry} object.
 *
 * @param cfg Valid config of {@link SitemapEntry}
 */
export function defineSitemapEntry(cfg: SitemapEntry): SitemapEntry {
  return cfg
}
