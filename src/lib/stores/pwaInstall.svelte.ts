class PwaInstallStore {
	private deferredPrompt = $state<BeforeInstallPromptEvent | null>(null);
	isInstalled = $state(false);

	get canInstall(): boolean {
		return this.deferredPrompt !== null && !this.isInstalled;
	}

	constructor() {
		if (typeof window === 'undefined') return;

		// Detect if already running as installed PWA
		this.isInstalled =
			window.matchMedia('(display-mode: standalone)').matches ||
			navigator.standalone === true;

		// Pick up early-captured event from app.html inline script
		if (window.__pwaInstallPrompt) {
			this.deferredPrompt = window.__pwaInstallPrompt;
			window.__pwaInstallPrompt = null;
		}

		// Listen for future events (e.g. after user dismisses prompt, Chrome may re-fire)
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault();
			this.deferredPrompt = e;
		});

		window.addEventListener('appinstalled', () => {
			this.isInstalled = true;
			this.deferredPrompt = null;
		});
	}

	async promptInstall(): Promise<void> {
		if (!this.deferredPrompt) return;
		await this.deferredPrompt.prompt();
		await this.deferredPrompt.userChoice;
		this.deferredPrompt = null;
	}
}

let pwaInstallStore: PwaInstallStore | undefined;

export function getPwaInstallStore(): PwaInstallStore {
	if (!pwaInstallStore) pwaInstallStore = new PwaInstallStore();
	return pwaInstallStore;
}
