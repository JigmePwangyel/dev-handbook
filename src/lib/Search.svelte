<script lang="ts">
  import { goto } from '$app/navigation';
  import { loadSearchIndex } from './content';
  import type { SearchEntry } from './models';

  let box: HTMLInputElement;
  let query = $state('');
  let index = $state<SearchEntry[]>([]);
  let loading: Promise<void> | undefined;

  // Fetch the (large-ish) index only when the user first interacts with search.
  function ensureIndex() {
    loading ??= loadSearchIndex(fetch).then((i) => void (index = i));
  }

  const hits = $derived.by(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const terms = q.split(/\s+/).filter(Boolean);
    return index
      .map((e) => {
        const title = e.title.toLowerCase();
        const text = e.text.toLowerCase();
        let score = 0;
        for (const w of terms) {
          if (title.includes(w)) score += 10;
          const n = text.split(w).length - 1;
          if (!n) return { e, score: -1, snippet: '' };
          score += Math.min(n, 8);
        }
        const k = Math.max(0, text.indexOf(terms[0]));
        return { e, score, snippet: e.text.slice(Math.max(0, k - 40), k + 80) };
      })
      .filter((h) => h.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  });

  function clear() {
    query = '';
    box.blur();
  }

  function openFirst() {
    const h = hits[0];
    if (h) {
      goto(`/${h.e.t}/${h.e.s}/${h.e.p}`);
      clear();
    }
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === '/' && document.activeElement !== box) {
      e.preventDefault();
      box.focus();
    } else if (e.key === 'Escape') {
      clear();
    }
  }
</script>

<svelte:document onkeydown={onKey} />

<div class="search">
  <input
    bind:this={box}
    bind:value={query}
    type="search"
    placeholder="Search docs…  ( / )"
    autocomplete="off"
    onfocus={ensureIndex}
    onkeydown={(e) => e.key === 'Enter' && openFirst()}
  />
  {#if query.trim().length >= 2}
    <div class="results">
      {#each hits as h (h.e.t + h.e.s + h.e.p)}
        <a href="/{h.e.t}/{h.e.s}/{h.e.p}" onclick={clear}>
          <b>{h.e.title}</b>
          <small>{h.e.section} — …{h.snippet}…</small>
        </a>
      {:else}
        <span class="none">No results</span>
      {/each}
    </div>
  {/if}
</div>

<style>
  .search{position:relative;display:block;flex:1;max-width:460px;margin-left:auto}
  input{width:100%;padding:8px 12px;border-radius:8px;border:1px solid var(--bd);background:var(--side);color:var(--fg);font-size:14px}
  .results{position:absolute;top:42px;left:0;right:0;background:var(--bg);border:1px solid var(--bd);border-radius:10px;box-shadow:0 12px 30px #0003;max-height:70vh;overflow:auto}
  a,.none{display:block;padding:9px 14px;text-decoration:none;color:var(--fg);border-bottom:1px solid var(--bd)}
  a:hover{background:var(--side)}
  small{display:block;color:var(--muted)}
</style>
