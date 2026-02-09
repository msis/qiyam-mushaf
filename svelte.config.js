import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Support BASE_PATH for GitHub Pages deployment
const basePath = process.env.BASE_PATH || '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

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
