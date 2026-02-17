/**
 * Non-standard BeforeInstallPromptEvent fired by Chromium browsers
 * when a PWA meets installability criteria.
 */
interface BeforeInstallPromptEvent extends Event {
	readonly platforms: string[];
	readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
	prompt(): Promise<void>;
}

interface WindowEventMap {
	beforeinstallprompt: BeforeInstallPromptEvent;
	appinstalled: Event;
}

interface Window {
	/** Captured early in app.html before framework hydration. */
	__pwaInstallPrompt?: BeforeInstallPromptEvent | null;
}

interface Navigator {
	/** iOS Safari non-standard property — true when running as a standalone PWA. */
	standalone?: boolean;
}
