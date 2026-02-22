export type Locale = 'en' | 'ar' | 'fr' | 'es' | 'id' | 'tr' | 'ur' | 'ms' | 'bn' | 'so';

export interface LocaleInfo {
	code: Locale;
	nativeName: string;
	rtl: boolean;
}

export interface TranslationStrings {
	// App
	'app.title': string;
	'app.description': string;

	// Settings modal
	'settings.title': string;
	'settings.fontSize': string;
	'settings.continueWhereLeftOff': string;
	'settings.bookmarks': string;
	'settings.installApp': string;
	'settings.appInstalled': string;
	'settings.installGuide': string;
	'settings.feedback': string;
	'settings.support': string;
	'settings.acknowledgments': string;
	'settings.contribute': string;
	'settings.language': string;

	// Navigation
	'nav.openNavigation': string;
	'nav.navigateToVerse': string;
	'nav.surah': string;
	'nav.verse': string;
	'nav.goTo': string;
	'nav.verseNumber': string;

	// Bookmarks
	'bookmarks.title': string;
	'bookmarks.empty': string;
	'bookmarks.emptyHint': string;
	'bookmarks.add': string;
	'bookmarks.remove': string;
	'bookmarks.verseAriaLabel': string;

	// Recording
	'record.start': string;
	'record.stop': string;

	// Surah header
	'surah.verses': string;

	// Error page
	'error.pageNotFound': string;
	'error.serverError': string;
	'error.somethingWentWrong': string;
	'error.pageNotFoundMessage': string;
	'error.unexpectedError': string;
	'error.returnHome': string;

	// PWA update
	'pwa.updating': string;
	'pwa.newVersionAvailable': string;

	// Acknowledgments
	'acknowledgments.title': string;
	'acknowledgments.prayer': string;
	'acknowledgments.inspiredBy': string;
	'acknowledgments.tarteel': string;
	'acknowledgments.tanzil': string;
	'acknowledgments.teleprompter': string;
	'acknowledgments.quranMajeed': string;
	'acknowledgments.speechApi': string;

	// Contribute
	'contribute.title': string;
	'contribute.intro': string;
	'contribute.starRepo': string;
	'contribute.reportIssues': string;
	'contribute.submitPRs': string;
	'contribute.thankYou': string;

	// Install guide
	'installGuide.title': string;
	'installGuide.intro': string;
	'installGuide.safari.title': string;
	'installGuide.safari.step1': string;
	'installGuide.safari.step2': string;
	'installGuide.chromeAndroid.title': string;
	'installGuide.chromeAndroid.step1': string;
	'installGuide.chromeAndroid.step2': string;
	'installGuide.chromeDesktop.title': string;
	'installGuide.chromeDesktop.instruction': string;
	'installGuide.other.title': string;
	'installGuide.other.instruction': string;

	// Font size controls
	'fontSize.decrease': string;
	'fontSize.increase': string;

	// Verse
	'verse.bookmarked': string;

	// Common
	'common.close': string;

	// Speech errors
	'speech.error': string;
	'speech.noSpeech': string;
	'speech.noMicrophone': string;
	'speech.accessDenied': string;
	'speech.networkError': string;
	'speech.aborted': string;
	'speech.unknownError': string;
	'speech.notAvailable': string;
}
