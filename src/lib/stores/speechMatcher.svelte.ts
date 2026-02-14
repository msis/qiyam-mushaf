import { matchWords } from '$lib/utils/wordMatcher';
import { appState } from '$lib/stores/app.svelte';
import type { Word } from '$lib/types';

interface SpeechTranscripts {
	readonly finalTranscript: string;
	readonly interimTranscript: string;
}

/**
 * Reactive speech-to-cursor matcher.
 *
 * Reads finalTranscript/interimTranscript and advances the dual cursors
 * on appState (finalCursor + nextWordIndex).
 *
 * Must be called from a component context so $effect binds to the component lifecycle.
 */
export function createSpeechMatcher(allWords: Word[], speech: SpeechTranscripts) {
	// Process FINAL transcript: advance the stable anchor
	$effect(() => {
		const transcript = speech.finalTranscript;
		if (!transcript || transcript.trim().length === 0) return;

		const newIndex = matchWords(transcript, allWords, appState.finalCursor);
		appState.finalCursor = newIndex;
		appState.nextWordIndex = newIndex;
	});

	// Process INTERIM transcript: advance display cursor only (not the anchor).
	// Always searches from the final cursor, so each interim independently finds
	// the best match from the last known-good position.
	$effect(() => {
		const transcript = speech.interimTranscript;
		if (!transcript || transcript.trim().length === 0) return;

		appState.nextWordIndex = matchWords(transcript, allWords, appState.finalCursor);
	});

}
