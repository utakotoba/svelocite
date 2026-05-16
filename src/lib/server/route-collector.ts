import picomatch from 'picomatch'

// MARK: - types

type RouteModule<
  TExport = never,
  TExportName extends string = string,
> = Partial<Record<TExportName, TExport>>

export interface CollectRoutesOptions<TExportName extends string = string> {
  /** Patterns to exclude. */
  excludePatterns?: string[]

  /** Named export to read from matching server modules. */
  exportName?: TExportName

  /** Include dynamic routes like `/posts/[slug]`. */
  includeDynamic?: boolean
}

export interface CollectedRoute<
  TExport = never,
  TExportName extends string = string,
> {
  /** Value of the requested named export, if found. */
  exported?: TExport

  /** Matching `+layout.server.{js,ts}` modules, root-first. */
  layouts: Array<RouteModule<TExport, TExportName>>

  /** Eagerly imported `+page.svelte` module. */
  page: RouteModule

  /** Matching `+page.server.{js,ts}` module, if present. */
  pageServer?: RouteModule<TExport, TExportName>

  /** SvelteKit route path, normalized to `/` for the root page. */
  route: string
}

const pageModules = import.meta.glob('/src/routes/**/+page.svelte', {
  eager: true,
  import: '*',
})

const serverModules = import.meta.glob(
  [
    '/src/routes/**/+page.server.js',
    '/src/routes/**/+page.server.ts',
    '/src/routes/**/+layout.server.js',
    '/src/routes/**/+layout.server.ts',
  ],
  {
    eager: true,
    import: '*',
  },
)

const layoutModules = collectServerModules('+layout.server')
const pageServerModules = collectServerModules('+page.server')

// MARK: - helpers

function getRoute(path: string): string {
  const route =
    path
      .replace('/src/routes', '')
      .replace(/\/\+(page|layout)(\.server)?\.(js|svelte|ts)$/, '')
      .split('/')
      .filter(Boolean)
      .filter((segment) => !/^\(.+\)$/.test(segment))
      .join('/') || ''

  return route ? `/${route}` : '/'
}

function isDynamicRoute(route: string): boolean {
  return route.split('/').some((segment) => segment.includes('['))
}

function collectServerModules(file: string): Map<string, object[]> {
  const result = new Map<string, object[]>()

  for (const [path, module] of Object.entries(serverModules)) {
    if (!path.includes(file)) continue

    const route = getRoute(path)
    const modules = result.get(route) ?? []
    modules.push(module as object)
    result.set(route, modules)
  }

  return result
}

function createRouteFilter(
  excludePatterns: string[],
  includeDynamic: boolean,
): (route: string) => boolean {
  const isExcluded = picomatch(excludePatterns, {
    dot: true,
    strictSlashes: true,
  })

  return (route) =>
    !isExcluded(route) && (includeDynamic || !isDynamicRoute(route))
}

function matchingLayouts<TExport, TExportName extends string>(
  route: string,
): Array<RouteModule<TExport, TExportName>> {
  const segments = route.split('/').filter(Boolean)
  const routes = [
    '/',
    ...segments.map((_, index) => `/${segments.slice(0, index + 1).join('/')}`),
  ]

  return routes.flatMap((route) => {
    return (layoutModules.get(route) ?? []) as Array<
      RouteModule<TExport, TExportName>
    >
  })
}

function matchingPageServer<TExport, TExportName extends string>(
  route: string,
): RouteModule<TExport, TExportName> | undefined {
  return pageServerModules.get(route)?.at(-1) as
    | RouteModule<TExport, TExportName>
    | undefined
}

function collectExport<TExport, TExportName extends string>(
  modules: Array<RouteModule<TExport, TExportName>>,
  exportName?: TExportName,
): TExport | undefined {
  if (!exportName) return undefined
  for (const module of modules) {
    const exported = module[exportName]
    if (exported !== undefined) return exported
  }
  return undefined
}

// MARK: - exports

/**
 * Collect SvelteKit page routes with attached server modules and a named
 * export.
 *
 * @param opt Options to change collecting behavior
 * @returns Collected route records sorted by route path
 */
export function collectRoutes<
  TExport = never,
  TExportName extends string = string,
>(
  opt: CollectRoutesOptions<TExportName> = {},
): Array<CollectedRoute<TExport, TExportName>> {
  const { excludePatterns = [], exportName, includeDynamic = false } = opt
  const includeRoute = createRouteFilter(excludePatterns, includeDynamic)

  return Object.entries(pageModules)
    .map(([path, page]) => {
      const route = getRoute(path)
      const layouts = matchingLayouts<TExport, TExportName>(route)
      const pageServer = matchingPageServer<TExport, TExportName>(route)
      const modules = [...layouts, ...(pageServer ? [pageServer] : [])]

      return {
        exported: collectExport(modules, exportName),
        layouts,
        page: page as RouteModule,
        pageServer,
        route,
      }
    })
    .filter(({ route }) => includeRoute(route))
    .sort((a, b) => a.route.localeCompare(b.route))
}
