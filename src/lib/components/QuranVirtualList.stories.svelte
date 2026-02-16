<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import QuranVirtualList from '$lib/components/QuranVirtualList.svelte';
  import { mockRenderableItems } from '$lib/stories/mocks';

  const { Story } = defineMeta({
    title: 'Components/QuranVirtualList',
    component: QuranVirtualList,
  });
</script>

<Story
  name="Default"
  args={{
    items: mockRenderableItems,
    currentVerseKey: null,
    nextWordIndex: 0,
  }}
/>

<Story
  name="With Current Verse"
  args={{
    items: mockRenderableItems,
    currentVerseKey: '1:1',
    nextWordIndex: 2,
  }}
/>
