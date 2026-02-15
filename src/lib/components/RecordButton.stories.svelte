<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import RecordButton from '$lib/components/RecordButton.svelte';

  const { Story } = defineMeta({
    title: 'Components/RecordButton',
    component: RecordButton,
  });
</script>

<Story
  name="Idle"
  args={{
    isListening: false,
    onclick: () => console.log('Record toggled'),
  }}
/>

<Story
  name="Recording"
  args={{
    isListening: true,
    onclick: () => console.log('Record toggled'),
  }}
/>
