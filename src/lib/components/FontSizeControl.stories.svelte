<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import FontSizeControl from '$lib/components/FontSizeControl.svelte';

	const { Story } = defineMeta({
		title: 'Components/FontSizeControl',
		component: FontSizeControl
	});
</script>

<Story
	name="Default"
	args={{
		value: 28,
		onChange: () => console.log('font size change')
	}}
/>

<Story
	name="CompactRange"
	args={{
		label: 'Caption size',
		value: 16,
		baseSize: 16,
		minScale: 0.75,
		maxScale: 1.25,
		step: 0.1,
		onChange: () => console.log('font size change')
	}}
/>
