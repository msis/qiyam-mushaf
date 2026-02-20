<script lang="ts">
	import { t } from '$lib/i18n';

	interface Props {
		value: number;
		baseSize?: number;
		minScale?: number;
		maxScale?: number;
		step?: number;
		onChange: (value: number) => void;
	}

	let {
		value,
		baseSize = 28,
		minScale = 0.75,
		maxScale = 2,
		step = 0.05,
		onChange
	}: Props = $props();

	let currentScale = $derived(value / baseSize);

	function clampScale(nextScale: number): number {
		return Math.max(minScale, Math.min(maxScale, nextScale));
	}

	function formatScale(scale: number): string {
		const rounded = Math.round(scale * 100) / 100;
		if (Number.isInteger(rounded)) {
			return String(rounded);
		}
		return rounded.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
	}

	function updateScale(nextScale: number): void {
		const clampedScale = clampScale(nextScale);
		onChange(clampedScale * baseSize);
	}

	function decrement(): void {
		updateScale(currentScale - step);
	}

	function increment(): void {
		updateScale(currentScale + step);
	}
</script>

<div class="w-full bg-gray-700/40 border border-gray-700 text-amber-100 font-medium py-3 px-4 rounded-lg">
	<div class="flex items-center justify-between mb-3">
		<span class="text-sm text-amber-200">{t('settings.fontSize')}</span>
		<span class="text-xs text-amber-100">{formatScale(currentScale)}x</span>
	</div>
	<div class="flex items-center gap-3">
		<button
			type="button"
			class="w-9 h-9 rounded-md bg-gray-700 hover:bg-gray-600 text-amber-100"
			onclick={decrement}
			aria-label={t('fontSize.decrease')}
		>
			-
		</button>
		<input
			type="range"
			min={minScale}
			max={maxScale}
			step={step}
			value={currentScale}
			class="flex-1 accent-amber-500"
			oninput={(event: Event) =>
				updateScale(Number((event.currentTarget as HTMLInputElement).value))}
			aria-label={t('settings.fontSize')}
		/>
		<button
			type="button"
			class="w-9 h-9 rounded-md bg-gray-700 hover:bg-gray-600 text-amber-100"
			onclick={increment}
			aria-label={t('fontSize.increase')}
		>
			+
		</button>
	</div>
</div>
