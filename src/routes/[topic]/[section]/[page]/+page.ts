import { flatPages, loadPage } from '../../../../lib/content';
import { renderDoc } from '../../../../lib/render-doc';

export const load = async ({ params, parent, fetch }) => {
  const { topics } = await parent();
  const topic = topics.find((t) => t.id === params.topic);
  const pages = topic ? flatPages(topic) : [];
  const index = pages.findIndex((p) => p.section.id === params.section && p.id === params.page);
  const current = pages[index];
  const doc = current ? renderDoc(await loadPage(fetch, params.topic, current.section.id, current.file)) : undefined;
  return { topic, current, doc, prev: pages[index - 1], next: pages[index + 1] };
};
