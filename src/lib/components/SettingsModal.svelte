<script lang="ts">
	import { getSettingsStore } from '$lib/stores/settings.svelte';
	interface Props {
		onClose: () => void;
		onOpenAcknowledgments: () => void;
		onOpenBookmarks: () => void;
		continueEnabled?: boolean;
		onToggleContinue: (enabled: boolean) => void;
		bookmarkCount?: number;
	}

	const settingsStore = getSettingsStore();

	let { 
		onClose, 
		onOpenAcknowledgments, 
		onOpenBookmarks, 
		continueEnabled = true,
		onToggleContinue,
		bookmarkCount = 0 
	}: Props = $props();

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}

	function handleAcknowledgments() {
		onClose();
		onOpenAcknowledgments();
	}

	function handleBookmarks() {
		onClose();
		onOpenBookmarks();
	}

	function handleToggle(e?: MouseEvent) {
		if (e && e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
			onToggleContinue(e.target.checked);
		} else {
			onToggleContinue(!continueEnabled);
		}
	}

	function handleToggleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleToggle();
		}
	}

	function updateFontSize(nextSize: number): void {
		const clamped = Math.max(18, Math.min(48, Math.round(nextSize)));
		settingsStore.setVerseFontSize(clamped);
	}

	function decrementFontSize(): void {
		updateFontSize(settingsStore.verseFontSize - 2);
	}

	function incrementFontSize(): void {
		updateFontSize(settingsStore.verseFontSize + 2);
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
	onclick={handleBackdropClick}
	role="dialog"
	aria-modal="true"
	aria-labelledby="modal-title"
	tabindex="-1"
	dir="ltr"
>
	<div class="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-700">
		<div class="flex justify-between items-center mb-6">
			<h2 id="modal-title" class="text-xl font-bold text-amber-100">Settings</h2>
			<button
				onclick={onClose}
				class="text-gray-400 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center rounded hover:bg-gray-700"
			>
				&times;
			</button>
		</div>

		<div class="space-y-3">
			<div class="w-full bg-gray-700/40 border border-gray-700 text-amber-100 font-medium py-3 px-4 rounded-lg">
				<div class="flex items-center justify-between mb-3">
					<span class="text-sm text-amber-200">Verse font size</span>
					<span class="text-xs text-amber-100">{settingsStore.verseFontSize}px</span>
				</div>
				<div class="flex items-center gap-3">
					<button
						type="button"
						class="w-9 h-9 rounded-md bg-gray-700 hover:bg-gray-600 text-amber-100"
						onclick={decrementFontSize}
						aria-label="Decrease font size"
					>
						-
					</button>
					<input
						type="range"
						min="18"
						max="48"
						step="1"
						value={settingsStore.verseFontSize}
						class="flex-1 accent-amber-500"
						oninput={(event: Event) =>
							updateFontSize(
								Number((event.currentTarget as HTMLInputElement).value)
							)}
						aria-label="Verse font size"
					/>
					<button
						type="button"
						class="w-9 h-9 rounded-md bg-gray-700 hover:bg-gray-600 text-amber-100"
						onclick={incrementFontSize}
						aria-label="Increase font size"
					>
						+
					</button>
				</div>
			</div>
			<div
				class="w-full bg-gray-700 hover:bg-gray-600 text-amber-100 font-medium py-3 px-4 rounded-lg transition-colors text-left flex items-center cursor-pointer"
				onclick={handleToggle}
				onkeydown={handleToggleKeydown}
				role="switch"
				aria-checked={continueEnabled}
				tabindex="0"
			>
				<svg
					class="w-5 h-5 mr-3"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				Continue where you left off
				<span class="ml-auto">
					<span class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
						<input 
							type="checkbox" 
							id="continue-toggle"
							checked={continueEnabled}
							class="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer"
						/>
						<label for="continue-toggle" class="toggle-label block overflow-hidden h-5 rounded-full bg-gray-500 cursor-pointer">
						</label>
					</span>
				</span>
			</div>
			<button
				onclick={handleBookmarks}
				class="w-full bg-gray-700 hover:bg-gray-600 text-amber-100 font-medium py-3 px-4 rounded-lg transition-colors text-left flex items-center"
			>
				<svg
					class="w-5 h-5 mr-3"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
					/>
				</svg>
				Bookmarks
				{#if bookmarkCount > 0}
					<span class="ml-auto bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full">
						{bookmarkCount}
					</span>
				{/if}
			</button>
			<button
				onclick={handleAcknowledgments}
				class="w-full bg-gray-700 hover:bg-gray-600 text-amber-100 font-medium py-3 px-4 rounded-lg transition-colors text-left flex items-center"
			>
				<svg
					class="w-5 h-5 mr-3"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
					/>
				</svg>
				Acknowledgments
			</button>
		</div>
	</div>
</div>

<style>
	.toggle-checkbox:checked {
		right: 0;
		border-color: #f59e0b;
	}
	.toggle-checkbox:checked + .toggle-label {
		background-color: #f59e0b;
	}
</style>
