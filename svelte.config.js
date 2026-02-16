import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';

/**
 * Base path for GitHub Pages deployment
 * @type {string}
 * - Empty string ('') for root deployment (custom domain or username.github.io)
 * - '/subdirectory' for repository subdirectory (e.g., '/taraweeh-mushaf')
 */
const basePath = process.env.BASE_PATH || '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), mdsvex({ extensions: ['.md', '.mdx'] })],
	extensions: ['.svelte', '.md', '.mdx'],

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html', // SPA fallback for PWA
			precompress: false,
			strict: true
		}),
		paths: {
			base: basePath
		},
		serviceWorker: {
			register: true
		},
		alias: {
			$lib: 'src/lib'
		}
	}
};

export default config;
