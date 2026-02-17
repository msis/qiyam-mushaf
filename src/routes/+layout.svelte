<script lang="ts">
  import '../app.css';

  let { children } = $props();
</script>

<svelte:head>
  <title>Qiyam Mushaf</title>
  <meta name="description" content="Read the Mushaf with speech-recognition highlighting during your qiyam" />
</svelte:head>

{@render children()}
