<script lang="ts">
	import type { Verse, GlobalVerseKey } from '$lib/types';

	interface Props {
		verse: Verse;
		verseKey: GlobalVerseKey;
		surahNumber: number;
		isCurrentVerse: boolean;
		highlightedCount: number;
		onclick?: (surahNumber: number, verseNumber: number) => void;
	}

	let { verse, verseKey, surahNumber, isCurrentVerse, highlightedCount, onclick }: Props = $props();

	const uthmaniWords = $derived(verse.uthmani.trim().split(/\s+/));

	// Convert contiguous simple-word count → uthmani index set for highlighting
	const highlightedUthmaniSet = $derived.by(() => {
		if (highlightedCount <= 0) return undefined;
		const set = new Set<number>();
		for (let i = 0; i < highlightedCount; i++) {
			const word = verse.words[i];
			if (word) set.add(word.uthmaniIndex);
		}
		return set;
	});

	function handleClick() {
		onclick?.(surahNumber, verse.number);
	}
</script>

<div
	data-verse-key={verseKey}
	class="px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer {isCurrentVerse
		? 'bg-amber-100 text-gray-900 shadow-xl'
		: 'text-gray-400 hover:bg-gray-800/50'}"
	onclick={handleClick}
	onkeydown={(e) => e.key === 'Enter' && handleClick()}
	role="button"
	tabindex="0"
>
	<p class="text-2xl leading-relaxed font-arabic text-center" dir="rtl">
		<span
			class="inline-block text-sm font-bold px-1.5 py-0.5 rounded ml-2 align-middle {isCurrentVerse
				? 'bg-amber-600 text-white'
				: 'bg-gray-700 text-gray-400'}"
		>
			{surahNumber}:{verse.number}
		</span>
		{#each uthmaniWords as uthmaniWord, uIdx (uIdx)}
			{@const isHighlighted = highlightedUthmaniSet?.has(uIdx)}
			<span
				class="inline-block px-1 mx-0.5 rounded transition-all duration-200 {isHighlighted
					? 'bg-amber-500 text-white font-bold scale-110'
					: ''}"
			>
				{uthmaniWord}
			</span>
		{/each}
	</p>
</div>
