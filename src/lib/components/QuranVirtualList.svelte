<script lang="ts">
	import VirtualScroll from 'svelte-virtual-scroll-list';
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

	let virtualScroll: VirtualScroll;

	export function scrollToIndex(index: number): void {
		if (virtualScroll) {
			virtualScroll.scrollToIndex(index);
		}
	}
</script>

<div class="virtual-container">
	<VirtualScroll
		bind:this={virtualScroll}
		data={items}
		key="index"
		keeps={30}
		estimateSize={100}
		let:data={item}
	>
		<div class="max-w-3xl mx-auto px-4 py-2">
			{#if item.type === 'surah-header' && item.surahData}
				<SurahHeader surah={item.surahData} />
			{:else if item.type === 'bismillah'}
				<Bismillah />
			{:else if item.type === 'verse' && item.verse && item.verseKey}
				<VerseRow
					verse={item.verse}
					verseKey={item.verseKey}
					surahNumber={item.surahNumber}
					isCurrentVerse={currentVerseKey === item.verseKey}
					highlightedWordIndices={highlightedWords[item.verseKey]}
				/>
			{/if}
		</div>
	</VirtualScroll>
</div>

<style>
	.virtual-container {
		height: 100%;
		width: 100%;
		overflow: hidden;
	}

	.virtual-container :global(.virtual-scroll-wrapper) {
		height: 100% !important;
		padding-top: 70px;
		padding-bottom: 90px;
	}
</style>
