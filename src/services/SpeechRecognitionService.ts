import type { SpeechRecognitionCallbacks, SpeechRecognitionConfig, RecognitionStatus, SpeechRecognitionResult } from '../types';
import { LANGUAGE_CODE } from '../utils/constants';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export class SpeechRecognitionService {
  private static instance: SpeechRecognitionService;
  private recognition: any = null;
  private isListening = false;
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

  private initializeRecognition(): void {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      throw new Error('Speech recognition is not supported in this browser');
    }

    this.recognition = new SpeechRecognition();
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    if (!this.recognition) return;

    this.recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result: SpeechRecognitionResult = {
          transcript: event.results[i][0].transcript,
          confidence: event.results[i][0].confidence,
          isFinal: event.results[i].isFinal
        };
        this.callbacks.onResult?.(result);
      }
    };

    this.recognition.onerror = (event: any) => {
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

    const defaultConfig: SpeechRecognitionConfig = {
      language: LANGUAGE_CODE,
      continuous: true,
      interimResults: true
    };

    const finalConfig = { ...defaultConfig, ...config };

    this.recognition.lang = finalConfig.language;
    this.recognition.continuous = finalConfig.continuous;
    this.recognition.interimResults = finalConfig.interimResults;

    this.recognition.start();
  }

  stop(): void {
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
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }
}
