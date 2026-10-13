import { describe, expect, it } from 'vitest';
import { renderDoc } from './render-doc';

describe('renderDoc', () => {
  const raw = `<h1>T</h1><h2>One</h2><pre><code># note\nFROM node:22 &amp;&amp; echo "hi" &lt;x&gt;</code></pre><h3>Sub</h3><pre class="diagram">a --&gt; b</pre>`;

  it('builds a table of contents from h2/h3', () => {
    expect(renderDoc(raw).toc).toEqual([
      { id: 'h0', text: 'One', level: 2 },
      { id: 'h1', text: 'Sub', level: 3 },
    ]);
  });

  it('highlights code but leaves diagrams plain, and adds copy buttons', () => {
    const { html } = renderDoc(raw);
    expect(html).toContain('<span class="tk-c"># note</span>');
    expect(html).toContain('<span class="tk-k">FROM</span>');
    expect(html).toContain('&lt;x&gt;');
    expect(html).not.toContain('tk-s">a');
    expect(html.match(/class="copy"/g)?.length).toBe(2);
  });
});
