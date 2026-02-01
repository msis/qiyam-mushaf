<script lang="ts">
	import VirtualList from '@tutorlatin/svelte-tiny-virtual-list';
	import type { RenderableItem, GlobalVerseKey, GlobalHighlightedWords } from '$lib/types';
	import Bismillah from './Bismillah.svelte';
	import SurahHeader from './SurahHeader.svelte';
	import VerseRow from './VerseRow.svelte';

	interface Props {
		items: RenderableItem[];
		currentVerseKey: GlobalVerseKey | null;
		highlightedWords: GlobalHighlightedWords;
	}

	let { items, currentVerseKey, highlightedWords }: Props = $props();

	// Reactive scroll target - library scrolls when this changes
	let scrollTargetIndex = $state(-1);

	// Spacer heights for top (fixed header) and bottom (record button)
	const TOP_SPACER = 70;
	const BOTTOM_SPACER = 100;

	// Calculate height for each item based on its type and content
	// Include spacers at start and end for fixed UI overlays
	const itemHeights = $derived.by(() => {
		const heights: number[] = [TOP_SPACER]; // First item is top spacer

		for (const item of items) {
			if (item.type === 'surah-header') {
				heights.push(100);
			} else if (item.type === 'bismillah') {
				heights.push(70);
			} else {
				// Verse height calculation (compact layout):
				// - VerseRow: px-4 py-1 (8px vertical padding)
				// - Text: text-2xl (24px) with leading-relaxed (~1.625) = ~39px per line
				// - Wrapper: py-2 (16px)
				// - Estimate ~7 words per line on average (inline verse number saves space)
				const wordCount = item.verse?.words.length ?? 0;
				const baseHeight = 32; // Fixed padding (8px + 16px + 8px buffer)
				const linesOfText = Math.ceil((wordCount + 1) / 7); // +1 for inline verse number
				const textHeight = linesOfText * 39;
				heights.push(baseHeight + textHeight);
			}
		}

		heights.push(BOTTOM_SPACER); // Last item is bottom spacer
		return heights;
	});

	// Total item count includes the two spacers
	const totalItemCount = $derived(items.length + 2);

	export function scrollToIndex(index: number): void {
		// Offset by 1 to account for top spacer
		scrollTargetIndex = index + 1;
	}
</script>

<div class="virtual-container">
	<VirtualList
		height="100%"
		width="100%"
		itemCount={totalItemCount}
		itemSize={itemHeights}
		scrollToIndex={scrollTargetIndex}
		scrollToAlignment="start"
	>
		{#snippet item({ style, index })}
			<div {style} class="item-wrapper">
				{#if index === 0}
					<!-- Top spacer for fixed header -->
				{:else if index === totalItemCount - 1}
					<!-- Bottom spacer for record button -->
				{:else}
					{@const currentItem = items[index - 1]}
					<div class="max-w-3xl mx-auto px-4 py-2">
						{#if currentItem.type === 'surah-header' && currentItem.surahData}
							<SurahHeader surah={currentItem.surahData} />
						{:else if currentItem.type === 'bismillah'}
							<Bismillah />
						{:else if currentItem.type === 'verse' && currentItem.verse && currentItem.verseKey}
							<VerseRow
								verse={currentItem.verse}
								verseKey={currentItem.verseKey}
								surahNumber={currentItem.surahNumber}
								isCurrentVerse={currentVerseKey === currentItem.verseKey}
								highlightedWordIndices={highlightedWords[currentItem.verseKey]}
							/>
						{/if}
					</div>
				{/if}
			</div>
		{/snippet}
	</VirtualList>
</div>

<style>
	.virtual-container {
		height: 100%;
		width: 100%;
	}

	/* Firefox scrollbar styling */
	.virtual-container :global(.virtual-list-wrapper) {
		scrollbar-width: thin;
		scrollbar-color: #d97706 #1f2937;
	}

	/* WebKit scrollbar styling (Chrome, Safari, Edge) */
	.virtual-container :global(.virtual-list-wrapper::-webkit-scrollbar) {
		width: 8px;
	}

	.virtual-container :global(.virtual-list-wrapper::-webkit-scrollbar-track) {
		background: #1f2937;
		border-radius: 4px;
	}

	.virtual-container :global(.virtual-list-wrapper::-webkit-scrollbar-thumb) {
		background: #d97706;
		border-radius: 4px;
	}

	.virtual-container :global(.virtual-list-wrapper::-webkit-scrollbar-thumb:hover) {
		background: #b45309;
	}

	.item-wrapper {
		box-sizing: border-box;
	}
</style>
