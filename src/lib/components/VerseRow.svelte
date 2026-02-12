<script lang="ts">
	import type { Verse, GlobalVerseKey } from '$lib/types';
	import { SvelteSet } from 'svelte/reactivity';

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
		const set = new SvelteSet<number>();
		for (let i = 0; i < highlightedCount; i++) {
			const word = verse.words[i];
			if (word) set.add(word.uthmaniIndex);
		}
		return set;
	});

	// The frontier uthmani index — the reading position (last highlighted token)
	const frontierUthmaniIdx = $derived(
		highlightedCount > 0 ? (verse.words[highlightedCount - 1]?.uthmaniIndex ?? -1) : -1
	);

	function handleClick() {
		onclick?.(surahNumber, verse.number);
	}
</script>

<div
	data-verse-key={verseKey}
	class="px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer {isCurrentVerse
		? 'bg-gray-800/60 text-amber-50'
		: 'text-gray-400 hover:bg-gray-800/50'}"
	onclick={handleClick}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			if (e.key === ' ') e.preventDefault();
			handleClick();
		}
	}}
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
			{@const isFrontier = uIdx === frontierUthmaniIdx}
			{@const isRead = !isFrontier && (highlightedUthmaniSet?.has(uIdx) ?? false)}
			<span
				class="inline-block px-1 mx-0.5 rounded transition-all duration-200"
				style={isFrontier
					? 'text-shadow: 0 0 10px rgba(251,191,36,0.9), 0 0 25px rgba(251,191,36,0.5), 0 0 45px rgba(251,191,36,0.2); background: linear-gradient(180deg, transparent 10%, rgba(251,191,36,0.15) 45%, rgba(251,191,36,0.15) 55%, transparent 90%);'
					: isRead
						? 'opacity: 0.3;'
						: ''}
			>
				{uthmaniWord}
			</span>
		{/each}
	</p>
</div>
