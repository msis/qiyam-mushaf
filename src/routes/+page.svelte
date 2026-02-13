<script lang="ts">
	import { appState } from '$lib/stores/app.svelte';
	import { getSpeechStore } from '$lib/stores/speech.svelte';
	import { toGlobalKey, fromGlobalKey } from '$lib/utils/globalAddressing';
	import { matchWords } from '$lib/utils/wordMatcher';
	import QuranVirtualList from '$lib/components/QuranVirtualList.svelte';
	import NavigationModal from '$lib/components/NavigationModal.svelte';
	import { fade } from 'svelte/transition';
	import { ERROR_DISMISS_DELAY } from '$lib/utils/constants';
	import type { GlobalVerseKey } from '$lib/types';

	let { data } = $props();

	const speechStore = getSpeechStore();
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

	// The final cursor is the stable anchor. It only advances on committed
	// (final) speech results, preventing volatile interim results from
	// corrupting the search window.
	let finalCursor = $state(appState.nextWordIndex);

	$inspect('final', speechStore.finalTranscript);
	$inspect('interim', speechStore.interimTranscript);
	$inspect('finalCursor', finalCursor);
	$inspect('nextWordIndex', appState.nextWordIndex);

	// Process FINAL transcript: advance the stable anchor
	$effect(() => {
		const transcript = speechStore.finalTranscript;
		if (!transcript || transcript.trim().length === 0) return;

		const newIndex = matchWords(transcript, data.allWords, finalCursor);
		finalCursor = newIndex;
		appState.nextWordIndex = newIndex;
	});

	// Process INTERIM transcript: advance display cursor only (not the anchor).
	// Always searches from the final cursor, so each interim independently finds
	// the best match from the last known-good position.
	$effect(() => {
		const transcript = speechStore.interimTranscript;
		if (!transcript || transcript.trim().length === 0) return;

		const newIndex = matchWords(transcript, data.allWords, finalCursor);
		appState.nextWordIndex = newIndex;
	});

	// Auto-scroll when current verse changes
	let lastScrolledKey: GlobalVerseKey | null = null;

	$effect(() => {
		const key = currentVerseKey;
		if (key !== lastScrolledKey) {
			lastScrolledKey = key;
			scrollToVerse(key);
		}
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
		appState.nextWordIndex = idx;
		finalCursor = idx;
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
		<button
			onclick={() => (appState.isModalOpen = true)}
			class="bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-full shadow-lg transition-colors"
			title="Open navigation"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				/>
			</svg>
		</button>
	</div>

	<div class="fixed top-4 left-4 z-40 bg-gray-800 bg-opacity-90 px-3 py-2 rounded-lg">
		<span class="text-amber-100 text-sm font-medium">
			{currentSurah?.name} ({currentPosition.surah}:{currentPosition.verse})
		</span>
	</div>

	{#if speechStore.errorMessage}
		<div
			transition:fade={{ duration: 200 }}
			role="alert"
			class="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 bg-red-900/90 text-red-100 text-sm px-4 py-2 rounded-lg shadow-lg"
		>
			{speechStore.errorMessage}
		</div>
	{/if}

	<div class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
		<button
			onclick={toggleRecognition}
			class="p-4 rounded-full shadow-lg transition-all {speechStore.isListening
				? 'bg-red-600 hover:bg-red-700 animate-pulse'
				: 'bg-green-600 hover:bg-green-700'} text-white"
			title={speechStore.isListening ? 'Stop recording' : 'Start recording'}
		>
			{#if speechStore.isListening}
				<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<rect x="6" y="6" width="12" height="12" stroke-width="2" />
				</svg>
			{:else}
				<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
					/>
				</svg>
			{/if}
		</button>
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

	{#if appState.isModalOpen}
		<NavigationModal
			onClose={() => (appState.isModalOpen = false)}
			surahs={data.surahs}
			selectedSurah={currentPosition.surah}
			selectedVerse={currentPosition.verse}
			onNavigate={navigateToVerse}
		/>
	{/if}
</div>
