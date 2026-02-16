<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Bismillah from '$lib/components/Bismillah.svelte';

  const { Story } = defineMeta({
    title: 'Components/Bismillah',
    component: Bismillah,
  });
</script>

<Story name="Default" />
