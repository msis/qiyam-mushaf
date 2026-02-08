import { SpeechRecognitionService } from '$lib/services/SpeechRecognitionService';
import type { RecognitionStatus, SpeechRecognitionResult } from '$lib/types';

/**
 * Reactive wrapper around SpeechRecognitionService.
 * Exposes speech recognition state as reactive properties for UI binding.
 */
class SpeechStore {
	private service: SpeechRecognitionService;

	// Reactive state for UI
	status = $state<RecognitionStatus>('idle');
	transcript = $state('');
	lastResult = $state<SpeechRecognitionResult | null>(null);
	errorMessage = $state<string | null>(null);

	constructor(service?: SpeechRecognitionService) {
		this.service = service ?? SpeechRecognitionService.getInstance();
		this.setupCallbacks();
	}

	private setupCallbacks(): void {
		this.service.on({
			onResult: (result) => {
				this.transcript = result.transcript;
				this.lastResult = result;
			},
			onStart: () => {
				this.status = 'listening';
				this.transcript = '';
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
		this.transcript = '';
		this.lastResult = null;
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
