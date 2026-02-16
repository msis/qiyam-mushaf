import type { GlobalVerseKey } from '$lib/types';
import { DB_NAME, BOOKMARKS_STORE } from '$lib/utils/constants';

export interface Bookmark {
	verseKey: GlobalVerseKey;
	createdAt: number;
}

const BOOKMARK_DB_NAME = `${DB_NAME}-bookmarks`;
const BOOKMARK_DB_VERSION = 1;

export class BookmarkService {
	private static instance: BookmarkService | undefined;
	private bookmarks: Bookmark[] = [];
	private db: IDBDatabase | null = null;
	private initialized = false;

	private constructor() {}

	static getInstance(): BookmarkService {
		if (!BookmarkService.instance) {
			BookmarkService.instance = new BookmarkService();
		}
		return BookmarkService.instance;
	}

	private async openDB(): Promise<IDBDatabase> {
		if (this.db) return this.db;

		return new Promise((resolve, reject) => {
			const request = indexedDB.open(BOOKMARK_DB_NAME, BOOKMARK_DB_VERSION);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				this.db = request.result;
				resolve(this.db);
			};

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;
				if (!db.objectStoreNames.contains(BOOKMARKS_STORE)) {
					db.createObjectStore(BOOKMARKS_STORE, { keyPath: 'verseKey' });
				}
			};
		});
	}

	async loadBookmarks(): Promise<Bookmark[]> {
		if (this.initialized) {
			return this.bookmarks;
		}

		try {
			const db = await this.openDB();

			const bookmarks = await new Promise<Bookmark[]>((resolve, reject) => {
				const tx = db.transaction(BOOKMARKS_STORE, 'readonly');
				const store = tx.objectStore(BOOKMARKS_STORE);
				const request = store.getAll();

				request.onerror = () => reject(request.error);
				request.onsuccess = () => resolve(request.result || []);
			});

			this.bookmarks = bookmarks.sort((a, b) => b.createdAt - a.createdAt);
			this.initialized = true;
			return this.bookmarks;
		} catch (error) {
			console.error('Error loading bookmarks:', error);
			return [];
		}
	}

	async addBookmark(verseKey: GlobalVerseKey): Promise<boolean> {
		if (this.isBookmarked(verseKey)) {
			return false;
		}

		const bookmark: Bookmark = {
			verseKey,
			createdAt: Date.now()
		};

		try {
			const db = await this.openDB();
			
			await new Promise<void>((resolve, reject) => {
				const tx = db.transaction(BOOKMARKS_STORE, 'readwrite');
				const store = tx.objectStore(BOOKMARKS_STORE);
				const request = store.put(bookmark);

				request.onerror = () => reject(request.error);
				request.onsuccess = () => resolve();
			});

			this.bookmarks = [bookmark, ...this.bookmarks].sort((a, b) => b.createdAt - a.createdAt);
			return true;
		} catch (error) {
			console.error('Error adding bookmark:', error);
			return false;
		}
	}

	async removeBookmark(verseKey: GlobalVerseKey): Promise<boolean> {
		try {
			const db = await this.openDB();
			
			await new Promise<void>((resolve, reject) => {
				const tx = db.transaction(BOOKMARKS_STORE, 'readwrite');
				const store = tx.objectStore(BOOKMARKS_STORE);
				const request = store.delete(verseKey);

				request.onerror = () => reject(request.error);
				request.onsuccess = () => resolve();
			});

			this.bookmarks = this.bookmarks.filter(b => b.verseKey !== verseKey);
			return true;
		} catch (error) {
			console.error('Error removing bookmark:', error);
			return false;
		}
	}

	isBookmarked(verseKey: GlobalVerseKey): boolean {
		return this.bookmarks.some(b => b.verseKey === verseKey);
	}

	getBookmarks(): Bookmark[] {
		return this.bookmarks;
	}
}
