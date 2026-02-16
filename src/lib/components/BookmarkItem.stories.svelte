<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BookmarkItem from '$lib/components/BookmarkItem.svelte';

  const { Story } = defineMeta({
    title: 'Components/BookmarkItem',
    component: BookmarkItem,
  });

  const mockSurah = { number: 1, name: 'الفاتحة', nameEn: 'Al-Fatiha', verses: [], verseCount: 7 };
</script>

<Story
  name="Default"
  args={{
    bookmark: { verseKey: '1:1' },
    surah: mockSurah,
    verseNumber: 1,
    onNavigate: (key) => console.log('Navigate', key),
    onRemove: (key) => console.log('Remove', key),
  }}
/>

<Story
  name="Long Surah Name"
  args={{
    bookmark: { verseKey: '2:255' },
    surah: { number: 2, name: 'البقرة', nameEn: 'Al-Baqara', verses: [], verseCount: 286 },
    verseNumber: 255,
    onNavigate: (key) => console.log('Navigate', key),
    onRemove: (key) => console.log('Remove', key),
  }}
/>
