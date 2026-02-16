<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SettingsModal from '$lib/components/SettingsModal.svelte';

  const { Story } = defineMeta({
    title: 'Components/SettingsModal',
    component: SettingsModal,
  });
</script>

<Story
  name="Default"
  args={{
    onClose: () => console.log('close'),
    onOpenAcknowledgments: () => console.log('open acknowledgments'),
  }}
/>
