<script lang="ts">
  import { page } from '$app/state';

  let { data } = $props();

  let menuOpen = $state(false);
  let activeHeading = $state('');

  // Close the mobile menu and keep the active sidebar link in view on navigation.
  $effect(() => {
    data.current;
    menuOpen = false;
    queueMicrotask(() => document.querySelector('.side a.active')?.scrollIntoView({ block: 'nearest' }));
  });

  function scrollTo(ev: Event, id: string) {
    ev.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  function onArticleClick(ev: MouseEvent) {
    const btn = (ev.target as HTMLElement).closest('button.copy');
    if (!btn) return;
    const text = Array.from(btn.parentElement!.childNodes)
      .filter((n) => n !== btn)
      .map((n) => n.textContent)
      .join('')
      .trimEnd();
    navigator.clipboard.writeText(text);
    btn.textContent = 'Copied ✓';
    setTimeout(() => (btn.textContent = 'Copy'), 1200);
  }

  function onScroll() {
    let cur = '';
    document.querySelectorAll<HTMLElement>('.doc h2, .doc h3').forEach((h) => {
      if (h.getBoundingClientRect().top < 120) cur = h.id;
    });
    activeHeading = cur;
  }
</script>

<svelte:window onscroll={onScroll} />
<svelte:head>
  <title>{data.current ? `${data.current.title} · Dev Handbook` : 'Dev Handbook'}</title>
</svelte:head>

<button type="button" class="menu-btn" aria-label="Menu" onclick={() => (menuOpen = !menuOpen)}>☰</button>
<div class="layout">
  <nav class="side" class:open={menuOpen}>
    {#if data.topic}
      {@const t = data.topic}
      <a class="topic-link" href="/{t.id}">{t.icon} {t.title}</a>
      {#each t.sections as s (s.id)}
        <h4>{s.icon} {s.title}</h4>
        {#each s.pages as p (p.id)}
          <a
            href="/{t.id}/{s.id}/{p.id}"
            class:active={page.params.section === s.id && page.params.page === p.id}>{p.title}</a>
        {/each}
      {/each}
    {/if}
  </nav>

  <main>
    {#if data.current}
      {@const c = data.current}
      <div class="crumb">{c.section.icon} {c.section.title}</div>
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
      <article class="doc" onclick={onArticleClick}>{@html data.doc?.html}</article>
      <div class="pager">
        {#if data.prev}
          {@const p = data.prev}
          <a href="/{p.topicId}/{p.section.id}/{p.id}"><small>← Previous</small>{p.title}</a>
        {:else}
          <span></span>
        {/if}
        {#if data.next}
          {@const n = data.next}
          <a class="next" href="/{n.topicId}/{n.section.id}/{n.id}"><small>Next →</small>{n.title}</a>
        {/if}
      </div>
    {:else if data.topic}
      <h1>Lesson not found</h1>
      <p><a href="/{data.topic.id}">Back to the topic</a></p>
    {:else}
      <h1>Topic not found</h1>
      <p><a href="/">Back to all topics</a></p>
    {/if}
  </main>

  <aside class="toc">
    {#if data.doc?.toc.length}
      <b>On this page</b>
      {#each data.doc.toc as h (h.id)}
        <a href="#{h.id}" class:l3={h.level === 3} class:on={activeHeading === h.id} onclick={(e) => scrollTo(e, h.id)}>{h.text}</a>
      {/each}
    {/if}
  </aside>
</div>

<style>
  .layout{display:grid;grid-template-columns:290px minmax(0,1fr) 230px;padding-top:56px;min-height:100vh}
  .side{position:sticky;top:56px;height:calc(100vh - 56px);overflow:auto;background:var(--side);border-right:1px solid var(--bd);padding:16px 12px 60px}
  .side h4{margin:18px 8px 6px;font-size:12px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted)}
  .side a{display:block;padding:5px 10px;border-radius:6px;color:var(--fg);text-decoration:none;font-size:14.5px}
  .side a:hover{background:var(--bd)}
  .side a.active{background:var(--accent);color:#fff}
  .side a.topic-link{font-weight:700;margin-bottom:4px}
  main{padding:36px 48px 80px;max-width:900px;width:100%}
  .crumb{font-size:13px;color:var(--muted);margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em}
  .toc{position:sticky;top:56px;height:calc(100vh - 56px);overflow:auto;padding:30px 16px;font-size:13px}
  .toc b{display:block;color:var(--muted);text-transform:uppercase;font-size:11px;letter-spacing:.07em;margin-bottom:8px}
  .toc a{display:block;color:var(--muted);text-decoration:none;padding:3px 0 3px 10px;border-left:2px solid var(--bd)}
  .toc a.l3{padding-left:22px}
  .toc a:hover,.toc a.on{color:var(--accent);border-color:var(--accent)}
  .pager{display:flex;justify-content:space-between;gap:14px;margin-top:60px}
  .pager a{flex:1;border:1px solid var(--bd);border-radius:10px;padding:12px 16px;text-decoration:none;color:var(--fg)}
  .pager a:hover{border-color:var(--accent)}
  .pager small{display:block;color:var(--muted)}
  .pager a.next{text-align:right}
  .menu-btn{display:none;position:fixed;top:10px;left:auto;right:64px;z-index:25;background:none;border:1px solid var(--bd);color:var(--fg);border-radius:8px;padding:5px 10px;cursor:pointer;font-size:16px}
  @media(max-width:1100px){.layout{grid-template-columns:270px minmax(0,1fr)}.toc{display:none}}
  @media(max-width:760px){
    .menu-btn{display:block}
    .layout{grid-template-columns:1fr}
    main{padding:24px 18px}
    .side{position:fixed;left:0;top:56px;width:290px;z-index:15;transform:translateX(-100%);transition:.2s}
    .side.open{transform:none}
  }
</style>
