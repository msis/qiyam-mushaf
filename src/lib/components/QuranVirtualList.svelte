<script lang="ts">
	import { VList, type VListHandle } from 'virtua/svelte';
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

	// Reference to VList for imperative scrolling
	let vlistRef: VListHandle | undefined = $state();

	// Build data array with spacers included
	type DataItem =
		| { type: 'spacer'; height: number }
		| RenderableItem;

	const data = $derived.by((): DataItem[] => {
		const result: DataItem[] = [{ type: 'spacer', height: 70 }]; // Top spacer for fixed header
		result.push(...items);
		result.push({ type: 'spacer', height: 100 }); // Bottom spacer for record button
		return result;
	});

	// Gap between items (in pixels)
	const ITEM_GAP = 8;

	export function scrollToIndex(index: number): void {
		// Offset by 1 to account for top spacer
		vlistRef?.scrollToIndex(index + 1, { align: 'start' });
	}
</script>

<div class="virtual-container">
	<VList bind:this={vlistRef} {data} style="height: 100%;" getKey={(_, i) => i}>
		{#snippet children(item, index)}
			{#if item.type === 'spacer'}
				<!-- Spacer for fixed UI elements -->
				<div style="height: {item.height}px;"></div>
			{:else if item.type === 'surah-header' && item.surahData}
				<div class="max-w-3xl mx-auto px-4" style="margin-bottom: {ITEM_GAP}px;">
					<SurahHeader surah={item.surahData} />
				</div>
			{:else if item.type === 'bismillah'}
				<div class="max-w-3xl mx-auto px-4" style="margin-bottom: {ITEM_GAP}px;">
					<Bismillah />
				</div>
			{:else if item.type === 'verse' && item.verse && item.verseKey}
				<div class="max-w-3xl mx-auto px-4" style="margin-bottom: {ITEM_GAP}px;">
					<VerseRow
						verse={item.verse}
						verseKey={item.verseKey}
						surahNumber={item.surahNumber}
						isCurrentVerse={currentVerseKey === item.verseKey}
						highlightedWordIndices={highlightedWords[item.verseKey]}
					/>
				</div>
			{/if}
		{/snippet}
	</VList>
</div>

<style>
	.virtual-container {
		height: 100%;
		width: 100%;
	}

	/* Firefox scrollbar styling */
	.virtual-container :global([data-virtua]) {
		scrollbar-width: thin;
		scrollbar-color: #d97706 #1f2937;
	}

	/* WebKit scrollbar styling (Chrome, Safari, Edge) */
	.virtual-container :global([data-virtua]::-webkit-scrollbar) {
		width: 8px;
	}

	.virtual-container :global([data-virtua]::-webkit-scrollbar-track) {
		background: #1f2937;
		border-radius: 4px;
	}

	.virtual-container :global([data-virtua]::-webkit-scrollbar-thumb) {
		background: #d97706;
		border-radius: 4px;
	}

	.virtual-container :global([data-virtua]::-webkit-scrollbar-thumb:hover) {
		background: #b45309;
	}
</style>
