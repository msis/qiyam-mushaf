<script lang="ts">
  import { t } from '$lib/i18n';

  interface Props {
    onclick: () => void;
  }

  let { onclick }: Props = $props();
</script>

<button
  {onclick}
  class="bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-full shadow-lg transition-colors"
  title={t('nav.openNavigation')}
>
  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
</button>
