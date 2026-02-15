<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SurahHeader from '$lib/components/SurahHeader.svelte';
  import { mockAlFatihah, mockAlBaqara, mockYaSin } from '$lib/stories/mocks';

  const { Story } = defineMeta({
    title: 'Components/SurahHeader',
    component: SurahHeader,
  });
</script>

<Story
  name="Al-Fatiha"
  args={{ surah: mockAlFatihah }}
/>

<Story
  name="Al-Baqara"
  args={{ surah: mockAlBaqara }}
/>

<Story
  name="Ya-Sin"
  args={{ surah: mockYaSin }}
/>
