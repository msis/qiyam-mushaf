<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BookmarkModal from '$lib/components/BookmarkModal.svelte';

  const { Story } = defineMeta({
    title: 'Components/BookmarkModal',
    component: BookmarkModal,
  });

  const mockSurahs = [
    { number: 1, name: 'الفاتحة', nameEn: 'Al-Fatiha', verses: [], verseCount: 7 },
    { number: 2, name: 'البقرة', nameEn: 'Al-Baqara', verses: [], verseCount: 286 },
    { number: 36, name: 'يس', nameEn: 'Ya-Sin', verses: [], verseCount: 83 },
  ];
</script>

<Story
  name="Empty"
  args={{
    bookmarks: [],
    surahs: mockSurahs,
    onClose: () => console.log('Close'),
    onNavigate: (surah, verse) => console.log('Navigate to', surah, verse),
    onRemove: (key) => console.log('Remove', key),
  }}
/>

<Story
  name="With Bookmarks"
  args={{
    bookmarks: [
      { verseKey: '2:255', createdAt: Date.now() - 3600000 },
      { verseKey: '36:1', createdAt: Date.now() - 7200000 },
      { verseKey: '1:1', createdAt: Date.now() - 10800000 },
    ],
    surahs: mockSurahs,
    onClose: () => console.log('Close'),
    onNavigate: (surah, verse) => console.log('Navigate to', surah, verse),
    onRemove: (key) => console.log('Remove', key),
  }}
/>
