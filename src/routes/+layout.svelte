<script lang="ts">
  import 'virtual:uno.css' // TODO validate WebKit (Safari compatibility)
  import HreflangHead from '$lib/components/HreflangHead.svelte'
  import favicon from '$lib/assets/favicon.svg'

  let { children } = $props()
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<HreflangHead />

{@render children()}
