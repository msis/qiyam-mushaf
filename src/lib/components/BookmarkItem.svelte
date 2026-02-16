<script lang="ts">
	import type { Surah, GlobalVerseKey } from '$lib/types';

	interface Props {
		bookmark: { verseKey: GlobalVerseKey };
		surah: Surah;
		verseNumber: number;
		onNavigate: (verseKey: GlobalVerseKey) => void;
		onRemove: (verseKey: GlobalVerseKey) => void;
	}

	let { bookmark, surah, verseNumber, onNavigate, onRemove }: Props = $props();

	const SWIPE_THRESHOLD = 100;
	const MAX_OFFSET = 120;

	let touchState = $state<{ startX: number; currentX: number } | null>(null);

	function getOffset(): number {
		if (!touchState) return 0;
		const delta = touchState.startX - touchState.currentX;
		return Math.max(0, Math.min(delta, MAX_OFFSET));
	}

	function handlePointerDown(e: PointerEvent) {
		touchState = {
			startX: e.clientX,
			currentX: e.clientX
		};
		(e.target as HTMLElement).setPointerCapture(e.pointerId);
	}

	function handlePointerMove(e: PointerEvent) {
		if (!touchState) return;
		touchState = {
			...touchState,
			currentX: e.clientX
		};
	}

	function handlePointerUp(e: PointerEvent) {
		if (!touchState) return;

		(e.target as HTMLElement).releasePointerCapture(e.pointerId);

		const delta = touchState.startX - touchState.currentX;
		if (delta > SWIPE_THRESHOLD) {
			onRemove(bookmark.verseKey);
		}

		touchState = null;
	}

	function handlePointerCancel(e: PointerEvent) {
		if (!touchState) return;
		(e.target as HTMLElement).releasePointerCapture(e.pointerId);
		touchState = null;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Delete' || e.key === 'Backspace') {
			e.preventDefault();
			onRemove(bookmark.verseKey);
		}
	}
</script>

<div class="relative overflow-hidden rounded-lg">
	<div 
		class="absolute inset-y-0 right-0 w-20 flex items-center justify-center transition-opacity duration-200"
		class:bg-red-600={getOffset() > 10}
		class:opacity-100={getOffset() > 10}
		class:opacity-0={getOffset() <= 10}
		aria-hidden="true"
	>
		<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
		</svg>
	</div>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="flex items-center justify-between rounded-lg p-3 bg-gray-700 hover:bg-gray-600 transition-colors"
		style="transform: translateX(-{getOffset()}px); touch-action: none;"
		role="listitem"
		tabindex="0"
		onkeydown={handleKeydown}
		onpointerdown={handlePointerDown}
		onpointermove={handlePointerMove}
		onpointerup={handlePointerUp}
		onpointercancel={handlePointerCancel}
		aria-label="{surah?.name ?? ''} verse {verseNumber}, press Delete to remove"
	>
		<button
			onclick={() => onNavigate(bookmark.verseKey)}
			class="flex-1 text-start"
		>
			<div class="text-amber-100 font-medium">
				{surah?.name ?? ''}
			</div>
			<div class="text-gray-400 text-sm">
				{surah?.nameEn ?? ''} - Verse {verseNumber}
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
