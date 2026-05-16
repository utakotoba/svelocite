// MARK: - types

type ChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never'

/** Per-route configuration for sitemap generation. */
export interface SitemapEntry {
  /** Expected cadence for content changes on this route. */
  changefreq?: ChangeFrequency

  /** Last meaningful content update for this route. */
  lastmod?: Date | string

  /** Relative route importance from `0.0` to `1.0`. */
  priority?: number
}

// MARK: - helpers

/**
 * Type helper to create {@link SitemapEntry} object.
 *
 * @param cfg Valid config of {@link SitemapEntry}
 * @returns The provided sitemap config
 */
export function defineSitemapEntry(cfg: SitemapEntry): SitemapEntry {
  return cfg
}
