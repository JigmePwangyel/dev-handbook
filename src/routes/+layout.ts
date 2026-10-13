import { loadManifest } from '../lib/content';

// Client-rendered SPA, same as the Angular app (render-doc needs DOMParser).
export const ssr = false;
export const prerender = false;

export const load = async ({ fetch }) => ({ topics: await loadManifest(fetch) });
