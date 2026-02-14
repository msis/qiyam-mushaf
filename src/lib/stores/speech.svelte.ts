import { SpeechRecognitionService } from '$lib/services/SpeechRecognitionService';
import type { RecognitionStatus } from '$lib/types';

/**
 * Reactive wrapper around SpeechRecognitionService.
 * Exposes separate final/interim transcript state for UI binding.
 *
 * Final transcripts are committed by the speech engine (won't change).
 * Interim transcripts are the engine's current best guess (replaced each event).
 */
class SpeechStore {
	private service: SpeechRecognitionService;

	status = $state<RecognitionStatus>('idle');
	finalTranscript = $state('');
	interimTranscript = $state('');
	errorMessage = $state<string | null>(null);

	constructor(service?: SpeechRecognitionService) {
		this.service = service ?? SpeechRecognitionService.getInstance();
		this.setupCallbacks();
	}

	private setupCallbacks(): void {
		this.service.on({
			onResult: (finalTranscript, interimTranscript) => {
				if (finalTranscript) this.finalTranscript = finalTranscript;
				this.interimTranscript = interimTranscript;
			},
			onStart: () => {
				this.status = 'listening';
				this.errorMessage = null;
			},
			onEnd: () => {
				this.status = 'stopped';
			},
			onError: (error) => {
				this.status = 'error';
				this.errorMessage = error.message;
			}
		});
	}

	start(): void {
		this.finalTranscript = '';
		this.interimTranscript = '';
		this.service.start();
	}

	stop(): void {
		this.service.stop();
		this.status = 'stopped';
	}

	toggle(): void {
		if (this.status === 'listening') {
			this.stop();
		} else {
			this.start();
		}
	}

	reset(): void {
		this.finalTranscript = '';
		this.interimTranscript = '';
		this.errorMessage = null;
	}

	isSupported(): boolean {
		return this.service.isSupported();
	}

	get isListening(): boolean {
		return this.status === 'listening';
	}
}

// Singleton instance
let speechStoreInstance: SpeechStore | null = null;

export function getSpeechStore(): SpeechStore {
	if (!speechStoreInstance) {
		speechStoreInstance = new SpeechStore();
	}
	return speechStoreInstance;
}

// Factory function for testing (creates fresh instances with optional mock service)
export function createSpeechStore(service?: SpeechRecognitionService): SpeechStore {
	return new SpeechStore(service);
}
