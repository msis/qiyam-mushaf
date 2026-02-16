<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BookmarkEmpty from '$lib/components/BookmarkEmpty.svelte';

  const { Story } = defineMeta({
    title: 'Components/BookmarkEmpty',
    component: BookmarkEmpty,
  });
</script>

<Story name="Default" />
