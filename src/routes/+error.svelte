<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="h-screen bg-gray-900 flex items-center justify-center p-4">
	<div class="text-center max-w-md">
		<div class="text-6xl font-bold text-amber-500 mb-4">
			{page.status}
		</div>

		<h1 class="text-2xl font-semibold text-amber-100 mb-4">
			{#if page.status === 404}
				Page Not Found
			{:else if page.status === 500}
				Server Error
			{:else}
				Something Went Wrong
			{/if}
		</h1>

		<p class="text-gray-400 mb-8">
			{#if page.error?.message}
				{page.error.message}
			{:else if page.status === 404}
				The page you are looking for does not exist.
			{:else}
				An unexpected error occurred.
			{/if}
		</p>

		<a
			href="/"
			class="inline-block bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
		>
			Return Home
		</a>
	</div>
</div>
