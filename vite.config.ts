import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    sveltekit({
      // SPA mode, like the Angular app: every route falls back to index.html.
      adapter: adapter({ fallback: 'index.html' }),
    }),
  ],
  test: { environment: 'jsdom', include: ['src/**/*.test.ts'] },
});
