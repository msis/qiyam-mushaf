<script lang="ts">
	import { appState } from '$lib/stores/app.svelte';
	import { getSpeechStore } from '$lib/stores/speech.svelte';
	import { createScrollStore } from '$lib/stores/scroll.svelte';
	import { toGlobalKey } from '$lib/utils/globalAddressing';
	import { matchSpokenWords } from '$lib/utils/wordMatcher';
	import QuranVirtualList from '$lib/components/QuranVirtualList.svelte';
	import NavigationModal from '$lib/components/NavigationModal.svelte';
	import type { GlobalHighlightedWords } from '$lib/types';

	// Load data from +page.ts (SvelteKit handles loading/error states automatically)
	let { data } = $props();

	const speechStore = getSpeechStore();

	// Create scroll store with callbacks
	const scrollStore = createScrollStore({
		autoAdvance: true,
		onVerseChange: (surah, verse) => {
			appState.setPosition(surah, verse);
		},
		onScrollToIndex: (index) => {
			virtualListRef?.scrollToIndex(index);
		}
	});

	// Reference to virtual list for scrolling
	let virtualListRef = $state<QuranVirtualList | undefined>();

	// Derived: current surah from load data + position state
	const currentSurah = $derived(data.surahs[appState.currentSurahNum - 1] ?? null);

	// Sync scroll store with loaded data (runs once)
	$effect(() => {
		scrollStore.setSurahs(data.surahs);
		scrollStore.setLookupMaps(data.lookupMaps);
	});

	// React to speech transcript changes
	$effect(() => {
		const transcript = speechStore.transcript;
		if (!transcript || transcript.trim().length === 0) {
			return;
		}

		const currentVerseIndex = appState.currentVerseNum - 1;

		if (currentSurah) {
			const localMatches = matchSpokenWords(transcript, currentSurah.verses, currentVerseIndex);

			// Convert local verse indices to global keys
			const globalMatches: GlobalHighlightedWords = {};
			for (const [verseIdx, wordSet] of Object.entries(localMatches)) {
				const verseNumber = Number(verseIdx) + 1;
				const key = toGlobalKey(appState.currentSurahNum, verseNumber);
				globalMatches[key] = wordSet as Set<number>;
			}

			appState.highlightedWords = globalMatches;

			if (scrollStore.checkShouldAdvance(globalMatches)) {
				const timeoutId = setTimeout(() => {
					scrollStore.advanceToNextVerse(globalMatches);
				}, 500);

				return () => clearTimeout(timeoutId);
			}
		}
	});

	// Keep scroll manager synced with position
	$effect(() => {
		scrollStore.setCurrentPosition(appState.currentSurahNum, appState.currentVerseNum);
	});

	// Clear highlights when recognition starts
	$effect(() => {
		if (speechStore.status === 'listening') {
			appState.clearHighlights();
		}
	});

	// Navigation handlers
	function navigateToVerse(surah: number, verse: number, scroll = true): void {
		const flatIndex = data.lookupMaps.keyToIndex.get(toGlobalKey(surah, verse));

		if (speechStore.isListening) {
			speechStore.stop();
		}

		appState.setPosition(surah, verse);
		scrollStore.setCurrentPosition(surah, verse);

		if (scroll && flatIndex !== undefined && virtualListRef) {
			virtualListRef.scrollToIndex(flatIndex);
		}
	}

	function handleVerseClick(surah: number, verse: number): void {
		navigateToVerse(surah, verse, false);
	}

	function handleModalNavigate(surahNumber: number, verseNumber: number): void {
		navigateToVerse(surahNumber, verseNumber);
	}

	function toggleRecognition(): void {
		speechStore.toggle();
	}
</script>

<div class="h-screen bg-gray-900 flex flex-col">
	<!-- Navigation button - fixed position -->
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

	<!-- Current position indicator - fixed position -->
	<div class="fixed top-4 left-4 z-40 bg-gray-800 bg-opacity-90 px-3 py-2 rounded-lg">
		<span class="text-amber-100 text-sm font-medium">
			{currentSurah?.name} ({appState.currentSurahNum}:{appState.currentVerseNum})
		</span>
	</div>

	<!-- Recording button - fixed position with pulse animation when listening -->
	<div class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
		<button
			onclick={toggleRecognition}
			class="p-4 rounded-full shadow-lg transition-all {speechStore.isListening
				? 'bg-red-600 hover:bg-red-700 animate-pulse'
				: 'bg-green-600 hover:bg-green-700'} text-white"
			title={speechStore.isListening ? 'Stop recording' : 'Start recording'}
		>
			{#if speechStore.isListening}
				<!-- Stop icon -->
				<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<rect x="6" y="6" width="12" height="12" stroke-width="2" />
				</svg>
			{:else}
				<!-- Microphone icon -->
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

	<!-- Virtual scrolling Quran display -->
	<div class="flex-1 min-h-0 h-full">
		<QuranVirtualList
			bind:this={virtualListRef}
			items={data.renderableItems}
			currentVerseKey={appState.currentVerseKey}
			highlightedWords={appState.highlightedWords}
			onVerseClick={handleVerseClick}
		/>
	</div>

	<!-- Navigation modal -->
	<NavigationModal
		isOpen={appState.isModalOpen}
		onClose={() => (appState.isModalOpen = false)}
		surahs={data.surahs}
		selectedSurah={appState.currentSurahNum}
		selectedVerse={appState.currentVerseNum}
		onNavigate={handleModalNavigate}
	/>
</div>
