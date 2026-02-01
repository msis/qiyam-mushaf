<script lang="ts">
	import type { Verse, GlobalVerseKey } from '$lib/types';

	interface Props {
		verse: Verse;
		verseKey: GlobalVerseKey;
		surahNumber: number;
		isCurrentVerse: boolean;
		highlightedWordIndices?: Set<number>;
	}

	let { verse, verseKey, surahNumber, isCurrentVerse, highlightedWordIndices }: Props = $props();
</script>

<div
	data-verse-key={verseKey}
	class="p-4 my-2 rounded-lg transition-all duration-300 {isCurrentVerse
		? 'bg-amber-100 text-gray-900 shadow-xl'
		: 'text-gray-400'}"
>
	<!-- Verse number badge -->
	<div class="flex justify-center mb-2">
		<span
			class="text-xs font-bold px-2 py-1 rounded {isCurrentVerse
				? 'bg-amber-600 text-white'
				: 'bg-gray-700 text-gray-400'}"
		>
			{surahNumber}:{verse.number}
		</span>
	</div>

	<!-- Arabic text - centered, RTL -->
	<p class="text-2xl leading-loose font-arabic text-center" dir="rtl">
		{#each verse.words as word, wordIndex (wordIndex)}
			{@const isHighlighted = highlightedWordIndices?.has(wordIndex)}
			<span
				class="inline-block px-1 mx-0.5 rounded transition-all duration-200 {isHighlighted
					? 'bg-amber-500 text-white font-bold scale-110'
					: ''}"
			>
				{word.uthmani}
			</span>
		{/each}
	</p>
</div>
