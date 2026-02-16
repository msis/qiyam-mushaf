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
		min: 12,
		max: 24,
		step: 2,
		onChange: () => console.log('font size change')
	}}
/>
