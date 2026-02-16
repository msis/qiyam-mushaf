<script lang="ts">
	import type { Verse, GlobalVerseKey } from '$lib/types';
	interface Props {
		verse: Verse;
		verseKey: GlobalVerseKey;
		surahNumber: number;
		isCurrentVerse: boolean;
		highlightedCount: number;
		isBookmarked?: boolean;
		onclick?: (surahNumber: number, verseNumber: number) => void;
		onToggleVerseBookmark?: (verseKey: GlobalVerseKey) => void;
	}

	let { verse, verseKey, surahNumber, isCurrentVerse, highlightedCount, isBookmarked = false, onclick, onToggleVerseBookmark }: Props = $props();

	const uthmaniWords = $derived(verse.uthmani.trim().split(/\s+/));

	function handleDoubleClick() {
		onToggleVerseBookmark?.(verseKey);
	}

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
	ondblclick={handleDoubleClick}
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
		{#if isBookmarked}
			<span class="inline-block text-amber-500 ml-1" title="Bookmarked">
				<svg class="w-4 h-4 inline" fill="currentColor" viewBox="0 0 24 24">
					<path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
				</svg>
			</span>
		{/if}
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
				class="inline-block px-1 mx-0.5 rounded transition-all duration-200 {isFrontier
					? 'word-frontier'
					: isRead
						? 'word-read'
						: ''}"
			>
				{uthmaniWord}
			</span>
		{/each}
	</p>
</div>
