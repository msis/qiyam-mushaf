<script lang="ts">
	import { appState } from '$lib/stores/app.svelte';
	import { getSpeechStore } from '$lib/stores/speech.svelte';
	import { createSpeechMatcher } from '$lib/stores/speechMatcher.svelte';
	import { toGlobalKey, fromGlobalKey } from '$lib/utils/globalAddressing';
	import QuranVirtualList from '$lib/components/QuranVirtualList.svelte';
	import NavigationModal from '$lib/components/NavigationModal.svelte';
	import SettingsButton from '$lib/components/SettingsButton.svelte';
	import SettingsModal from '$lib/components/SettingsModal.svelte';
	import AcknowledgmentsModal from '$lib/components/AcknowledgmentsModal.svelte';
	import PositionBadge from '$lib/components/PositionBadge.svelte';
	import ErrorToast from '$lib/components/ErrorToast.svelte';
	import RecordButton from '$lib/components/RecordButton.svelte';
	import { ERROR_DISMISS_DELAY } from '$lib/utils/constants';
	import type { GlobalVerseKey } from '$lib/types';

	let { data } = $props();

	const speechStore = getSpeechStore();
	createSpeechMatcher(data.allWords, speechStore);
	let virtualListRef = $state<QuranVirtualList | undefined>();

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

		if (key === lastScrolledKey) return;
		if (idx < scrollFloor) return;

		scrollFloor = idx;
		lastScrolledKey = key;
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
</script>

<div class="h-screen bg-gray-900 flex flex-col">
	<div class="fixed top-4 right-4 z-40">
		<SettingsButton onclick={() => (appState.isSettingsModalOpen = true)} />
	</div>

	<div class="fixed top-4 left-4 z-40">
		<PositionBadge
			surahName={currentSurah?.name ?? ''}
			surahNumber={currentPosition.surah}
			verseNumber={currentPosition.verse}
			onclick={() => (appState.isNavigationModalOpen = true)}
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
			onVerseClick={setCursorToVerse}
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
		/>
	{/if}

	{#if appState.isAcknowledgmentsOpen}
		<AcknowledgmentsModal onClose={() => (appState.isAcknowledgmentsOpen = false)} />
	{/if}
</div>
