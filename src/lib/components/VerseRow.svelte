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
	class="px-4 py-1 rounded-lg transition-all duration-300 {isCurrentVerse
		? 'bg-amber-100 text-gray-900 shadow-xl'
		: 'text-gray-400'}"
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
