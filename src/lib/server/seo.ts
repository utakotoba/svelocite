// MARK: - types

type ChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never'

/** Route-level sitemap metadata. */
export interface SitemapOptions {
  /** Expected cadence for content changes on this route. */
  changefreq?: ChangeFrequency

  /** Last meaningful content update for this route. */
  lastmod?: Date | string

  /** Relative route importance from `0.0` to `1.0`. */
  priority?: number
}

/** Route-level SEO configuration shared by sitemap, headers, and robots. */
export interface SeoOptions {
  /** Whether crawlers may fetch this route. Defaults to `true`. */
  crawl?: boolean

  /** Whether this route may be indexed. Defaults to `true`. */
  index?: boolean

  /** Sitemap metadata, or `false` to exclude this route from sitemap. */
  sitemap?: false | SitemapOptions
}

// MARK: - constants

export const SEO_EXPORT_NAME = '_seo'

// MARK: - helpers

/**
 * Type helper to create route-level SEO config.
 *
 * @param opt Valid SEO config
 * @returns The provided SEO config
 */
export function defineSeo(opt: SeoOptions): SeoOptions {
  return opt
}

/**
 * Resolve whether a route should be indexed.
 *
 * @param opt Route-level SEO config
 * @returns `false` only when indexing is explicitly disabled
 */
export function isIndexable(opt?: SeoOptions): boolean {
  return opt?.index !== false
}

/**
 * Resolve whether a route may be crawled.
 *
 * @param opt Route-level SEO config
 * @returns `false` only when crawling is explicitly disabled
 */
export function isCrawlable(opt?: SeoOptions): boolean {
  return opt?.crawl !== false
}

/**
 * Resolve sitemap metadata for a route.
 *
 * @param opt Route-level SEO config
 * @returns Sitemap metadata, or `undefined` when excluded
 */
export function getSitemapOptions(
  opt?: SeoOptions,
): SitemapOptions | undefined {
  if (!isCrawlable(opt) || !isIndexable(opt) || opt?.sitemap === false) {
    return undefined
  }

  return opt?.sitemap ?? {}
}
