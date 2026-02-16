<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BookmarkButton from '$lib/components/BookmarkButton.svelte';

  const { Story } = defineMeta({
    title: 'Components/BookmarkButton',
    component: BookmarkButton,
  });
</script>

<Story
  name="Not Bookmarked"
  args={{
    verseKey: '2:255',
    isBookmarked: false,
    onToggle: () => console.log('Toggle bookmark'),
  }}
/>

<Story
  name="Bookmarked"
  args={{
    verseKey: '2:255',
    isBookmarked: true,
    onToggle: () => console.log('Toggle bookmark'),
  }}
/>
