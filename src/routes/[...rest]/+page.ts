import { redirect } from '@sveltejs/kit';

// Mirrors the Angular `**` route: unknown URLs go home.
export const load = () => redirect(307, '/');
