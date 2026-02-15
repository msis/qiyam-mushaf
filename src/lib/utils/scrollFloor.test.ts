import { describe, expect, it } from 'vitest';

/**
 * Standalone replica of the scroll-floor logic inlined in +page.svelte.
 * Two variables, two guards — no factory, no high-water bookkeeping.
 *
 * This exists purely to verify every edge case the old scrollGate covered
 * still holds under the simplified implementation.
 */
type Key = `${number}:${number}`;
const k = (s: number, v: number): Key => `${s}:${v}`;

function createFloor(initial = 0) {
	let floor = initial;
	let lastKey: Key | null = null;

	function shouldScroll(key: Key, idx: number): boolean {
		if (key === lastKey) return false;
		if (idx < floor) return false;
		floor = idx;
		lastKey = key;
		return true;
	}

	function reset(idx: number): void {
		floor = idx;
		lastKey = null;
	}

	return { shouldScroll, reset };
}

// ── Core scroll gating ──────────────────────────────────────────────

describe('scroll floor — core', () => {
	it('scrolls on initial verse', () => {
		const { shouldScroll } = createFloor();
		expect(shouldScroll(k(1, 1), 0)).toBe(true);
	});

	it('skips when verse key unchanged', () => {
		const { shouldScroll } = createFloor();
		shouldScroll(k(1, 1), 0);
		expect(shouldScroll(k(1, 1), 1)).toBe(false);
		expect(shouldScroll(k(1, 1), 2)).toBe(false);
	});

	it('scrolls forward on verse change', () => {
		const { shouldScroll } = createFloor();
		shouldScroll(k(1, 1), 0);
		expect(shouldScroll(k(1, 2), 5)).toBe(true);
	});

	it('blocks backward scroll from interim oscillation', () => {
		const { shouldScroll } = createFloor();
		expect(shouldScroll(k(1, 2), 5)).toBe(true);
		// Interim drops back — blocked
		expect(shouldScroll(k(1, 1), 4)).toBe(false);
	});

	it('blocks repeated oscillation across boundary', () => {
		const { shouldScroll } = createFloor();
		shouldScroll(k(1, 1), 0);

		expect(shouldScroll(k(1, 2), 5)).toBe(true);  // cross into verse 2
		expect(shouldScroll(k(1, 1), 4)).toBe(false);  // drop back
		expect(shouldScroll(k(1, 2), 5)).toBe(false);  // re-cross same key
		expect(shouldScroll(k(1, 2), 6)).toBe(false);  // advance within same key
	});

	it('allows forward scroll after final commits (same key skipped, new key scrolls)', () => {
		const { shouldScroll } = createFloor();
		shouldScroll(k(1, 1), 0);

		// Final commits at idx=5, verse stays same → same key, skip
		expect(shouldScroll(k(1, 1), 5)).toBe(false);

		// Next interim crosses to verse 2 → new key, forward → scroll
		expect(shouldScroll(k(1, 2), 8)).toBe(true);
	});

	it('continues forward scrolling across multiple verses', () => {
		const { shouldScroll } = createFloor();
		expect(shouldScroll(k(1, 1), 0)).toBe(true);
		expect(shouldScroll(k(1, 2), 5)).toBe(true);
		expect(shouldScroll(k(1, 3), 12)).toBe(true);
		expect(shouldScroll(k(1, 4), 20)).toBe(true);
	});

	it('final catching up without extra scroll', () => {
		const { shouldScroll } = createFloor();
		shouldScroll(k(1, 2), 5);

		// Final catches up — same verse, no scroll
		expect(shouldScroll(k(1, 2), 5)).toBe(false);

		// Continue reading into verse 3
		expect(shouldScroll(k(1, 3), 12)).toBe(true);
	});

	it('preserves floor when final commits (idx drops below floor)', () => {
		const { shouldScroll } = createFloor();
		// Interim scrolls to idx=10
		shouldScroll(k(1, 3), 10);

		// Final commits, idx drops to 8 — floor stays at 10
		expect(shouldScroll(k(1, 2), 8)).toBe(false);

		// Advancing past floor works
		expect(shouldScroll(k(1, 4), 15)).toBe(true);
	});

	it('starts from non-zero initial floor (bookmark resume)', () => {
		const { shouldScroll } = createFloor(500);

		expect(shouldScroll(k(2, 50), 500)).toBe(true);   // initial render
		expect(shouldScroll(k(2, 51), 510)).toBe(true);   // forward
		expect(shouldScroll(k(2, 50), 505)).toBe(false);  // backward blocked
	});
});

// ── Final-behind-interim scenarios ──────────────────────────────────

describe('scroll floor — final commits behind interim', () => {
	it('final behind interim does not snap backward', () => {
		const { shouldScroll } = createFloor();
		expect(shouldScroll(k(1, 2), 8)).toBe(true);   // interim at 8

		// Final commits at 5 (behind floor=8) → blocked
		expect(shouldScroll(k(1, 1), 5)).toBe(false);
	});

	it('final behind interim preserves floor for next interim', () => {
		const { shouldScroll } = createFloor();
		shouldScroll(k(1, 3), 15);             // interim to verse 3, floor=15

		shouldScroll(k(1, 2), 10);             // final commits at 10 → blocked (10 < 15)

		expect(shouldScroll(k(1, 2), 12)).toBe(false);  // interim still behind floor
		expect(shouldScroll(k(1, 3), 15)).toBe(false);  // same key as last scroll
		expect(shouldScroll(k(1, 4), 20)).toBe(true);   // past floor → scrolls
	});

	it('final advancing past floor still scrolls forward', () => {
		const { shouldScroll } = createFloor();
		shouldScroll(k(1, 2), 8);              // floor=8

		// Final commits big chunk (idx=20, past floor)
		expect(shouldScroll(k(1, 4), 20)).toBe(true);
	});
});

// ── Reset (manual navigation) ───────────────────────────────────────

describe('scroll floor — reset (user navigation)', () => {
	it('reset allows backward scroll', () => {
		const { shouldScroll, reset } = createFloor();
		shouldScroll(k(1, 2), 5);

		reset(0);
		expect(shouldScroll(k(1, 1), 0)).toBe(true);
	});

	it('reset allows scroll to index below old floor', () => {
		const { shouldScroll, reset } = createFloor();
		shouldScroll(k(1, 3), 15);             // floor=15

		reset(8);
		expect(shouldScroll(k(1, 2), 8)).toBe(true);
	});

	it('reset from far ahead allows scroll to any position', () => {
		const { shouldScroll, reset } = createFloor();
		shouldScroll(k(2, 1), 50);

		reset(0);
		expect(shouldScroll(k(1, 1), 0)).toBe(true);
	});

	it('reset clears lastKey so same verse can re-scroll', () => {
		const { shouldScroll, reset } = createFloor();
		shouldScroll(k(1, 5), 20);

		reset(20);
		expect(shouldScroll(k(1, 5), 20)).toBe(true);
	});

	it('non-zero initial floor allows navigation elsewhere after reset', () => {
		const { shouldScroll, reset } = createFloor(500);
		shouldScroll(k(2, 50), 500);

		reset(0);
		expect(shouldScroll(k(1, 1), 0)).toBe(true);
	});
});
