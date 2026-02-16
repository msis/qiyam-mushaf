<script lang="ts">
	import type { Surah, GlobalVerseKey } from '$lib/types';
	import { fromGlobalKey } from '$lib/utils/globalAddressing';
	import type { Bookmark } from '$lib/services/BookmarkService';

	interface Props {
		bookmarks: Bookmark[];
		surahs: Surah[];
		onClose: () => void;
		onNavigate: (surahNumber: number, verseNumber: number) => void;
		onRemove: (verseKey: GlobalVerseKey) => void;
	}

	let { bookmarks, surahs, onClose, onNavigate, onRemove }: Props = $props();

	const SWIPE_THRESHOLD = 100;

	let touchStates = $state<Record<string, { startX: number; currentX: number; isSwiping: boolean }>>({});

	function getSurahName(verseKey: GlobalVerseKey): string {
		const pos = fromGlobalKey(verseKey);
		const surah = surahs.find((s) => s.number === pos.surah);
		return surah ? `${surah.name} (${surah.nameEn})` : '';
	}

	function handleBookmarkClick(verseKey: GlobalVerseKey): void {
		const pos = fromGlobalKey(verseKey);
		onNavigate(pos.surah, pos.verse);
		onClose();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}

	function handleTouchStart(e: TouchEvent, verseKey: GlobalVerseKey) {
		const touch = e.touches[0];
		touchStates[verseKey] = {
			startX: touch.clientX,
			currentX: touch.clientX,
			isSwiping: true
		};
	}

	function handleTouchMove(e: TouchEvent, verseKey: GlobalVerseKey) {
		if (!touchStates[verseKey]?.isSwiping) return;
		const touch = e.touches[0];
		const deltaX = touch.clientX - touchStates[verseKey].startX;
		if (deltaX < 0) {
			touchStates[verseKey] = {
				...touchStates[verseKey],
				currentX: touch.clientX
			};
		}
	}

	function handleTouchEnd(e: TouchEvent, verseKey: GlobalVerseKey) {
		if (!touchStates[verseKey]) return;
		const deltaX = touchStates[verseKey].startX - touchStates[verseKey].currentX;
		if (deltaX > SWIPE_THRESHOLD) {
			onRemove(verseKey);
		}
		touchStates[verseKey] = {
			startX: 0,
			currentX: 0,
			isSwiping: false
		};
	}

	function handleKeyDownSwipe(e: KeyboardEvent, verseKey: GlobalVerseKey) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onRemove(verseKey);
		}
	}

	function getTranslateX(verseKey: GlobalVerseKey): number {
		const state = touchStates[verseKey];
		if (!state) return 0;
		const delta = state.startX - state.currentX;
		return delta > 0 ? Math.min(delta, 120) : 0;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
	onclick={handleBackdropClick}
	onkeydown={handleKeydown}
	role="dialog"
	aria-modal="true"
	aria-labelledby="modal-title"
	tabindex="-1"
	dir="ltr"
>
	<div class="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-700 max-h-[80vh] flex flex-col">
		<div class="flex justify-between items-center mb-4">
			<h2 id="modal-title" class="text-xl font-bold text-amber-100">Bookmarks</h2>
			<button
				onclick={onClose}
				class="text-gray-400 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center rounded hover:bg-gray-700"
			>
				&times;
			</button>
		</div>

		{#if bookmarks.length === 0}
			<div class="text-center text-gray-400 py-8">
				<svg class="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
				</svg>
				<p>No bookmarks yet</p>
				<p class="text-sm mt-1">Tap the bookmark icon to save a verse</p>
			</div>
		{:else}
			<div class="flex-1 overflow-y-auto space-y-2">
				{#each bookmarks as bookmark (bookmark.verseKey)}
					{@const pos = fromGlobalKey(bookmark.verseKey)}
					{@const translateX = getTranslateX(bookmark.verseKey)}
					<div class="relative overflow-hidden rounded-lg">
						<div class="absolute inset-y-0 right-0 flex items-center justify-center w-20 bg-red-600 text-white transition-opacity" class:opacity-100={translateX > 10} class:opacity-0={translateX <= 10}>
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
						</div>
						<div
							class="flex items-center justify-between bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors"
							ontouchstart={(e) => handleTouchStart(e, bookmark.verseKey)}
							ontouchmove={(e) => handleTouchMove(e, bookmark.verseKey)}
							ontouchend={(e) => handleTouchEnd(e, bookmark.verseKey)}
							onkeydown={(e) => handleKeyDownSwipe(e, bookmark.verseKey)}
							role="button"
							tabindex="0"
							aria-label="Swipe or press to delete bookmark"
							style="transform: translateX(-{translateX}px); touch-action: pan-y;"
						>
							<button
							onclick={() => handleBookmarkClick(bookmark.verseKey)}
							class="flex-1"
							>
								<div class="text-amber-100 font-medium">
									{surahs[pos.surah - 1]?.name ?? ''}
								</div>
								<div class="text-gray-400 text-sm">
									{surahs[pos.surah - 1]?.nameEn ?? ''} - Verse {pos.verse}
								</div>
							</button>
							<button
								onclick={() => onRemove(bookmark.verseKey)}
								class="text-gray-400 hover:text-red-400 p-2 rounded-full hover:bg-gray-500 transition-colors"
								title="Remove bookmark"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
								</svg>
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
