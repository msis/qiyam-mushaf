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
		onVerseClick?: (surahNumber: number, verseNumber: number) => void;
	}

	let { items, currentVerseKey, highlightedWords, onVerseClick }: Props = $props();

	const ITEM_GAP = 8;

	let vlist: VListHandle | undefined = $state();

	export function scrollToIndex(index: number): void {
		vlist?.scrollToIndex(index, { align: 'center' });
	}
</script>

<VList
	bind:this={vlist}
	data={items}
	style="height: 100%;"
	getKey={(item) => item.index}
>
	{#snippet children(item, index)}
		<div
			class="max-w-3xl mx-auto px-4"
			style="padding-bottom: {index === items.length - 1 ? 100 : ITEM_GAP}px;{index === 0 ? ' padding-top: 70px;' : ''}"
		>
			{#if item.type === 'surah-header'}
				<SurahHeader surah={item.surahData} />
			{:else if item.type === 'bismillah'}
				<Bismillah />
			{:else if item.type === 'verse'}
				<VerseRow
					verse={item.verse}
					verseKey={item.verseKey}
					surahNumber={item.surahNumber}
					isCurrentVerse={currentVerseKey === item.verseKey}
					highlightedWordIndices={highlightedWords[item.verseKey]}
					onclick={onVerseClick}
				/>
			{/if}
		</div>
	{/snippet}
</VList>
