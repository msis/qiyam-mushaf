<script lang="ts">
  interface Props {
    isListening: boolean;
    onclick: () => void;
  }

  let { isListening, onclick }: Props = $props();

  const title = $derived(isListening ? 'Stop recording' : 'Start recording');
</script>

<button
  {onclick}
  class="p-4 rounded-full shadow-lg transition-all {isListening
    ? 'bg-red-600 hover:bg-red-700 animate-pulse'
    : 'bg-green-600 hover:bg-green-700'} text-white"
  {title}
>
  {#if isListening}
    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="6" y="6" width="12" height="12" stroke-width="2" />
    </svg>
  {:else}
    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
      />
    </svg>
  {/if}
</button>
