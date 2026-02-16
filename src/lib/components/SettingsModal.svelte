<script lang="ts">
	import AppButton from '$lib/components/AppButton.svelte';
	import FontSizeControl from '$lib/components/FontSizeControl.svelte';
	import { getSettingsStore } from '$lib/stores/settings.svelte';
	import { WHATSAPP_FEEDBACK_INVITE, WHATSAPP_SUPPORT_INVITE } from '$lib/utils/constants';
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

	function handleOpenFeedback() {
		onClose();
		if (WHATSAPP_FEEDBACK_INVITE) {
			window.open(WHATSAPP_FEEDBACK_INVITE, '_blank', 'noopener,noreferrer');
		}
	}

	function handleOpenSupport() {
		onClose();
		if (WHATSAPP_SUPPORT_INVITE) {
			window.open(WHATSAPP_SUPPORT_INVITE, '_blank', 'noopener,noreferrer');
		}
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

	function handleFontSizeChange(nextSize: number): void {
		settingsStore.setVerseFontSize(nextSize);
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
	onclick={handleBackdropClick}
	onkeydown={handleKeydown}
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
			<FontSizeControl
				value={settingsStore.verseFontSize}
				onChange={handleFontSizeChange}
			/>
			<button
				type="button"
				class="w-full bg-gray-700 hover:bg-gray-600 text-amber-100 font-medium py-3 px-4 rounded-lg transition-colors text-left flex items-center cursor-pointer"
				onclick={handleToggle}
				onkeydown={handleToggleKeydown}
				role="switch"
				aria-checked={continueEnabled}
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
							aria-hidden="true"
							tabindex="-1"
						/>
						<label for="continue-toggle" class="toggle-label block overflow-hidden h-5 rounded-full bg-gray-500 cursor-pointer">
						</label>
					</span>
				</span>
			</button>
			<AppButton onclick={handleBookmarks} ariaLabel="Open bookmarks">
				{#snippet icon()}
					<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
						/>
					</svg>
				{/snippet}
				Bookmarks
				{#if bookmarkCount > 0}
					<span class="ml-auto bg-amber-600 text-white text-xs px-2 py-0.5 rounded-full">
						{bookmarkCount}
					</span>
				{/if}
			</AppButton>
			{#if WHATSAPP_FEEDBACK_INVITE}
				<AppButton onclick={handleOpenFeedback} ariaLabel="Send feedback on WhatsApp" class="text-amber-100">
					{#snippet icon()}
						<svg class="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8.684 13.342C9.886 15.535 12.119 17 14.67 17c.259 0 .516-.014.769-.041l1.62 1.227a1 1 0 001.61-.84l-.016-2.064a7.486 7.486 0 001.33-4.234C19.983 6.492 16.01 3 11.08 3 6.045 3 2 6.574 2 11.114c0 4.043 3.21 7.4 7.412 7.858"
							/>
						</svg>
					{/snippet}
					Feedback (WhatsApp)
				</AppButton>
			{/if}
			{#if WHATSAPP_SUPPORT_INVITE}
				<AppButton onclick={handleOpenSupport} ariaLabel="Get support on WhatsApp" class="text-amber-100">
					{#snippet icon()}
						<svg class="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9.75 17a7.25 7.25 0 007.25-7.25A7.25 7.25 0 009.75 2.5 7.25 7.25 0 002.5 9.75c0 1.47.446 2.84 1.21 3.98L2 21l7.27-1.69A7.22 7.22 0 009.75 17z"
							/>
						</svg>
					{/snippet}
					Support (WhatsApp)
				</AppButton>
			{/if}
			<AppButton onclick={handleAcknowledgments} ariaLabel="View acknowledgments">
				{#snippet icon()}
					<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
						/>
					</svg>
				{/snippet}
				Acknowledgments
			</AppButton>
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
