import type { FlatPage, SearchEntry, Topic } from './models';

type Fetch = typeof fetch;

export async function fetchJson<T>(f: Fetch, url: string): Promise<T> {
  const res = await f(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

export const flatPages = (topic: Topic): FlatPage[] =>
  topic.sections.flatMap((section) => section.pages.map((p) => ({ ...p, topicId: topic.id, section })));

export const lessonCount = (topic: Topic) => topic.sections.reduce((n, s) => n + s.pages.length, 0);

export const loadManifest = (f: Fetch) => fetchJson<Topic[]>(f, '/content/manifest.json');
export const loadSearchIndex = (f: Fetch) => fetchJson<SearchEntry[]>(f, '/content/search-index.json');

export async function loadPage(f: Fetch, topicId: string, sectionId: string, file: string): Promise<string> {
  const res = await f(`/content/${topicId}/${sectionId}/${file}`);
  if (!res.ok) throw new Error(`Could not load ${file}`);
  return res.text();
}
