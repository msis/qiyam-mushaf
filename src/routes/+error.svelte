<script lang="ts">
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { t } from '$lib/i18n';
</script>

<div class="h-screen bg-gray-900 flex items-center justify-center p-4">
	<div class="text-center max-w-md">
		<div class="text-6xl font-bold text-amber-500 mb-4">
			{page.status}
		</div>

		<h1 class="text-2xl font-semibold text-amber-100 mb-4">
			{#if page.status === 404}
				{t('error.pageNotFound')}
			{:else if page.status === 500}
				{t('error.serverError')}
			{:else}
				{t('error.somethingWentWrong')}
			{/if}
		</h1>

		<p class="text-gray-400 mb-8">
			{#if page.error?.message}
				{page.error.message}
			{:else if page.status === 404}
				{t('error.pageNotFoundMessage')}
			{:else}
				{t('error.unexpectedError')}
			{/if}
		</p>

		<a
			href="{base}/"
			class="inline-block bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
		>
			{t('error.returnHome')}
		</a>
	</div>
</div>
