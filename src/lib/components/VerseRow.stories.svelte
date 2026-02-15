<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import VerseRow from '$lib/components/VerseRow.svelte';
  import { mockVerseAlFatihah1, mockVerseAlKahf17, createMockSurah } from '$lib/stories/mocks';

  const { Story } = defineMeta({
    title: 'Components/VerseRow',
    component: VerseRow,
  });
</script>

<Story
  name="Inactive"
  args={{
    verse: mockVerseAlFatihah1,
    verseKey: '1:1',
    surahNumber: 1,
    isCurrentVerse: false,
    highlightedCount: 0,
  }}
/>

<Story
  name="Current - No Highlights"
  args={{
    verse: mockVerseAlFatihah1,
    verseKey: '1:1',
    surahNumber: 1,
    isCurrentVerse: true,
    highlightedCount: 0,
  }}
/>

<Story
  name="Current - Partial Highlights"
  args={{
    verse: mockVerseAlFatihah1,
    verseKey: '1:1',
    surahNumber: 1,
    isCurrentVerse: true,
    highlightedCount: 2,
  }}
/>

<Story
  name="Current - All Read"
  args={{
    verse: mockVerseAlFatihah1,
    verseKey: '1:1',
    surahNumber: 1,
    isCurrentVerse: true,
    highlightedCount: 4,
  }}
/>

<Story
  name="Long Verse"
  args={{
    verse: mockVerseAlKahf17,
    verseKey: '18:17',
    surahNumber: 18,
    isCurrentVerse: true,
    highlightedCount: 15,
  }}
/>
