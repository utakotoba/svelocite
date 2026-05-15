<script lang="ts">
  import 'virtual:uno.css' // TODO validate WebKit (Safari compatibility)
  import favicon from '$lib/assets/favicon.svg'
  import HreflangHead from '$lib/components/HreflangHead.svelte'

  let { children } = $props()
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<HreflangHead />

{@render children()}
