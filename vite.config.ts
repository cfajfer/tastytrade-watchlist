import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	// @ts-expect-error - this is a valid Vite config
	plugins: [sveltekit()],
	ssr: {
		noExternal: ['svelte-lightweight-charts'] // Exclude the library
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom',
		globals: true
	}
});
