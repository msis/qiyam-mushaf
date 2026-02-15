<script lang="ts">
  interface Props {
    surahName: string;
    surahNumber: number;
    verseNumber: number;
    onclick: () => void;
    title?: string;
  }

  let {
    surahName,
    surahNumber,
    verseNumber,
    onclick,
    title = 'Navigate to verse',
  }: Props = $props();
</script>

<button
  {onclick}
  class="bg-amber-600 hover:bg-amber-700 px-3 py-2 rounded-lg shadow-lg transition-colors cursor-pointer"
  {title}
>
  <span class="text-amber-100 text-sm font-medium">
    {surahName} ({surahNumber}:{verseNumber})
  </span>
</button>
