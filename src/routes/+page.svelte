<script lang="ts">
	import { appState } from '$lib/stores/app.svelte';
	import { getSpeechStore } from '$lib/stores/speech.svelte';
	import { toGlobalKey, getNextVerse } from '$lib/utils/globalAddressing';
	import { matchSpokenWords } from '$lib/utils/wordMatcher';
	import QuranVirtualList from '$lib/components/QuranVirtualList.svelte';
	import NavigationModal from '$lib/components/NavigationModal.svelte';
	import { fade } from 'svelte/transition';
	import { VERSE_ADVANCE_DELAY, ERROR_DISMISS_DELAY } from '$lib/utils/constants';
	import type { GlobalHighlightedWords } from '$lib/types';

	let { data } = $props();

	const speechStore = getSpeechStore();
	let virtualListRef = $state<QuranVirtualList | undefined>();

	const currentSurah = $derived(data.surahs[appState.currentSurahNum - 1] ?? null);

	function scrollToVerse(surah: number, verse: number): void {
		const flatIndex = data.lookupMaps.keyToIndex.get(toGlobalKey(surah, verse));
		if (flatIndex !== undefined && virtualListRef) {
			virtualListRef.scrollToIndex(flatIndex);
		}
	}

	function isVerseComplete(highlights: GlobalHighlightedWords): boolean {
		const key = appState.currentVerseKey;
		if (!key) return false;
		const matched = highlights[key];
		if (!matched) return false;
		const verse = currentSurah?.verses[appState.currentVerseNum - 1];
		if (!verse) return false;
		return matched.size >= verse.simpleWordCount;
	}

	function advanceToNextVerse(): void {
		const next = getNextVerse(data.surahs, appState.currentSurahNum, appState.currentVerseNum);
		if (!next) return;
		appState.setPosition(next.surah, next.verse);
		scrollToVerse(next.surah, next.verse);
	}

	// --- Reactive effects ---

	// Match spoken words against current verse
	$effect(() => {
		const transcript = speechStore.transcript;
		if (!transcript || transcript.trim().length === 0) return;

		const currentVerseIndex = appState.currentVerseNum - 1;

		if (currentSurah) {
			const localMatches = matchSpokenWords(transcript, currentSurah.verses, currentVerseIndex);

			const globalMatches: GlobalHighlightedWords = {};
			for (const [verseIdx, wordSet] of Object.entries(localMatches)) {
				const verseNumber = Number(verseIdx) + 1;
				const key = toGlobalKey(appState.currentSurahNum, verseNumber);
				globalMatches[key] = wordSet as Set<number>;
			}

			appState.highlightedWords = globalMatches;

			if (isVerseComplete(globalMatches)) {
				const timeoutId = setTimeout(() => advanceToNextVerse(), VERSE_ADVANCE_DELAY);
				return () => clearTimeout(timeoutId);
			}
		}
	});

	// Clear highlights when recognition starts
	$effect(() => {
		if (speechStore.status === 'listening') {
			appState.clearHighlights();
		}
	});

	// Auto-dismiss speech error after 3 seconds
	$effect(() => {
		if (!speechStore.errorMessage) return;
		const timeoutId = setTimeout(() => (speechStore.errorMessage = null), ERROR_DISMISS_DELAY);
		return () => clearTimeout(timeoutId);
	});

	// --- User-initiated navigation ---

	function navigateToVerse(surah: number, verse: number): void {
		if (speechStore.isListening) speechStore.stop();
		appState.setPosition(surah, verse);
		scrollToVerse(surah, verse);
	}

	function handleVerseClick(surah: number, verse: number): void {
		appState.setPosition(surah, verse);
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
			{currentSurah?.name} ({appState.currentSurahNum}:{appState.currentVerseNum})
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
			currentVerseKey={appState.currentVerseKey}
			highlightedWords={appState.highlightedWords}
			onVerseClick={handleVerseClick}
		/>
	</div>

	{#if appState.isModalOpen}
		<NavigationModal
			onClose={() => (appState.isModalOpen = false)}
			surahs={data.surahs}
			selectedSurah={appState.currentSurahNum}
			selectedVerse={appState.currentVerseNum}
			onNavigate={navigateToVerse}
		/>
	{/if}
</div>
