<script lang="ts">
	import type { GlobalVerseKey } from '$lib/types';

	interface Props {
		verseKey: GlobalVerseKey;
		isBookmarked: boolean;
		onToggle: () => void;
	}

	let { verseKey, isBookmarked, onToggle }: Props = $props();
</script>

<button
	onclick={onToggle}
	class="bg-gray-800 hover:bg-gray-700 p-2 rounded-full shadow-lg transition-colors"
	title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
	aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
>
	<svg
		class="w-5 h-5 {isBookmarked ? 'text-amber-500 fill-amber-500' : 'text-gray-400'}"
		fill={isBookmarked ? 'currentColor' : 'none'}
		stroke="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
		/>
	</svg>
</button>
