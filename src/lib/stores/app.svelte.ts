/**
 * Mutable application state using Svelte 5 runes.
 * Position is derived O(1) via allWords[nextWordIndex].verseKey.
 *
 * Dual-cursor model:
 * - finalCursor: stable anchor, only advances on committed (final) speech
 * - nextWordIndex: visual cursor, updated by both final and interim results
 */
class AppState {
	finalCursor = $state(0);
	nextWordIndex = $state(0);
	isNavigationModalOpen = $state(false);
	isSettingsModalOpen = $state(false);
	isAcknowledgmentsOpen = $state(false);
	isInstallGuideOpen = $state(false);
	isContributeOpen = $state(false);
}

export const appState = new AppState();
