<script lang="ts">
	import type { Surah } from '$lib/types';
	import { onMount } from 'svelte';

	interface Props {
		onClose: () => void;
		surahs: Surah[];
		selectedSurah: number;
		selectedVerse: number;
		onNavigate: (surahNumber: number, verseNumber: number) => void;
	}

	let { onClose, surahs, selectedSurah, selectedVerse, onNavigate }: Props = $props();

	// Local state for selection (doesn't navigate until "Go" is clicked)
	// Initialized from props — component mounts fresh each time via parent {#if}
	// We intentionally capture initial values, not track ongoing changes
	// svelte-ignore state_referenced_locally
	let localSurah = $state(selectedSurah);
	// svelte-ignore state_referenced_locally
	let localVerse = $state(selectedVerse);

	let selectedSurahData = $derived(surahs.find((s) => s.number === localSurah));

	function handleSurahSelect(surahNumber: number) {
		localSurah = surahNumber;
		localVerse = 1; // Reset to verse 1 when changing surah
	}

	function handleGo() {
		onNavigate(localSurah, localVerse);
		onClose();
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}

	function handleBackdropKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			if (e.target === e.currentTarget) {
				onClose();
			}
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		} else if (e.key === 'Enter') {
			handleGo();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
	onclick={handleBackdropClick}
	onkeydown={handleBackdropKeydown}
	role="dialog"
	aria-modal="true"
	aria-labelledby="modal-title"
	tabindex="-1"
	dir="ltr"
>
	<div class="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-700">
		<div class="flex justify-between items-center mb-6">
			<h2 id="modal-title" class="text-xl font-bold text-amber-100">Navigate to Verse</h2>
			<button
				onclick={onClose}
				class="text-gray-400 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center rounded hover:bg-gray-700"
			>
				&times;
			</button>
		</div>

		<div class="space-y-5">
			<div>
				<label for="surah-select" class="block text-sm font-medium text-amber-200 mb-2">
					Surah
				</label>
				<select
					id="surah-select"
					value={localSurah}
					onchange={(e) => handleSurahSelect(Number(e.currentTarget.value))}
					class="w-full bg-gray-700 text-amber-100 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
				>
					{#each surahs as surah (surah.number)}
						<option value={surah.number}>
							{surah.number}. {surah.name} ({surah.nameEn})
						</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="verse-select" class="block text-sm font-medium text-amber-200 mb-2">
					Verse
				</label>
				<select
					id="verse-select"
					value={localVerse}
					onchange={(e) => (localVerse = Number(e.currentTarget.value))}
					class="w-full bg-gray-700 text-amber-100 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
					disabled={!selectedSurahData}
				>
					{#if selectedSurahData}
						{#each selectedSurahData.verses as verse (verse.number)}
							<option value={verse.number}>
								Verse {verse.number}
							</option>
						{/each}
					{/if}
				</select>
			</div>

			<button
				onclick={handleGo}
				class="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-4"
			>
				Go to {localSurah}:{localVerse}
			</button>
		</div>
	</div>
</div>
