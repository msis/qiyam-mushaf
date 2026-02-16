/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

declare const self: ServiceWorkerGlobalScope;

// Create a unique cache name for this version
const CACHE = `cache-${version}`;

// Assets to cache immediately on install
const ASSETS = [
	...build, // the app itself (JS, CSS bundles)
	...files // everything in static/
];

// Skip caching in dev mode
const isDev = import.meta.env.DEV;

self.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			if (isDev) {
				await self.skipWaiting();
				return;
			}
			const cache = await caches.open(CACHE);
			await cache.addAll(ASSETS);
			// Take over immediately
			await self.skipWaiting();
		})()
	);
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			// Delete old caches
			const keys = await caches.keys();
			await Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)));
			// Take control of all clients immediately
			await self.clients.claim();
		})()
	);
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
	// Only handle GET requests
	if (event.request.method !== 'GET') return;
	if (isDev) return; // Skip caching in dev mode

	const url = new URL(event.request.url);

	// Don't cache external requests
	if (url.origin !== location.origin) return;

	event.respondWith(
		(async () => {
			const cache = await caches.open(CACHE);

			// For static assets (in build or files), serve from cache first
			if (ASSETS.includes(url.pathname)) {
				const cached = await cache.match(url.pathname);
				if (cached) return cached;
			}

			// For everything else, try network first, then cache
			try {
				const response = await fetch(event.request);

				// Cache successful responses
				if (response.status === 200) {
					cache.put(event.request, response.clone());
				}

				return response;
			} catch {
				// Network failed, try cache
				const cached = await cache.match(event.request);
				if (cached) return cached;

				// If it's a navigation request, return the app shell
				if (event.request.mode === 'navigate') {
					const index = await cache.match('/');
					if (index) return index;
				}

				// Nothing we can do
				return new Response('Offline', {
					status: 503,
					statusText: 'Service Unavailable'
				});
			}
		})()
	);
});

// Handle messages from the app
self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});
