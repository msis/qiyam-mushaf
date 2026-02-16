import type { GlobalVerseKey } from '$lib/types';
import { BookmarkService, type Bookmark } from '$lib/services/BookmarkService';

class BookmarkStore {
	bookmarks = $state<Bookmark[]>([]);
	bookmarkedKeys = $state<Set<string>>(new Set());
	private service = BookmarkService.getInstance();
	private initialized = false;

	async init(): Promise<void> {
		if (this.initialized) return;
		this.initialized = true;
		const bookmarks = await this.service.loadBookmarks();
		this.bookmarks = bookmarks;
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
}

let bookmarkStore: BookmarkStore | undefined;

export function getBookmarkStore(): BookmarkStore {
	if (!bookmarkStore) {
		bookmarkStore = new BookmarkStore();
	}
	return bookmarkStore;
}
