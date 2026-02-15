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
	const TOP_PADDING = 70; // clears fixed position badge
	const BOTTOM_PADDING = 100; // clears fixed record button
	const SMOOTH_THRESHOLD = 10; // smooth-scroll if target is within this many items
	const SCROLL_DURATION = 800; // ms for custom smooth scroll

	let vlist: VListHandle | undefined = $state();
	let animationId: number | null = null;

	function easeOutCubic(t: number): number {
		return 1 - (1 - t) ** 3;
	}

	export function scrollToIndex(index: number): void {
		if (!vlist) return;

		// Cancel any in-progress animation
		if (animationId !== null) {
			cancelAnimationFrame(animationId);
			animationId = null;
		}

		const currentIndex = vlist.findItemIndex(vlist.getScrollOffset());

		// Far jump — instant
		if (Math.abs(index - currentIndex) > SMOOTH_THRESHOLD) {
			vlist.scrollToIndex(index, { align: 'center' });
			return;
		}

		// Nearby — custom smooth scroll
		const targetOffset = vlist.getItemOffset(index);
		const itemSize = vlist.getItemSize(index);
		const viewportSize = vlist.getViewportSize();
		const maxScroll = vlist.getScrollSize() - viewportSize;

		const idealScroll = targetOffset - (viewportSize - itemSize) / 2;
		const targetScroll = Math.max(0, Math.min(idealScroll, maxScroll));
		const startScroll = vlist.getScrollOffset();
		const distance = targetScroll - startScroll;

		if (Math.abs(distance) < 1) return;

		const startTime = performance.now();

		function step(now: number) {
			if (!vlist) {
				animationId = null;
				return;
			}
			const progress = Math.min((now - startTime) / SCROLL_DURATION, 1);
			vlist.scrollTo(startScroll + distance * easeOutCubic(progress));

			if (progress < 1) {
				animationId = requestAnimationFrame(step);
			} else {
				animationId = null;
			}
		}

		animationId = requestAnimationFrame(step);
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
			style="padding-bottom: {index === items.length - 1 ? BOTTOM_PADDING : ITEM_GAP}px;{index === 0 ? ` padding-top: ${TOP_PADDING}px;` : ''}"
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
