import type { Locale } from '$lib/i18n/types';
import { SUPPORTED_LOCALES, isRtlLocale } from '$lib/i18n/locales';

class SettingsStore {
	verseFontSize = $state(28);
	locale = $state<Locale>('en');

	constructor() {
		if (typeof window === 'undefined') return;

		const storedSize = window.localStorage.getItem('verseFontSize');
		if (storedSize) {
			const size = Number(storedSize);
			if (!Number.isNaN(size)) this.verseFontSize = size;
		}

		const storedLocale = window.localStorage.getItem('locale');
		if (storedLocale && isValidLocale(storedLocale)) {
			this.locale = storedLocale;
			applyLocaleToDocument(storedLocale);
		}
	}

	setVerseFontSize(size: number): void {
		this.verseFontSize = size;
		if (typeof window !== 'undefined') {
			window.localStorage.setItem('verseFontSize', String(size));
		}
	}

	setLocale(locale: Locale): void {
		this.locale = locale;
		if (typeof window !== 'undefined') {
			window.localStorage.setItem('locale', locale);
			applyLocaleToDocument(locale);
		}
	}
}

const VALID_LOCALES: Set<string> = new Set(SUPPORTED_LOCALES.map((l) => l.code));

function isValidLocale(value: string): value is Locale {
	return VALID_LOCALES.has(value);
}

function applyLocaleToDocument(locale: Locale): void {
	const doc = document.documentElement;
	doc.lang = locale;
	doc.dir = isRtlLocale(locale) ? 'rtl' : 'ltr';
}

let settingsStore: SettingsStore | undefined;

export function getSettingsStore(): SettingsStore {
	if (!settingsStore) settingsStore = new SettingsStore();
	return settingsStore;
}
