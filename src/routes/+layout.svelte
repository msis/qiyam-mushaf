<script lang="ts">
  import '../app.css';
  import { t } from '$lib/i18n';

  let { children } = $props();
</script>

<svelte:head>
  <title>{t('app.title')}</title>
  <meta name="description" content={t('app.description')} />
</svelte:head>

{@render children()}
