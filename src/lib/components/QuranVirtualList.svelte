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
	}

	let { items, currentVerseKey, highlightedWords }: Props = $props();

	// Scroll container element
	let scrollElement: HTMLDivElement | undefined = $state();

	// Build data array with spacers
	type DataItem = { type: 'spacer'; height: number } | RenderableItem;

	const data = $derived.by((): DataItem[] => {
		const result: DataItem[] = [{ type: 'spacer', height: 70 }];
		result.push(...items);
		result.push({ type: 'spacer', height: 100 });
		return result;
	});

	// Gap between items (in pixels)
	const ITEM_GAP = 8;

	// Create virtualizer with dynamic measurement
	const virtualizer = createVirtualizer({
		get count() {
			return data.length;
		},
		getScrollElement: () => scrollElement ?? null,
		estimateSize: () => 100,
		overscan: 5,
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
		$virtualizer.scrollToIndex(index + 1, { align: 'start' });
	}
</script>

<div bind:this={scrollElement} class="virtual-container">
	{#if scrollElement}
		<div
			style="height: {$virtualizer.getTotalSize()}px; width: 100%; position: relative;"
		>
			{#each $virtualizer.getVirtualItems() as virtualRow (virtualRow.key)}
				{@const item = data[virtualRow.index]}
				{#if item}
					<div
						use:measureElement
						data-index={virtualRow.index}
						style="
							position: absolute;
							top: 0;
							left: 0;
							width: 100%;
							transform: translateY({virtualRow.start}px);
						"
					>
						{#if item.type === 'spacer'}
							<div style="height: {item.height}px;"></div>
						{:else if item.type === 'surah-header' && item.surahData}
							<div class="max-w-3xl mx-auto px-4 pb-{ITEM_GAP}">
								<SurahHeader surah={item.surahData} />
							</div>
						{:else if item.type === 'bismillah'}
							<div class="max-w-3xl mx-auto px-4 pb-{ITEM_GAP}">
								<Bismillah />
							</div>
						{:else if item.type === 'verse' && item.verse && item.verseKey}
							<div class="max-w-3xl mx-auto px-4" style="padding-bottom: {ITEM_GAP}px;">
								<VerseRow
									verse={item.verse}
									verseKey={item.verseKey}
									surahNumber={item.surahNumber}
									isCurrentVerse={currentVerseKey === item.verseKey}
									highlightedWordIndices={highlightedWords[item.verseKey]}
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
