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
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
	onclick={handleBackdropClick}
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
					<div class="flex items-center justify-between bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors">
						<button
							onclick={() => handleBookmarkClick(bookmark.verseKey)}
							class="flex-1 text-left"
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
				{/each}
			</div>
		{/if}
	</div>
</div>
