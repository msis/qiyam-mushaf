import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { QuranData, GlobalVerseKey } from '$lib/types';
import {
	DB_NAME,
	DB_VERSION,
	CACHE_STORE,
	BOOKMARKS_STORE,
	CONTINUE_STORE,
	SETTINGS_STORE,
} from '$lib/utils/constants';

export interface Bookmark {
	verseKey: GlobalVerseKey;
	createdAt: number;
}

export interface ContinuePosition {
	id: 'continue';
	verseKey: GlobalVerseKey;
	updatedAt: number;
}

export interface AppSettings {
	id: 'settings';
	continueEnabled: boolean;
}

export interface QiyamDB extends DBSchema {
	cache: {
		key: string;
		value: QuranData;
	};
	bookmarks: {
		key: GlobalVerseKey;
		value: Bookmark;
	};
	continue: {
		key: string;
		value: ContinuePosition;
	};
	settings: {
		key: string;
		value: AppSettings;
	};
}

let dbPromise: Promise<IDBPDatabase<QiyamDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<QiyamDB>> {
	if (!dbPromise) {
		dbPromise = openDB<QiyamDB>(DB_NAME, DB_VERSION, {
			upgrade(db) {
				if (!db.objectStoreNames.contains(CACHE_STORE)) {
					db.createObjectStore(CACHE_STORE);
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
			},
		});
	}
	return dbPromise;
}
