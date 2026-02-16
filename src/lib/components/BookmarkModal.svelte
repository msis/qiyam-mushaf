<script lang="ts">
	import type { Surah, GlobalVerseKey } from '$lib/types';
	import { fromGlobalKey } from '$lib/utils/globalAddressing';
	import type { Bookmark } from '$lib/services/BookmarkService';
	import BookmarkEmpty from './BookmarkEmpty.svelte';
	import BookmarkItem from './BookmarkItem.svelte';

	interface Props {
		bookmarks: Bookmark[];
		surahs: Surah[];
		onClose: () => void;
		onNavigate: (surahNumber: number, verseNumber: number) => void;
		onRemove: (verseKey: GlobalVerseKey) => void;
	}

	let { bookmarks, surahs, onClose, onNavigate, onRemove }: Props = $props();

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
			<BookmarkEmpty />
		{:else}
			<div class="flex-1 overflow-y-auto space-y-2" role="list" aria-label="Bookmarked verses">
				{#each bookmarks as bookmark (bookmark.verseKey)}
					{@const pos = fromGlobalKey(bookmark.verseKey)}
					<BookmarkItem
						bookmark={bookmark}
						surah={surahs[pos.surah - 1]}
						verseNumber={pos.verse}
						onNavigate={handleNavigate}
						onRemove={onRemove}
					/>
				{/each}
			</div>
		{/if}
	</div>
</div>
