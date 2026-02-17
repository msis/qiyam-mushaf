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
		bookmarkedKeys?: Set<string>;
		onVerseClick?: (surahNumber: number, verseNumber: number) => void;
		onToggleVerseBookmark?: (verseKey: GlobalVerseKey) => void;
	}

	let { items, currentVerseKey, nextWordIndex, bookmarkedKeys = new Set(), onVerseClick, onToggleVerseBookmark }: Props = $props();

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

	/**
	 * Estimate how far through the item the current word is (0–1).
	 * Returns 0.5 (center) when nextWordIndex is outside this verse's range,
	 * which means the scroll is a navigation jump rather than reading progress.
	 */
	function wordFraction(index: number): number {
		const item = items[index];
		if (item?.type !== 'verse') return 0.5;
		const wordsInVerse = item.verse.words.length;
		if (wordsInVerse === 0) return 0.5;
		const startGlobal = item.verse.words[0]?.globalIndex ?? 0;
		const localOffset = nextWordIndex - startGlobal;
		if (localOffset < 0 || localOffset >= wordsInVerse) return 0.5;
		return localOffset / wordsInVerse;
	}

	/** Compute the ideal scroll offset to center the word-aware point of an item. */
	function computeScrollTarget(index: number): number | null {
		if (!vlist) return null;
		const targetOffset = vlist.getItemOffset(index);
		const itemSize = vlist.getItemSize(index);
		const viewportSize = vlist.getViewportSize();
		const maxScroll = vlist.getScrollSize() - viewportSize;
		const pointToCenter = targetOffset + wordFraction(index) * itemSize;
		return Math.max(0, Math.min(pointToCenter - viewportSize / 2, maxScroll));
	}

	export function scrollToIndex(index: number): void {
		if (!vlist) return;

		// Cancel any in-progress animation
		if (animationId !== null) {
			cancelAnimationFrame(animationId);
			animationId = null;
		}

		const currentIndex = vlist.findItemIndex(vlist.getScrollOffset());

		// Far jump — library handles measurement-retry internally
		if (Math.abs(index - currentIndex) > SMOOTH_THRESHOLD) {
			vlist.scrollToIndex(index, { align: 'center' });
			return;
		}

		// Nearby — smooth scroll with word-aware centering
		const targetScroll = computeScrollTarget(index);
		if (targetScroll === null) return;
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
				{@const isBookmarked = bookmarkedKeys.has(item.verseKey)}
				<VerseRow
					verse={item.verse}
					verseKey={item.verseKey}
					surahNumber={item.surahNumber}
					isCurrentVerse={isActive}
					highlightedCount={isActive ? Math.max(0, Math.min(item.verse.words.length, nextWordIndex - offset)) : 0}
					isBookmarked={isBookmarked}
					onclick={onVerseClick}
					onToggleVerseBookmark={onToggleVerseBookmark}
				/>
			{/if}
		</div>
	{/snippet}
</VList>
