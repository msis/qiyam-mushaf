<script lang="ts">
  import '../app.css';

  let { children } = $props();
</script>

<svelte:head>
  <title>Qiyam Mushaf - Quran Reader with Speech Recognition</title>
</svelte:head>

{@render children()}
