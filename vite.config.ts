import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	// @ts-expect-error - this is a valid Vite config
	plugins: [sveltekit()],

	test: {
		include: ['tests/**/*.{test,spec}.{js,ts}']
	}
});
