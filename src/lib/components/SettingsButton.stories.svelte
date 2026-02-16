<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SettingsButton from '$lib/components/SettingsButton.svelte';

  const { Story } = defineMeta({
    title: 'Components/SettingsButton',
    component: SettingsButton,
  });
</script>

<Story
  name="Default"
  args={{
    onclick: () => console.log('Settings clicked'),
  }}
/>

<Story
  name="Custom Title"
  args={{
    onclick: () => console.log('Settings clicked'),
    title: 'Open settings',
  }}
/>
