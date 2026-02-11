/**
 * Mutable application state using Svelte 5 runes.
 * Position is derived O(1) via allWords[nextWordIndex].verseKey.
 */
class AppState {
	nextWordIndex = $state(0);
	isModalOpen = $state(false);
}

export const appState = new AppState();
