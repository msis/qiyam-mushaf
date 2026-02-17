import { DB_NAME, DB_VERSION, STORE_NAME, BOOKMARKS_STORE, CONTINUE_STORE, SETTINGS_STORE } from '$lib/utils/constants';

let dbPromise: Promise<IDBDatabase> | null = null;

export async function openDatabase(): Promise<IDBDatabase> {
	if (dbPromise) return dbPromise;

	dbPromise = new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => resolve(request.result);

		request.onupgradeneeded = () => {
			const db = request.result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME);
			}
			if (!db.objectStoreNames.contains(BOOKMARKS_STORE)) {
				db.createObjectStore(BOOKMARKS_STORE, { keyPath: 'verseKey' });
			}
			if (!db.objectStoreNames.contains(CONTINUE_STORE)) {
				db.createObjectStore(CONTINUE_STORE, { keyPath: 'id' });
			}
			if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
				db.createObjectStore(SETTINGS_STORE, { keyPath: 'id' });
			}
		};
	});

	return dbPromise;
}

export { STORE_NAME, BOOKMARKS_STORE, CONTINUE_STORE, SETTINGS_STORE };
