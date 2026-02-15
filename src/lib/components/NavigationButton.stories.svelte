<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import NavigationButton from '$lib/components/NavigationButton.svelte';

  const { Story } = defineMeta({
    title: 'Components/NavigationButton',
    component: NavigationButton,
  });
</script>

<Story
  name="Default"
  args={{
    onclick: () => console.log('Navigation clicked'),
  }}
/>

<Story
  name="Custom Title"
  args={{
    onclick: () => console.log('Navigation clicked'),
    title: 'Navigate to surah',
  }}
/>
