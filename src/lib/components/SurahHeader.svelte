<script lang="ts">
  import type { Surah } from '$lib/types';
  import { t } from '$lib/i18n';

  interface Props {
    surah: Surah;
  }

  let { surah }: Props = $props();
</script>

<div class="text-center py-4">
  <h1 class="text-4xl font-bold text-amber-100 mb-2 font-arabic" dir="rtl">
    سورة {surah.name}
  </h1>
  <p class="text-amber-200 text-lg">{surah.nameEn}</p>
  <p class="text-gray-400 text-sm mt-1">{t('surah.verses', { count: surah.verseCount })}</p>
</div>
