<script lang="ts">
	import { appState } from '$lib/stores/app.svelte';
	import { getSpeechStore } from '$lib/stores/speech.svelte';
	import { createSpeechMatcher } from '$lib/stores/speechMatcher.svelte';
	import { getBookmarkStore } from '$lib/stores/bookmarks.svelte';
	import { toGlobalKey, fromGlobalKey } from '$lib/utils/globalAddressing';
	import QuranVirtualList from '$lib/components/QuranVirtualList.svelte';
	import NavigationModal from '$lib/components/NavigationModal.svelte';
	import SettingsButton from '$lib/components/SettingsButton.svelte';
	import SettingsModal from '$lib/components/SettingsModal.svelte';
	import AcknowledgmentsModal from '$lib/components/AcknowledgmentsModal.svelte';
	import PositionBadge from '$lib/components/PositionBadge.svelte';
	import ErrorToast from '$lib/components/ErrorToast.svelte';
	import RecordButton from '$lib/components/RecordButton.svelte';
	import BookmarkButton from '$lib/components/BookmarkButton.svelte';
	import BookmarkModal from '$lib/components/BookmarkModal.svelte';
	import { ERROR_DISMISS_DELAY } from '$lib/utils/constants';
	import type { GlobalVerseKey } from '$lib/types';
	import { getSettingsStore } from '$lib/stores/settings.svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

	const speechStore = getSpeechStore();
	const bookmarkStore = getBookmarkStore();
	const settingsStore = getSettingsStore();
	createSpeechMatcher(data.allWords, speechStore);
	let virtualListRef = $state<QuranVirtualList | undefined>();

	let isBookmarkModalOpen = $state(false);

	// --- Derived position from nextWordIndex (O(1) field read) ---

	const currentWord = $derived(
		data.allWords[Math.min(appState.nextWordIndex, data.allWords.length - 1)]
	);

	const currentVerseKey: GlobalVerseKey = $derived(
		currentWord?.verseKey ?? toGlobalKey(1, 1)
	);

	const currentPosition = $derived(fromGlobalKey(currentVerseKey));
	const currentSurah = $derived(data.surahs[currentPosition.surah - 1] ?? null);

	// --- Scroll helper ---

	function scrollToVerse(key: GlobalVerseKey): void {
		const flatIndex = data.lookupMaps.keyToIndex.get(key);
		if (flatIndex !== undefined && virtualListRef) {
			virtualListRef.scrollToIndex(flatIndex);
		}
	}

	// --- Reactive effects ---

	// Forward-only auto-scroll: prevents jitter from interim speech oscillation.
	// User navigation resets both variables, allowing any direction.
	let scrollFloor = 0;
	let lastScrolledKey: GlobalVerseKey | null = null;

	$effect(() => {
		const key = currentVerseKey;
		const idx = appState.nextWordIndex;

		if (idx < scrollFloor) return;

		if (key !== lastScrolledKey) {
			scrollFloor = idx;
			lastScrolledKey = key;
		}

		scrollToVerse(key);
	});

	// Auto-dismiss speech error after 3 seconds
	$effect(() => {
		if (!speechStore.errorMessage) return;
		const timeoutId = setTimeout(() => (speechStore.errorMessage = null), ERROR_DISMISS_DELAY);
		return () => clearTimeout(timeoutId);
	});

	// --- User-initiated navigation ---

	function setCursorToVerse(surahNum: number, verseNum: number): void {
		const targetVerse = data.surahs[surahNum - 1]?.verses[verseNum - 1];
		const idx = targetVerse?.words[0]?.globalIndex ?? 0;
		scrollFloor = idx;
		lastScrolledKey = null;
		appState.finalCursor = idx;
		appState.nextWordIndex = idx;
	}

	function navigateToVerse(surahNum: number, verseNum: number): void {
		if (speechStore.isListening) speechStore.stop();
		setCursorToVerse(surahNum, verseNum);
	}

	function toggleRecognition(): void {
		speechStore.toggle();
	}

	function handleToggleBookmark(): void {
		bookmarkStore.toggleBookmark(currentVerseKey);
	}

	function openBookmarkList(): void {
		appState.isSettingsModalOpen = false;
		isBookmarkModalOpen = true;
	}

	function handleRemoveBookmark(verseKey: GlobalVerseKey): void {
		bookmarkStore.toggleBookmark(verseKey);
	}

	function handleToggleVerseBookmark(verseKey: GlobalVerseKey): void {
		bookmarkStore.toggleBookmark(verseKey);
	}

	async function handleToggleContinue(enabled: boolean): Promise<void> {
		await bookmarkStore.setContinueEnabled(enabled);
	}

	// Flag to prevent saving position during restore
	// Initialize as true to prevent saves before restore completes
	let isRestoring = $state(true);
	let isSavingPosition = false;
	let saveTimeout: ReturnType<typeof setTimeout> | null = null;

	async function restorePosition(): Promise<void> {
		await bookmarkStore.init();
		
		// Only restore if continue is enabled
		if (bookmarkStore.getContinueEnabled()) {
			const continuePos = bookmarkStore.getContinuePosition();
			if (continuePos) {
				const pos = fromGlobalKey(continuePos.verseKey);
				const targetVerse = data.surahs[pos.surah - 1]?.verses[pos.verse - 1];
				if (targetVerse) {
					const idx = targetVerse.words[0]?.globalIndex ?? 0;
					scrollFloor = idx;
					lastScrolledKey = null;
					appState.finalCursor = idx;
					appState.nextWordIndex = idx;
				}
			}
		}
		isRestoring = false;
	}

	function updateContinuePosition(): void {
		if (isRestoring || isSavingPosition) return;

		if (saveTimeout) clearTimeout(saveTimeout);

		saveTimeout = setTimeout(async () => {
			isSavingPosition = true;
			try {
				await bookmarkStore.setContinuePosition(currentVerseKey);
			} catch (e) {
				console.error('Failed to save position:', e);
			} finally {
				isSavingPosition = false;
			}
		}, 500);
	}

	onMount(() => {
		restorePosition();
	});

	$effect(() => {
		const key = currentVerseKey;
		if (key) {
			updateContinuePosition();
		}
	});
</script>

<div
	class="h-screen bg-gray-900 flex flex-col"
	style="--verse-font-size: {settingsStore.verseFontSize}px"
>
	<div class="fixed top-4 right-4 z-40">
		<SettingsButton onclick={() => (appState.isSettingsModalOpen = true)} />
	</div>

	<div class="fixed top-4 left-4 z-40 flex items-center gap-2">
		<PositionBadge
			surahName={currentSurah?.name ?? ''}
			surahNumber={currentPosition.surah}
			verseNumber={currentPosition.verse}
			onclick={() => (appState.isNavigationModalOpen = true)}
		/>
		<BookmarkButton
			isBookmarked={bookmarkStore.isBookmarked(currentVerseKey)}
			onToggle={handleToggleBookmark}
		/>
	</div>

	{#if speechStore.errorMessage}
		<ErrorToast message={speechStore.errorMessage} />
	{/if}

	<div class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
		<RecordButton isListening={speechStore.isListening} onclick={toggleRecognition} />
	</div>

	<div class="flex-1 min-h-0 h-full">
		<QuranVirtualList
			bind:this={virtualListRef}
			items={data.renderableItems}
			{currentVerseKey}
			nextWordIndex={appState.nextWordIndex}
			bookmarkedKeys={bookmarkStore.bookmarkedKeys}
			onVerseClick={setCursorToVerse}
			onToggleVerseBookmark={handleToggleVerseBookmark}
		/>
	</div>

	{#if appState.isNavigationModalOpen}
		<NavigationModal
			onClose={() => (appState.isNavigationModalOpen = false)}
			surahs={data.surahs}
			selectedSurah={currentPosition.surah}
			selectedVerse={currentPosition.verse}
			onNavigate={navigateToVerse}
		/>
	{/if}

	{#if appState.isSettingsModalOpen}
		<SettingsModal
			onClose={() => (appState.isSettingsModalOpen = false)}
			onOpenAcknowledgments={() => (appState.isAcknowledgmentsOpen = true)}
			onOpenBookmarks={openBookmarkList}
			onToggleContinue={handleToggleContinue}
			continueEnabled={bookmarkStore.getContinueEnabled()}
			bookmarkCount={bookmarkStore.bookmarks.length}
		/>
	{/if}

	{#if appState.isAcknowledgmentsOpen}
		<AcknowledgmentsModal onClose={() => (appState.isAcknowledgmentsOpen = false)} />
	{/if}

	{#if isBookmarkModalOpen}
		<BookmarkModal
			bookmarks={bookmarkStore.bookmarks}
			surahs={data.surahs}
			onClose={() => (isBookmarkModalOpen = false)}
			onNavigate={navigateToVerse}
			onRemove={handleRemoveBookmark}
		/>
	{/if}
</div>
