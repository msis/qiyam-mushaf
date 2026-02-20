import type { Locale, LocaleInfo } from './types';

export const SUPPORTED_LOCALES: LocaleInfo[] = [
	{ code: 'en', nativeName: 'English', rtl: false },
	{ code: 'ar', nativeName: 'العربية', rtl: true },
	{ code: 'fr', nativeName: 'Français', rtl: false },
	{ code: 'es', nativeName: 'Español', rtl: false },
	{ code: 'id', nativeName: 'Bahasa Indonesia', rtl: false },
	{ code: 'tr', nativeName: 'Türkçe', rtl: false },
	{ code: 'ur', nativeName: 'اردو', rtl: true },
	{ code: 'ms', nativeName: 'Bahasa Melayu', rtl: false },
	{ code: 'bn', nativeName: 'বাংলা', rtl: false },
	{ code: 'so', nativeName: 'Soomaali', rtl: false },
];

const RTL_LOCALES: ReadonlySet<Locale> = new Set(
	SUPPORTED_LOCALES.filter((l) => l.rtl).map((l) => l.code)
);

export function isRtlLocale(locale: Locale): boolean {
	return RTL_LOCALES.has(locale);
}
