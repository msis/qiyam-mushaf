import type { GlobalVerseKey } from '$lib/types';
import { BookmarkService, type Bookmark, type ContinuePosition } from '$lib/services/BookmarkService';

class BookmarkStore {
	bookmarks = $state<Bookmark[]>([]);
	bookmarkedKeys = $derived(new Set(this.bookmarks.map(b => b.verseKey)));
	continuePosition = $state<ContinuePosition | null>(null);
	continueEnabled = $state(true);
	private service = BookmarkService.getInstance();
	private initialized = false;

	async init(): Promise<void> {
		if (this.initialized) return;
		this.initialized = true;
		await this.service.loadBookmarks();
		this.bookmarks = this.service.getBookmarks();
		this.continuePosition = this.service.getContinuePosition();
		this.continueEnabled = this.service.isContinueEnabled();
	}

	async toggleBookmark(verseKey: GlobalVerseKey): Promise<void> {
		if (this.service.isBookmarked(verseKey)) {
			await this.service.removeBookmark(verseKey);
		} else {
			await this.service.addBookmark(verseKey);
		}
		this.bookmarks = this.service.getBookmarks();
	}

	isBookmarked(verseKey: GlobalVerseKey): boolean {
		return this.bookmarkedKeys.has(verseKey);
	}

	async setContinuePosition(verseKey: GlobalVerseKey): Promise<void> {
		await this.service.setContinuePosition(verseKey);
		this.continuePosition = this.service.getContinuePosition();
	}

	async setContinueEnabled(enabled: boolean): Promise<void> {
		await this.service.setContinueEnabled(enabled);
		this.continueEnabled = enabled;
	}
}

let bookmarkStore: BookmarkStore | undefined;

export function getBookmarkStore(): BookmarkStore {
	if (!bookmarkStore) {
		bookmarkStore = new BookmarkStore();
	}
	return bookmarkStore;
}
