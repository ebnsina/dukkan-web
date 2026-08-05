import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	/* One port, always. Vite's default is to hop to the next free port when
	   5173 is busy, which leaves a stale server serving an old module graph
	   while you read the new one — that cost an afternoon of chasing a 500
	   that did not exist. Fail loudly instead. */
	/* `host: true` binds every interface rather than ::1 alone: browsers resolve
	   `*.localhost` to 127.0.0.1, and a server listening only on IPv6 loopback
	   refuses that. `allowedHosts` then lets the shop subdomains through — Vite
	   rejects hosts it was not told about, which is right on a public network
	   and exactly what stops `rahim.dukkan.localhost:5173` working here. */
	server: {
		port: 5173,
		strictPort: true,
		host: true,
		allowedHosts: ['.dukkan.localhost', 'localhost']
	},
	preview: { port: 4173, strictPort: true },

	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
			// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
			// See https://svelte.dev/docs/kit/adapters for more information about adapters.
			adapter: adapter()
		})
	]
});
