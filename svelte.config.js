import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			fallback: 'index.html',
			precompress: true
		}),
		alias: {
			$lib: 'src/lib',
			'$lib/*': 'src/lib/*'
		}
	}
};

export default config;
