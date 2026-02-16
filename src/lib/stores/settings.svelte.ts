class SettingsStore {
	verseFontSize = $state(28);

	constructor() {
		if (typeof window === 'undefined') return;
		const stored = window.localStorage.getItem('verseFontSize');
		if (!stored) return;
		const size = Number(stored);
		if (!Number.isNaN(size)) this.verseFontSize = size;
	}

	setVerseFontSize(size: number): void {
		this.verseFontSize = size;
		if (typeof window !== 'undefined') {
			window.localStorage.setItem('verseFontSize', String(size));
		}
	}
}

let settingsStore: SettingsStore | undefined;

export function getSettingsStore(): SettingsStore {
	if (!settingsStore) settingsStore = new SettingsStore();
	return settingsStore;
}
