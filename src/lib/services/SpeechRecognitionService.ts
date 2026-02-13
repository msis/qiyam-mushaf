import type {
	SpeechRecognitionCallbacks,
	SpeechRecognitionConfig,
	RecognitionStatus
} from '$lib/types';
import { LANGUAGE_CODE } from '$lib/utils/constants';

// Type definitions for Web Speech API
// Using 'any' for the recognition instance to avoid conflicts with lib.dom.d.ts
type SpeechRecognitionInstance = {
	lang: string;
	continuous: boolean;
	interimResults: boolean;
	start(): void;
	stop(): void;
	abort(): void;
	onresult: ((event: SpeechRecognitionEventType) => void) | null;
	onerror: ((event: SpeechRecognitionErrorEventType) => void) | null;
	onend: (() => void) | null;
	onstart: (() => void) | null;
};

interface SpeechRecognitionEventType {
	resultIndex: number;
	results: {
		length: number;
		[index: number]: {
			isFinal: boolean;
			[index: number]: {
				transcript: string;
				confidence: number;
			};
		};
	};
}

interface SpeechRecognitionErrorEventType {
	error: string;
}

export class SpeechRecognitionService {
	private static instance: SpeechRecognitionService | undefined;
	private recognition: SpeechRecognitionInstance | null = null;
	private isListening = false;
	private shouldContinue = false;
	private callbacks: SpeechRecognitionCallbacks = {};

	private constructor() {
		this.initializeRecognition();
	}

	static getInstance(): SpeechRecognitionService {
		if (!SpeechRecognitionService.instance) {
			SpeechRecognitionService.instance = new SpeechRecognitionService();
		}
		return SpeechRecognitionService.instance;
	}

	static resetInstance(): void {
		SpeechRecognitionService.instance = undefined;
	}

	private initializeRecognition(): void {
		if (typeof window === 'undefined') return;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

		if (!SpeechRecognitionClass) {
			console.warn('Speech recognition is not supported in this browser');
			return;
		}

		this.recognition = new SpeechRecognitionClass() as SpeechRecognitionInstance;
		this.setupEventHandlers();
	}

	private setupEventHandlers(): void {
		if (!this.recognition) return;

		this.recognition.onresult = (event: SpeechRecognitionEventType) => {
			let finalTranscript = '';
			let interimTranscript = '';

			for (let i = event.resultIndex; i < event.results.length; i++) {
				const transcript = event.results[i][0].transcript;
				if (event.results[i].isFinal) {
					finalTranscript += transcript;
				} else {
					interimTranscript += transcript;
				}
			}

			this.callbacks.onResult?.(finalTranscript, interimTranscript);
		};

		this.recognition.onerror = (event: SpeechRecognitionErrorEventType) => {
			this.isListening = false;

			let errorMessage = 'Speech recognition error';

			switch (event.error) {
				case 'no-speech':
					errorMessage = 'No speech detected';
					break;
				case 'audio-capture':
					errorMessage = 'No microphone detected';
					break;
				case 'not-allowed':
					errorMessage = 'Microphone access denied';
					break;
				case 'network':
					errorMessage = 'Network error';
					break;
				case 'aborted':
					errorMessage = 'Speech recognition aborted';
					break;
				default:
					errorMessage = event.error || 'Unknown error';
			}

			const error = new Error(errorMessage);
			this.callbacks.onError?.(error);
		};

		this.recognition.onend = () => {
			this.isListening = false;
			this.callbacks.onEnd?.();
			// Auto-restart: Chrome's speech API stops spontaneously after silence
			// or internal timeouts. Restart seamlessly if not explicitly stopped.
			if (this.shouldContinue && this.recognition) {
				try {
					this.recognition.start();
				} catch {
					// Already running or disposed — ignore
				}
			}
		};

		this.recognition.onstart = () => {
			this.isListening = true;
			this.callbacks.onStart?.();
		};
	}

	start(config?: Partial<SpeechRecognitionConfig>): void {
		if (this.isListening) {
			return;
		}

		if (!this.recognition) {
			this.initializeRecognition();
		}

		if (!this.recognition) {
			this.callbacks.onError?.(new Error('Speech recognition not available'));
			return;
		}

		const defaultConfig: SpeechRecognitionConfig = {
			language: LANGUAGE_CODE,
			continuous: true,
			interimResults: true
		};

		const finalConfig = { ...defaultConfig, ...config };

		this.recognition.lang = finalConfig.language;
		this.recognition.continuous = finalConfig.continuous;
		this.recognition.interimResults = finalConfig.interimResults;

		this.shouldContinue = true;
		this.recognition.start();
	}

	stop(): void {
		this.shouldContinue = false;
		if (!this.recognition || !this.isListening) {
			return;
		}

		this.recognition.stop();
	}

	getStatus(): RecognitionStatus {
		if (!this.recognition) {
			return 'error';
		}
		if (this.isListening) {
			return 'listening';
		}
		return 'idle';
	}

	on(callbacks: SpeechRecognitionCallbacks): void {
		this.callbacks = { ...this.callbacks, ...callbacks };
	}

	off(callback: keyof SpeechRecognitionCallbacks): void {
		delete this.callbacks[callback];
	}

	isSupported(): boolean {
		if (typeof window === 'undefined') return false;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
	}
}
