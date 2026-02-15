<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ErrorToast from '$lib/components/ErrorToast.svelte';

  const { Story } = defineMeta({
    title: 'Components/ErrorToast',
    component: ErrorToast,
  });
</script>

<Story
  name="No Microphone Permission"
  args={{
    message: 'Microphone permission denied. Please allow access to use speech recognition.',
  }}
/>

<Story
  name="Network Error"
  args={{
    message: 'Network error. Please check your connection and try again.',
  }}
/>

<Story
  name="Recognition Not Supported"
  args={{
    message: 'Speech recognition is not supported in this browser.',
  }}
/>
