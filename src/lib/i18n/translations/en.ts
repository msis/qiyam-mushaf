import type { TranslationStrings } from '../types';

export const en: TranslationStrings = {
	'app.title': 'Qiyam Mushaf',
	'app.description': 'Read the Mushaf with speech-recognition highlighting during your qiyam',

	'settings.title': 'Settings',
	'settings.fontSize': 'Verse font size',
	'settings.continueWhereLeftOff': 'Continue where you left off',
	'settings.bookmarks': 'Bookmarks',
	'settings.installApp': 'Install App',
	'settings.appInstalled': 'App Installed',
	'settings.installGuide': 'Installation instructions',
	'settings.feedback': 'Feedback (WhatsApp)',
	'settings.support': 'Support (WhatsApp)',
	'settings.acknowledgments': 'Acknowledgments',
	'settings.contribute': 'Contribute',
	'settings.language': 'Language',

	'nav.openNavigation': 'Open navigation',
	'nav.navigateToVerse': 'Navigate to Verse',
	'nav.surah': 'Surah',
	'nav.verse': 'Verse',
	'nav.goTo': 'Go to {surah}:{verse}',
	'nav.verseNumber': 'Verse {number}',

	'bookmarks.title': 'Bookmarks',
	'bookmarks.empty': 'No bookmarks yet',
	'bookmarks.emptyHint': 'Tap the bookmark icon to save a verse',
	'bookmarks.add': 'Add bookmark',
	'bookmarks.remove': 'Remove bookmark',
	'bookmarks.verseAriaLabel': '{surah} verse {verse}, press Delete to remove',

	'record.start': 'Start recording',
	'record.stop': 'Stop recording',

	'surah.verses': '{count} verses',

	'error.pageNotFound': 'Page Not Found',
	'error.serverError': 'Server Error',
	'error.somethingWentWrong': 'Something Went Wrong',
	'error.pageNotFoundMessage': 'The page you are looking for does not exist.',
	'error.unexpectedError': 'An unexpected error occurred.',
	'error.returnHome': 'Return Home',

	'pwa.updating': 'Updating\u2026',
	'pwa.newVersionAvailable': 'New version available \u2014 Reload',

	'acknowledgments.title': 'Acknowledgments',
	'acknowledgments.prayer': 'We pray to Allah \uFDFB for the success of this project and for it to be beneficial to all who use it.',
	'acknowledgments.inspiredBy': 'This project was inspired by:',
	'acknowledgments.tarteel': 'This project is basically a simpler (follow-along only) version of Tarteel AI, which is a more advanced and feature-rich Quran companion and memorization tool. Please use Tarteel for memorization and more advanced features.',
	'acknowledgments.tanzil': 'The Text of the Quran is from Tanzil.',
	'acknowledgments.teleprompter': 'This is a cool project that inspired some of the technical solutions for this project.',
	'acknowledgments.quranMajeed': 'The bookmarking and saving of last reading position was inspired by the QuranMajeed app.',
	'acknowledgments.speechApi': 'Speech recognition powered by the Web Speech API.',

	'contribute.title': 'Contribute',
	'contribute.intro': 'Qiyam Mushaf is open source! You can help improve it on GitHub.',
	'contribute.starRepo': 'Star the repository to show your support.',
	'contribute.reportIssues': 'Report bugs or suggest features by opening an issue.',
	'contribute.submitPRs': 'Submit pull requests to contribute code improvements.',
	'contribute.thankYou': 'JazakAllahu Khayran for your contributions!',

	'installGuide.title': 'Install App',
	'installGuide.intro': 'Installing the app gives you a native-app experience, offline access and a home screen icon.',
	'installGuide.safari.title': 'Safari (iOS / iPadOS / macOS)',
	'installGuide.safari.step1': 'Tap the Share button (\u25A1\u2191).',
	'installGuide.safari.step2': 'Scroll down and tap "Add to Home Screen".',
	'installGuide.chromeAndroid.title': 'Chrome / Edge (Android)',
	'installGuide.chromeAndroid.step1': 'Tap the browser menu (\u22EE).',
	'installGuide.chromeAndroid.step2': 'Select "Add to Home screen" or "Install app".',
	'installGuide.chromeDesktop.title': 'Chrome / Edge (Desktop)',
	'installGuide.chromeDesktop.instruction': 'Click the install icon in the address bar, or open the browser menu (\u22EE) and choose "Install Qiyam Mushaf".',
	'installGuide.other.title': 'Other Browsers',
	'installGuide.other.instruction': 'Not all browsers support PWA installation. If you don\'t see an install option, try using Chrome, Safari, Edge or Firefox.',

	'fontSize.decrease': 'Decrease font size',
	'fontSize.increase': 'Increase font size',

	'verse.bookmarked': 'Bookmarked',

	'common.close': 'Close',

	'speech.error': 'Speech recognition error',
	'speech.noSpeech': 'No speech detected',
	'speech.noMicrophone': 'No microphone detected',
	'speech.accessDenied': 'Microphone access denied',
	'speech.networkError': 'Network error',
	'speech.aborted': 'Speech recognition aborted',
	'speech.unknownError': 'Unknown error',
	'speech.notAvailable': 'Speech recognition not available',
};
