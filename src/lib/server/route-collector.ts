import picomatch from 'picomatch'

// MARK: - types

interface CollectOptions {
  /** Name of the named export to collect. */
  exportName: string

  /** Whether to collect from `+layout.server.ts` file. */
  includeLayouts?: boolean

  /** Patterns to exclude. */
  excludePatterns?: string[]
}

// MARK: - helpers

function getRoute(path: string): string {
  return (
    path
      .replace('/src/routes', '')
      .replace(/\/\+(page|layout)\.server\.ts$/, '')
      .replace(/\/$/, '') || '/'
  )
}

// MARK: - exports

/**
 * Collect `+{page, layout}.server.ts` named export for extensibility.
 *
 * @param opt Options to change collecting behavior
 * @returns Route-Exported {@link Map}
 */
export function collectRouteExports<T = any>(
  opt: CollectOptions,
): Map<string, T> {
  const { exportName, includeLayouts = false, excludePatterns = [] } = opt

  const isExcluded = picomatch(excludePatterns, {
    dot: true,
    strictSlashes: true,
  })

  const result = new Map<string, T>()

  const candidates = import.meta.glob(
    ['/src/routes/**/+page.server.ts', '/src/routes/**/+layout.server.ts'],
    {
      eager: true,
      import: '*',
    },
  )

  for (const [path, module] of Object.entries(candidates)) {
    const isLayout = path.includes('+layout.server.ts')
    if (isLayout && !includeLayouts) continue

    const exported = (module as any)?.[exportName]

    const route = getRoute(path)
    if (isExcluded(route)) continue

    if (exported && typeof exported === 'object' && exported !== null) {
      result.set(route, exported as T)
    }
  }

  return result
}
