import type { TranslationStrings } from '../types';

export const ar: TranslationStrings = {
	'app.title': 'مصحف القيام',
	'app.description': 'اقرأ المصحف مع تمييز الكلمات بالتعرف على الصوت أثناء قيامك',

	'settings.title': 'الإعدادات',
	'settings.fontSize': 'حجم خط الآيات',
	'settings.continueWhereLeftOff': 'تابع من حيث توقفت',
	'settings.bookmarks': 'العلامات المرجعية',
	'settings.installApp': 'تثبيت التطبيق',
	'settings.appInstalled': 'التطبيق مُثبّت',
	'settings.installGuide': 'تعليمات التثبيت',
	'settings.feedback': 'ملاحظات (WhatsApp)',
	'settings.support': 'الدعم (WhatsApp)',
	'settings.acknowledgments': 'شكر وتقدير',
	'settings.language': 'اللغة',

	'nav.openNavigation': 'فتح التنقل',
	'nav.navigateToVerse': 'الانتقال إلى آية',
	'nav.surah': 'السورة',
	'nav.verse': 'الآية',
	'nav.goTo': 'الذهاب إلى {surah}:{verse}',
	'nav.verseNumber': 'الآية {number}',

	'bookmarks.title': 'العلامات المرجعية',
	'bookmarks.empty': 'لا توجد علامات مرجعية بعد',
	'bookmarks.emptyHint': 'انقر على أيقونة العلامة المرجعية لحفظ آية',
	'bookmarks.add': 'إضافة علامة مرجعية',
	'bookmarks.remove': 'إزالة العلامة المرجعية',
	'bookmarks.verseAriaLabel': '{surah} الآية {verse}، اضغط حذف للإزالة',

	'record.start': 'بدء التسجيل',
	'record.stop': 'إيقاف التسجيل',

	'surah.verses': '{count} آيات',

	'error.pageNotFound': 'الصفحة غير موجودة',
	'error.serverError': 'خطأ في الخادم',
	'error.somethingWentWrong': 'حدث خطأ ما',
	'error.pageNotFoundMessage': 'الصفحة التي تبحث عنها غير موجودة.',
	'error.unexpectedError': 'حدث خطأ غير متوقع.',
	'error.returnHome': 'العودة للرئيسية',

	'pwa.updating': 'جارٍ التحديث\u2026',
	'pwa.newVersionAvailable': 'يتوفر إصدار جديد \u2014 أعد التحميل',

	'acknowledgments.title': 'شكر وتقدير',
	'acknowledgments.prayer': 'ندعو الله \uFDFB أن يكتب النجاح لهذا المشروع وأن يجعله نافعًا لكل من يستخدمه.',
	'acknowledgments.inspiredBy': 'هذا المشروع مستوحى من:',
	'acknowledgments.tarteel': 'هذا المشروع هو في الأساس نسخة مبسطة (للمتابعة فقط) من Tarteel AI، وهو تطبيق أكثر تطورًا وغنى بالميزات لمصاحبة القرآن وحفظه. يُرجى استخدام Tarteel للحفظ والميزات المتقدمة.',
	'acknowledgments.tanzil': 'نص القرآن الكريم مأخوذ من Tanzil.',
	'acknowledgments.teleprompter': 'هذا مشروع رائع ألهم بعض الحلول التقنية في هذا المشروع.',
	'acknowledgments.quranMajeed': 'ميزة حفظ العلامات المرجعية وموضع القراءة الأخير مستوحاة من تطبيق QuranMajeed.',
	'acknowledgments.speechApi': 'التعرف على الصوت مدعوم بواسطة Web Speech API.',

	'installGuide.title': 'تثبيت التطبيق',
	'installGuide.intro': 'تثبيت التطبيق يمنحك تجربة تطبيق أصلي، ووصولًا بدون إنترنت، وأيقونة على الشاشة الرئيسية.',
	'installGuide.safari.title': 'Safari (iOS / iPadOS / macOS)',
	'installGuide.safari.step1': 'اضغط على زر المشاركة (\u25A1\u2191).',
	'installGuide.safari.step2': 'مرر لأسفل واضغط على "إضافة إلى الشاشة الرئيسية".',
	'installGuide.chromeAndroid.title': 'Chrome / Edge (Android)',
	'installGuide.chromeAndroid.step1': 'اضغط على قائمة المتصفح (\u22EE).',
	'installGuide.chromeAndroid.step2': 'اختر "إضافة إلى الشاشة الرئيسية" أو "تثبيت التطبيق".',
	'installGuide.chromeDesktop.title': 'Chrome / Edge (Desktop)',
	'installGuide.chromeDesktop.instruction': 'انقر على أيقونة التثبيت في شريط العنوان، أو افتح قائمة المتصفح (\u22EE) واختر "تثبيت Qiyam Mushaf".',
	'installGuide.other.title': 'متصفحات أخرى',
	'installGuide.other.instruction': 'لا تدعم جميع المتصفحات تثبيت تطبيقات PWA. إذا لم تجد خيار التثبيت، جرّب استخدام Chrome أو Safari أو Edge أو Firefox.',

	'fontSize.decrease': 'تصغير حجم الخط',
	'fontSize.increase': 'تكبير حجم الخط',

	'verse.bookmarked': 'محفوظة',

	'common.close': 'إغلاق',

	'speech.error': 'خطأ في التعرف على الصوت',
	'speech.noSpeech': 'لم يتم اكتشاف كلام',
	'speech.noMicrophone': 'لم يتم اكتشاف ميكروفون',
	'speech.accessDenied': 'تم رفض الوصول إلى الميكروفون',
	'speech.networkError': 'خطأ في الشبكة',
	'speech.aborted': 'تم إلغاء التعرف على الصوت',
	'speech.unknownError': 'خطأ غير معروف',
	'speech.notAvailable': 'التعرف على الصوت غير متاح',
};
