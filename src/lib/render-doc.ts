import type { TocItem } from './models';

const KEYWORDS =
  'FROM|RUN|CMD|COPY|ENTRYPOINT|EXPOSE|ENV|WORKDIR|ARG|apiVersion|kind|resource|provider|sudo|apt|docker|kubectl|git|npm|if|then|fi|for|do|done|function|const|let|return|import|export|async|await|def|class|package|func|type|struct|interface|defer|chan|select|range|var|switch|case|default|map|go';
const TOKEN = new RegExp(
  `^([ \\t]*(?:#|//|--).*)$|("[^"\\n]*"|'[^'\\n]*')|\\b(${KEYWORDS})\\b`,
  'gm',
);

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Lightweight, dependency-free syntax colouring for code blocks. */
function highlight(code: string): string {
  return escapeHtml(code).replace(TOKEN, (_m, comment, str, kw) =>
    comment ? `<span class="tk-c">${comment}</span>`
    : str ? `<span class="tk-s">${str}</span>`
    : `<span class="tk-k">${kw}</span>`,
  );
}

/**
 * Turns a raw lesson fragment into display HTML: highlights code, adds copy
 * buttons and gives h2/h3 headings ids so the table of contents can link to them.
 */
export function renderDoc(raw: string): { html: string; toc: TocItem[] } {
  const doc = new DOMParser().parseFromString(`<body>${raw}</body>`, 'text/html');

  doc.querySelectorAll('pre').forEach((pre) => {
    if (!pre.classList.contains('diagram')) {
      const code = pre.querySelector('code') ?? pre;
      code.innerHTML = highlight(code.textContent ?? '');
    }
    const btn = doc.createElement('button');
    btn.className = 'copy';
    btn.type = 'button';
    btn.textContent = 'Copy';
    pre.appendChild(btn);
  });

  const toc: TocItem[] = [];
  doc.querySelectorAll('h2, h3').forEach((h, i) => {
    h.id = `h${i}`;
    toc.push({ id: h.id, text: h.textContent ?? '', level: h.tagName === 'H3' ? 3 : 2 });
  });

  return { html: doc.body.innerHTML, toc };
}
