<script lang="ts">
	import { createVirtualizer } from '@tanstack/svelte-virtual';
	import type { RenderableItem, GlobalVerseKey, GlobalHighlightedWords } from '$lib/types';
	import Bismillah from './Bismillah.svelte';
	import SurahHeader from './SurahHeader.svelte';
	import VerseRow from './VerseRow.svelte';

	interface Props {
		items: RenderableItem[];
		currentVerseKey: GlobalVerseKey | null;
		highlightedWords: GlobalHighlightedWords;
		onVerseClick?: (surahNumber: number, verseNumber: number) => void;
	}

	let { items, currentVerseKey, highlightedWords, onVerseClick }: Props = $props();

	// Scroll container element
	let scrollElement: HTMLDivElement | undefined = $state();

	// Gap between items (in pixels)
	const ITEM_GAP = 8;

	// Create virtualizer with dynamic measurement
	const virtualizer = createVirtualizer({
		get count() {
			return items.length;
		},
		getScrollElement: () => scrollElement ?? null,
		estimateSize: () => 200,
		getItemKey: (index: number) => items[index]?.index ?? index,
		overscan: 10,
		paddingStart: 70,
		paddingEnd: 100,
	});

	// Action to measure element - this tells TanStack the real height
	function measureElement(node: HTMLElement) {
		$virtualizer.measureElement(node);
		return {
			destroy() {
				// Cleanup if needed
			}
		};
	}

	export function scrollToIndex(index: number): void {
		$virtualizer.scrollToIndex(index, { align: 'center' });
	}
</script>

<div bind:this={scrollElement} class="virtual-container">
	{#if scrollElement}
		<div
			class="relative w-full"
			style="height: {$virtualizer.getTotalSize()}px;"
		>
			{#each $virtualizer.getVirtualItems() as virtualRow (virtualRow.key)}
				{@const item = items[virtualRow.index]}
				{#if item}
					<div
						use:measureElement
						data-index={virtualRow.index}
						class="absolute top-0 left-0 w-full"
						style="transform: translateY({virtualRow.start}px);"
					>
						{#if item.type === 'surah-header'}
							<div class="max-w-3xl mx-auto px-4" style="padding-bottom: {ITEM_GAP}px;">
								<SurahHeader surah={item.surahData} />
							</div>
						{:else if item.type === 'bismillah'}
							<div class="max-w-3xl mx-auto px-4" style="padding-bottom: {ITEM_GAP}px;">
								<Bismillah />
							</div>
						{:else if item.type === 'verse'}
							<div class="max-w-3xl mx-auto px-4" style="padding-bottom: {ITEM_GAP}px;">
								<VerseRow
									verse={item.verse}
									verseKey={item.verseKey}
									surahNumber={item.surahNumber}
									isCurrentVerse={currentVerseKey === item.verseKey}
									highlightedWordIndices={highlightedWords[item.verseKey]}
									onclick={onVerseClick}
								/>
							</div>
						{/if}
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style>
	.virtual-container {
		height: 100%;
		width: 100%;
		overflow: auto;
	}

	.virtual-container {
		scrollbar-width: thin;
		scrollbar-color: #d97706 #1f2937;
	}

	.virtual-container::-webkit-scrollbar {
		width: 8px;
	}

	.virtual-container::-webkit-scrollbar-track {
		background: #1f2937;
		border-radius: 4px;
	}

	.virtual-container::-webkit-scrollbar-thumb {
		background: #d97706;
		border-radius: 4px;
	}

	.virtual-container::-webkit-scrollbar-thumb:hover {
		background: #b45309;
	}
</style>
