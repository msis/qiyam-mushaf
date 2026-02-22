<script lang="ts">
	import { t } from '$lib/i18n';
</script>

<div class="text-center text-gray-400 py-8">
	<svg class="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
	</svg>
	<p>{t('bookmarks.empty')}</p>
	<p class="text-sm mt-1">{t('bookmarks.emptyHint')}</p>
</div>
