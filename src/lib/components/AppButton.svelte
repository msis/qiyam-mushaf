<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

type Props = HTMLButtonAttributes & {
		ariaLabel?: string;
		children?: Snippet;
		icon?: Snippet;
	};

	let { ariaLabel = undefined, children, icon, class: className = '', ...rest }: Props = $props();

	const baseClass =
		"w-full bg-gray-700 hover:bg-gray-600 text-amber-100 font-medium py-3 px-4 rounded-lg transition-colors text-left flex items-center";
	const mergedClass = $derived(className ? `${baseClass} ${className}` : baseClass);
</script>

<button type="button" aria-label={ariaLabel} class={mergedClass} {...rest}>
	{@render icon?.()}
	{@render children?.()}
</button>
