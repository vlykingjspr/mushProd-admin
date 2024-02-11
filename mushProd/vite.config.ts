import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), purgeCss()],
	server: {
	},
});
// export default defineConfig({
// 	plugins: [sveltekit(), purgeCss()],
// 	server: {
// 		fs: {
// 			allow: ['D:/Documents/Files/SveltKit/Project 0/mushprod/public']
// 		},
// 		proxy: {
// 			// assuming your backend server is running on localhost:3000
// 			'/home': {
// 				target: 'http://localhost:3000',
// 				changeOrigin: true,
// 				rewrite: (path) => path.replace(/^\/home/, '')
// 			}
// 		}
// 	},
// });