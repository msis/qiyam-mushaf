import type { GlobalVerseKey } from '$lib/types';
import { BOOKMARKS_STORE, CONTINUE_STORE, SETTINGS_STORE } from '$lib/utils/constants';
import { getDB, type Bookmark, type ContinuePosition, type AppSettings } from '$lib/services/db';

export type { Bookmark, ContinuePosition, AppSettings };

export class BookmarkService {
	private static instance: BookmarkService | undefined;
	private bookmarks: Bookmark[] = [];
	private continuePosition: ContinuePosition | null = null;
	private continueEnabled = true;
	private initialized = false;

	private constructor() {}

	static getInstance(): BookmarkService {
		if (!BookmarkService.instance) {
			BookmarkService.instance = new BookmarkService();
		}
		return BookmarkService.instance;
	}

	async loadBookmarks(): Promise<Bookmark[]> {
		if (this.initialized) {
			return this.bookmarks;
		}

		try {
			const db = await getDB();
			const tx = db.transaction([BOOKMARKS_STORE, CONTINUE_STORE, SETTINGS_STORE], 'readonly');

			const [bookmarks, continuePos, settings] = await Promise.all([
				tx.objectStore(BOOKMARKS_STORE).getAll(),
				tx.objectStore(CONTINUE_STORE).get('continue'),
				tx.objectStore(SETTINGS_STORE).get('settings'),
				tx.done,
			]);

			this.bookmarks = bookmarks.sort((a, b) => b.createdAt - a.createdAt);
			this.continuePosition = continuePos ?? null;
			this.continueEnabled = settings?.continueEnabled ?? true;

			this.initialized = true;
			return this.bookmarks;
		} catch (error) {
			console.error('Error loading bookmarks:', error);
			this.initialized = false;
			return [];
		}
	}

	async addBookmark(verseKey: GlobalVerseKey): Promise<boolean> {
		if (this.isBookmarked(verseKey)) {
			return false;
		}

		const bookmark: Bookmark = {
			verseKey,
			createdAt: Date.now(),
		};

		try {
			const db = await getDB();
			await db.put(BOOKMARKS_STORE, bookmark);

			this.bookmarks = [bookmark, ...this.bookmarks].sort(
				(a, b) => b.createdAt - a.createdAt,
			);
			return true;
		} catch (error) {
			console.error('Error adding bookmark:', error);
			return false;
		}
	}

	async removeBookmark(verseKey: GlobalVerseKey): Promise<boolean> {
		try {
			const db = await getDB();
			await db.delete(BOOKMARKS_STORE, verseKey);

			this.bookmarks = this.bookmarks.filter((b) => b.verseKey !== verseKey);
			return true;
		} catch (error) {
			console.error('Error removing bookmark:', error);
			return false;
		}
	}

	isBookmarked(verseKey: GlobalVerseKey): boolean {
		return this.bookmarks.some((b) => b.verseKey === verseKey);
	}

	getBookmarks(): Bookmark[] {
		return this.bookmarks;
	}

	async setContinuePosition(verseKey: GlobalVerseKey): Promise<void> {
		const position: ContinuePosition = {
			id: 'continue',
			verseKey,
			updatedAt: Date.now(),
		};

		try {
			const db = await getDB();
			await db.put(CONTINUE_STORE, position);

			this.continuePosition = position;
		} catch (error) {
			console.error('Error saving continue position:', error);
		}
	}

	getContinuePosition(): ContinuePosition | null {
		return this.continuePosition;
	}

	async setContinueEnabled(enabled: boolean): Promise<void> {
		try {
			const db = await getDB();
			await db.put(SETTINGS_STORE, { id: 'settings', continueEnabled: enabled });

			this.continueEnabled = enabled;
		} catch (error) {
			console.error('Error saving continue enabled:', error);
		}
	}

	isContinueEnabled(): boolean {
		return this.continueEnabled;
	}
}
