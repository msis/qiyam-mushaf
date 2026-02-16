<script lang="ts">
  import { fade } from 'svelte/transition';

  interface Props {
    message: string;
  }

  let { message }: Props = $props();
</script>

<div
  transition:fade={{ duration: 200 }}
  role="alert"
  class="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 bg-red-900/90 text-red-100 text-sm px-4 py-2 rounded-lg shadow-lg"
>
  {message}
</div>
