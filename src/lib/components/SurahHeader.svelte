<script lang="ts">
  import type { Surah } from '$lib/types';

  interface Props {
    surah: Surah;
  }

  let { surah }: Props = $props();
</script>

<div class="text-center py-8 mb-4">
  <h1 class="text-4xl font-bold text-amber-100 mb-2 font-arabic">
    سورة {surah.name}
  </h1>
  <p class="text-amber-200 text-lg">{surah.nameEn}</p>
  <p class="text-gray-400 text-sm mt-1">{surah.verseCount} verses</p>
</div>
