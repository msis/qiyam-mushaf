import { getSettingsStore } from '$lib/stores/settings.svelte';
import { translations } from './translations';
import type { TranslationStrings } from './types';

export type { Locale, LocaleInfo, TranslationStrings } from './types';
export { SUPPORTED_LOCALES, isRtlLocale } from './locales';

/**
 * Reactive translation function. Reads settingsStore.locale ($state),
 * so any template expression using t() auto-re-renders on locale change.
 *
 * Supports placeholder interpolation: t('nav.goTo', { surah: 2, verse: 255 })
 */
export function t(
	key: keyof TranslationStrings,
	params?: Record<string, string | number>
): string {
	const store = getSettingsStore();
	const strings = translations[store.locale] ?? translations.en;
	let result = strings[key] ?? translations.en[key] ?? key;

	if (params) {
		for (const [param, value] of Object.entries(params)) {
			result = result.replaceAll(`{${param}}`, String(value));
		}
	}

	return result;
}

const SPEECH_ERROR_KEYS: Record<string, keyof TranslationStrings> = {
	'no-speech': 'speech.noSpeech',
	'audio-capture': 'speech.noMicrophone',
	'not-allowed': 'speech.accessDenied',
	'network': 'speech.networkError',
	'aborted': 'speech.aborted',
	'not-available': 'speech.notAvailable',
};

/**
 * Non-reactive speech error translator for use inside SpeechRecognitionService.
 * Takes the error code string and returns the translated message.
 */
export function translateSpeechError(errorCode: string): string {
	const key = SPEECH_ERROR_KEYS[errorCode];
	if (key) return t(key);
	return errorCode || t('speech.unknownError');
}
