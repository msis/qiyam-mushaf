<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import type { Verse, GlobalVerseKey } from '$lib/types';

	interface Props {
		verse: Verse;
		verseKey: GlobalVerseKey;
		surahNumber: number;
		isCurrentVerse: boolean;
		highlightedWordIndices?: Set<number>;
		onclick?: (surahNumber: number, verseNumber: number) => void;
	}

	let { verse, verseKey, surahNumber, isCurrentVerse, highlightedWordIndices, onclick }: Props = $props();

	const uthmaniWords = $derived(verse.uthmani.trim().split(/\s+/));

	// Convert simple-word indices → uthmani-word indices for highlighting
	const highlightedUthmaniSet = $derived.by(() => {
		if (!highlightedWordIndices) return undefined;
		const set = new SvelteSet<number>();
		for (const simpleIdx of highlightedWordIndices) {
			const word = verse.words[simpleIdx];
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
	<!-- Arabic text - centered, RTL, with verse number on the right -->
	<p class="text-2xl leading-relaxed font-arabic text-center" dir="rtl">
		<!-- Verse number first in markup = right side visually in RTL -->
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
