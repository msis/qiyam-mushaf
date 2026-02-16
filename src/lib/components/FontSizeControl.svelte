<script lang="ts">
	interface Props {
		label?: string;
		value: number;
		min?: number;
		max?: number;
		step?: number;
		onChange: (value: number) => void;
	}

	let {
		label = 'Verse font size',
		value,
		min = 18,
		max = 48,
		step = 1,
		onChange
	}: Props = $props();

	function clamp(nextValue: number): number {
		return Math.max(min, Math.min(max, Math.round(nextValue)));
	}

	function update(nextValue: number): void {
		onChange(clamp(nextValue));
	}

	function decrement(): void {
		update(value - step);
	}

	function increment(): void {
		update(value + step);
	}
</script>

<div class="w-full bg-gray-700/40 border border-gray-700 text-amber-100 font-medium py-3 px-4 rounded-lg">
	<div class="flex items-center justify-between mb-3">
		<span class="text-sm text-amber-200">{label}</span>
		<span class="text-xs text-amber-100">{value}px</span>
	</div>
	<div class="flex items-center gap-3">
		<button
			type="button"
			class="w-9 h-9 rounded-md bg-gray-700 hover:bg-gray-600 text-amber-100"
			onclick={decrement}
			aria-label="Decrease font size"
		>
			-
		</button>
		<input
			type="range"
			min={min}
			max={max}
			step={step}
			value={value}
			class="flex-1 accent-amber-500"
			oninput={(event: Event) =>
				update(Number((event.currentTarget as HTMLInputElement).value))}
			aria-label={label}
		/>
		<button
			type="button"
			class="w-9 h-9 rounded-md bg-gray-700 hover:bg-gray-600 text-amber-100"
			onclick={increment}
			aria-label="Increase font size"
		>
			+
		</button>
	</div>
</div>
