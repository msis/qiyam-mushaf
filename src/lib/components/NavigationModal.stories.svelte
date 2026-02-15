<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import NavigationModal from '$lib/components/NavigationModal.svelte';
  import { SURAH_NAMES } from '$lib/utils/constants';

  const { Story } = defineMeta({
    title: 'Components/NavigationModal',
    component: NavigationModal,
  });

  const mockSurahs = SURAH_NAMES.slice(0, 10).map((s) => ({
    ...s,
    verses: Array.from({ length: s.verseCount }, (_, i) => ({ number: i + 1 })),
  }));
</script>

<Story
  name="Default"
  args={{
    onClose: () => console.log('close'),
    surahs: mockSurahs,
    selectedSurah: 1,
    selectedVerse: 1,
    onNavigate: (surah, verse) => console.log(`Navigate to ${surah}:${verse}`),
  }}
/>

<Story
  name="Selecting Different Surah"
  args={{
    onClose: () => console.log('close'),
    surahs: mockSurahs,
    selectedSurah: 2,
    selectedVerse: 50,
    onNavigate: (surah, verse) => console.log(`Navigate to ${surah}:${verse}`),
  }}
/>
