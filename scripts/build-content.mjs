// Scans static/content and writes manifest.json + search-index.json.
//
// Layout:  static/content/topics.json                      -> [{ id, title, icon, blurb }]
//          static/content/<topic>/sections.json            -> [{ id, title, icon, blurb }]
//          static/content/<topic>/<section>/NN-slug.html   -> one lesson (first <h1> is its title)
//
// Run with `npm run content` (also runs automatically before start/build).
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'static', 'content');
const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'));
const stripTags = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();

const index = [];
const topics = readJson(join(root, 'topics.json')).map((topic) => {
  const sections = readJson(join(root, topic.id, 'sections.json')).map((section) => {
    const dir = join(root, topic.id, section.id);
    const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.html')).sort() : [];
    const pages = files.map((file) => {
      const html = readFileSync(join(dir, file), 'utf8');
      const id = file.replace(/^\d+-/, '').replace(/\.html$/, '');
      const title = stripTags(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? id);
      const lead = html.match(/<p class="lead">([\s\S]*?)<\/p>/)?.[1];
      index.push({ t: topic.id, s: section.id, p: id, title, section: section.title, text: stripTags(html) });
      return { id, title, file, summary: lead ? stripTags(lead) : '' };
    });
    return { ...section, pages };
  });
  return { ...topic, sections };
});

writeFileSync(join(root, 'manifest.json'), JSON.stringify(topics));
writeFileSync(join(root, 'search-index.json'), JSON.stringify(index));
console.log(topics.map((t) => `${t.id}: ${t.sections.reduce((n, s) => n + s.pages.length, 0)} lessons`).join('\n'));
