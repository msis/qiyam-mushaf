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
	const MAX_OFFSET = 120;

	let focusedIndex = $state<number | null>(null);
	
	let touchStates = $state<Record<string, { startX: number; currentX: number }>>({});

	function getOffset(verseKey: GlobalVerseKey): number {
		const state = touchStates[verseKey];
		if (!state) return 0;
		const delta = state.startX - state.currentX;
		return Math.max(0, Math.min(delta, MAX_OFFSET));
	}

	function handlePointerDown(e: PointerEvent, verseKey: GlobalVerseKey) {
		touchStates[verseKey] = {
			startX: e.clientX,
			currentX: e.clientX
		};
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	}

	function handlePointerMove(e: PointerEvent, verseKey: GlobalVerseKey) {
		if (!touchStates[verseKey]) return;
		touchStates[verseKey] = {
			...touchStates[verseKey],
			currentX: e.clientX
		};
	}

	function handlePointerUp(e: PointerEvent, verseKey: GlobalVerseKey) {
		const state = touchStates[verseKey];
		if (!state) return;

		(e.target as HTMLElement).releasePointerCapture(e.pointerId);

		const delta = state.startX - state.currentX;
		if (delta > SWIPE_THRESHOLD) {
			onRemove(verseKey);
		}

		delete touchStates[verseKey];
		touchStates = { ...touchStates };
	}

	function handleNavigate(verseKey: GlobalVerseKey): void {
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
		if ((e.key === 'Delete' || e.key === 'Backspace') && focusedIndex !== null) {
			e.preventDefault();
			const bookmark = bookmarks[focusedIndex];
			if (bookmark) {
				onRemove(bookmark.verseKey);
			}
		}
	}

	function handleFocus(index: number) {
		focusedIndex = index;
	}

	function handleBlur() {
		focusedIndex = null;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
	onclick={handleBackdropClick}
	onkeydown={handleKeydown}
	role="dialog"
	aria-modal="true"
	aria-labelledby="modal-title"
	tabindex="-1"
>
	<div class="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-700 max-h-[80vh] flex flex-col">
		<div class="flex justify-between items-center mb-4">
			<h2 id="modal-title" class="text-xl font-bold text-amber-100">Bookmarks</h2>
			<button
				onclick={onClose}
				class="text-gray-400 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center rounded hover:bg-gray-700"
				aria-label="Close bookmarks"
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
			<div class="flex-1 overflow-y-auto space-y-2" role="list" aria-label="Bookmarked verses">
				{#each bookmarks as bookmark, index (bookmark.verseKey)}
					{@const pos = fromGlobalKey(bookmark.verseKey)}
					{@const offset = getOffset(bookmark.verseKey)}
					<div class="relative overflow-hidden rounded-lg">
						<div 
							class="absolute inset-y-0 right-0 w-20 flex items-center justify-center transition-opacity duration-200"
							class:bg-red-600={offset > 10}
							class:opacity-100={offset > 10}
							class:opacity-0={offset <= 10}
							aria-hidden="true"
						>
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
						</div>
						<div
							class="flex items-center justify-between rounded-lg p-3 bg-gray-700 hover:bg-gray-600 transition-colors"
							style="transform: translateX(-{offset}px); touch-action: none;"
							role="listitem"
							tabindex="0"
							onpointerdown={(e) => handlePointerDown(e, bookmark.verseKey)}
							onpointermove={(e) => handlePointerMove(e, bookmark.verseKey)}
							onpointerup={(e) => handlePointerUp(e, bookmark.verseKey)}
							onfocus={() => handleFocus(index)}
							onblur={handleBlur}
							aria-label="{surahs[pos.surah - 1]?.name ?? ''} verse {pos.verse}, press Delete to remove"
						>
							<button
								onclick={() => handleNavigate(bookmark.verseKey)}
								class="flex-1 text-start"
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
								aria-label="Remove bookmark"
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
