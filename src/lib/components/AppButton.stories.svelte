<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import AppButton from '$lib/components/AppButton.svelte';

	const { Story } = defineMeta({
		title: 'Components/AppButton',
		component: AppButton
	});
</script>

<Story
	name="Default"
	args={{
		ariaLabel: 'Open bookmarks',
		icon: () => ({
			$$render: () =>
				'<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>'
		})
	}}
>
	App Button
</Story>

<Story
	name="With Additional Props"
	args={{
		ariaLabel: 'Send feedback',
		title: 'Send feedback',
		onclick: () => console.log('AppButton clicked'),
		icon: () => ({
			$$render: () =>
				'<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C9.886 15.535 12.119 17 14.67 17c.259 0 .516-.014.769-.041l1.62 1.227a1 1 0 001.61-.84l-.016-2.064a7.486 7.486 0 001.33-4.234C19.983 6.492 16.01 3 11.08 3 6.045 3 2 6.574 2 11.114c0 4.043 3.21 7.4 7.412 7.858" /></svg>'
		})
	}}
>
	Feedback (WhatsApp)
</Story>
