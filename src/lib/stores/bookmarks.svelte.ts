import type { GlobalVerseKey } from '$lib/types';
import { BookmarkService, type Bookmark, type ContinuePosition } from '$lib/services/BookmarkService';

class BookmarkStore {
	bookmarks = $state<Bookmark[]>([]);
	bookmarkedKeys = $state<Set<string>>(new Set());
	continuePosition = $state<ContinuePosition | null>(null);
	continueEnabled = $state(false);
	private service = BookmarkService.getInstance();
	private initialized = false;

	async init(): Promise<void> {
		if (this.initialized) return;
		this.initialized = true;
		await this.service.loadBookmarks();
		this.bookmarks = this.service.getBookmarks();
		this.continuePosition = this.service.getContinuePosition();
		this.continueEnabled = this.service.isContinueEnabled();
		this.rebuildKeySet();
	}

	private rebuildKeySet(): void {
		this.bookmarkedKeys = new Set(this.bookmarks.map(b => b.verseKey));
	}

	async toggleBookmark(verseKey: GlobalVerseKey): Promise<void> {
		if (this.service.isBookmarked(verseKey)) {
			await this.service.removeBookmark(verseKey);
			this.bookmarks = this.service.getBookmarks();
		} else {
			await this.service.addBookmark(verseKey);
			this.bookmarks = this.service.getBookmarks();
		}
		this.rebuildKeySet();
	}

	isBookmarked(verseKey: GlobalVerseKey): boolean {
		return this.bookmarkedKeys.has(verseKey);
	}

	async setContinuePosition(verseKey: GlobalVerseKey, wordIndex: number): Promise<void> {
		await this.service.setContinuePosition(verseKey, wordIndex);
		this.continuePosition = this.service.getContinuePosition();
	}

	getContinuePosition(): ContinuePosition | null {
		return this.continuePosition;
	}

	async setContinueEnabled(enabled: boolean): Promise<void> {
		await this.service.setContinueEnabled(enabled);
		this.continueEnabled = enabled;
	}

	getContinueEnabled(): boolean {
		return this.continueEnabled;
	}
}

let bookmarkStore: BookmarkStore | undefined;

export function getBookmarkStore(): BookmarkStore {
	if (!bookmarkStore) {
		bookmarkStore = new BookmarkStore();
	}
	return bookmarkStore;
}
