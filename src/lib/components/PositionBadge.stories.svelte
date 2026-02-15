<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PositionBadge from '$lib/components/PositionBadge.svelte';

  const { Story } = defineMeta({
    title: 'Components/PositionBadge',
    component: PositionBadge,
  });
</script>

<Story
  name="Al-Fatiha Verse 1"
  args={{
    surahName: 'Al-Fatiha',
    surahNumber: 1,
    verseNumber: 1,
    onclick: () => console.log('Position clicked'),
  }}
/>

<Story
  name="Al-Baqara Verse 255"
  args={{
    surahName: 'Al-Baqara',
    surahNumber: 2,
    verseNumber: 255,
    onclick: () => console.log('Position clicked'),
  }}
/>

<Story
  name="Ya-Sin Verse 50"
  args={{
    surahName: 'Ya-Sin',
    surahNumber: 36,
    verseNumber: 50,
    onclick: () => console.log('Position clicked'),
  }}
/>
