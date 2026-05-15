<script lang="ts">
  import { page } from '$app/state'
  import { baseLocale, locales, localizeHref } from '$lib/paraglide/runtime'

  const { origin, pathname } = $derived(page.url)

  const canonical = $derived(
    origin + localizeHref(pathname, { locale: baseLocale }),
  )

  const alternates = $derived(
    locales.map((locale) => ({
      hreflang: locale,
      href: origin + localizeHref(pathname, { locale }),
    })),
  )
</script>

<svelte:head>
  <link rel="canonical" href={canonical} />

  <link rel="alternate" hreflang="x-default" href={canonical} />

  {#each alternates as alt}
    <link rel="alternate" hreflang={alt.hreflang} href={alt.href} />
  {/each}
</svelte:head>
