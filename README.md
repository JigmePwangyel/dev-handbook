# Dev Handbook (SvelteKit)

SvelteKit port of the Angular `dev-handbook`. Same content, same features (topic/section/lesson
navigation, client-side search with `/`, light/dark theme, code highlighting + copy buttons, TOC
scroll-spy, prev/next). Built as a static SPA with `adapter-static`.

    npm run dev      # regenerates the content manifest, then vite dev
    npm run build    # static output in ./build
    npm run preview
    npm test
    npm run check

## Adding a topic

Same as the Angular app, but content lives in `static/content` (see `scripts/build-content.mjs`):

1. Add the topic to `static/content/topics.json`.
2. Create `static/content/<topic>/sections.json`.
3. Add lessons as `static/content/<topic>/<section-id>/01-slug.html` (first `<h1>` is the title).
4. `npm run dev` / `npm run content` rebuilds `manifest.json` and `search-index.json`.
