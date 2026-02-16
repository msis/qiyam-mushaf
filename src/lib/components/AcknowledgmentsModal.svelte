<script lang="ts">
	interface Props {
		onClose: () => void;
	}

	let { onClose }: Props = $props();

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
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
	onclick={handleBackdropClick}
	role="dialog"
	aria-modal="true"
	aria-labelledby="modal-title"
	tabindex="-1"
>
	<div class="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-700">
		<div class="flex justify-between items-center mb-6">
			<h2 id="modal-title" class="text-xl font-bold text-amber-100">Acknowledgments</h2>
			<button
				onclick={onClose}
				class="text-gray-400 hover:text-white text-2xl leading-none w-8 h-8 flex items-center justify-center rounded hover:bg-gray-700"
			>
				&times;
			</button>
		</div>

		<div class="text-amber-100 space-y-4">
			<p>
				This Quran Teleprompter app uses the Quran text from the
				<a
					href="https://quran.com"
					target="_blank"
					rel="noopener noreferrer"
					class="text-amber-400 hover:text-amber-300 underline"
				>
					quran.com
				</a>
				API.
			</p>
			<p>
				The Arabic text is provided in the Uthmani script with diacritics for accurate
				pronunciation.
			</p>
			<p class="text-sm text-gray-400">
				Speech recognition powered by the Web Speech API.
			</p>
		</div>

		<button
			onclick={onClose}
			class="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-6"
		>
			Close
		</button>
	</div>
</div>
