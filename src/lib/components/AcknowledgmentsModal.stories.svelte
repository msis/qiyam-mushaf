<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import AcknowledgmentsModal from '$lib/components/AcknowledgmentsModal.svelte';

  const { Story } = defineMeta({
    title: 'Components/AcknowledgmentsModal',
    component: AcknowledgmentsModal,
  });
</script>

<Story
  name="Default"
  args={{
    onClose: () => console.log('close'),
  }}
/>
