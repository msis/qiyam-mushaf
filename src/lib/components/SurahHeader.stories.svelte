<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SurahHeader from '$lib/components/SurahHeader.svelte';
  import { mockAlFatihah, createMockSurah } from '$lib/stories/mocks';

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
  args={{ surah: createMockSurah(2, 'البقرة', 'Al-Baqara', 286) }}
/>

<Story
  name="Ya-Sin"
  args={{ surah: createMockSurah(36, 'يس', 'Ya-Sin', 83) }}
/>
