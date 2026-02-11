<script lang="ts">
	import { VList, type VListHandle } from 'virtua/svelte';
	import type { RenderableItem, GlobalVerseKey } from '$lib/types';
	import Bismillah from './Bismillah.svelte';
	import SurahHeader from './SurahHeader.svelte';
	import VerseRow from './VerseRow.svelte';

	interface Props {
		items: RenderableItem[];
		currentVerseKey: GlobalVerseKey | null;
		nextWordIndex: number;
		onVerseClick?: (surahNumber: number, verseNumber: number) => void;
	}

	let { items, currentVerseKey, nextWordIndex, onVerseClick }: Props = $props();

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
				{@const isActive = currentVerseKey === item.verseKey}
				{@const offset = item.verse.words[0]?.globalIndex ?? 0}
				<VerseRow
					verse={item.verse}
					verseKey={item.verseKey}
					surahNumber={item.surahNumber}
					isCurrentVerse={isActive}
					highlightedCount={isActive ? Math.max(0, Math.min(item.verse.words.length, nextWordIndex - offset)) : 0}
					onclick={onVerseClick}
				/>
			{/if}
		</div>
	{/snippet}
</VList>
