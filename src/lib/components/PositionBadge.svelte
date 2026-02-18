<script lang="ts">
  import { t } from '$lib/i18n';

  interface Props {
    surahName: string;
    surahNumber: number;
    verseNumber: number;
    onclick: () => void;
  }

  let {
    surahName,
    surahNumber,
    verseNumber,
    onclick,
  }: Props = $props();
</script>

<button
  {onclick}
  class="bg-amber-600 hover:bg-amber-700 px-3 py-2 rounded-lg shadow-lg transition-colors cursor-pointer"
  title={t('nav.navigateToVerse')}
>
  <span class="text-amber-100 text-sm font-medium">
    {surahName} ({surahNumber}:{verseNumber})
  </span>
</button>
