// Re-export types
export * from './types';

// Re-export utilities
export * from './utils/constants';
export * from './utils/dataProcessor';
export * from './utils/globalAddressing';
export * from './utils/wordMatcher';

// Re-export services
export { QuranDataService } from './services/QuranDataService';
export { SpeechRecognitionService } from './services/SpeechRecognitionService';
export { GlobalScrollManager } from './services/GlobalScrollManager';
export type { GlobalScrollManagerConfig } from './services/GlobalScrollManager';

// Re-export stores
export { appState, createAppState } from './stores/app.svelte';
export { getQuranStore, createQuranStore } from './stores/quran.svelte';
export { getSpeechStore, createSpeechStore } from './stores/speech.svelte';
export { createScrollStore } from './stores/scroll.svelte';
