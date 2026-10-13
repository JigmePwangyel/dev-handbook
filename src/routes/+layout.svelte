<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import Search from '../lib/Search.svelte';
  import { theme } from '../lib/theme.svelte';

  let { data, children } = $props();

  onMount(() => theme.init());

  const currentTopic = $derived(page.url.pathname.split('/')[1] ?? '');
</script>

<header class="topbar">
  <a class="brand" href="/">📚 Dev<span>Handbook</span></a>
  {#if data.topics.length > 1}
    <select
      class="topic-select"
      aria-label="Topic"
      value={currentTopic}
      onchange={(e) => goto(e.currentTarget.value ? `/${e.currentTarget.value}` : '/')}
    >
      <option value="">All topics</option>
      {#each data.topics as t (t.id)}
        <option value={t.id}>{t.icon} {t.title}</option>
      {/each}
    </select>
  {/if}
  <Search />
  <button type="button" class="icon-btn" aria-label="Toggle theme" onclick={() => theme.toggle()}>🌓</button>
</header>

{@render children()}

<style>
  .topbar{position:fixed;inset:0 0 auto 0;height:56px;display:flex;align-items:center;gap:14px;padding:0 18px;background:var(--bg);border-bottom:1px solid var(--bd);z-index:20}
  .brand{font-weight:800;text-decoration:none;color:var(--fg);font-size:18px;white-space:nowrap}
  .brand span{color:var(--accent);margin-left:4px}
  .topic-select{padding:6px 8px;border-radius:8px;border:1px solid var(--bd);background:var(--side);color:var(--fg);font-size:14px;max-width:220px}
  .icon-btn{background:none;border:1px solid var(--bd);color:var(--fg);border-radius:8px;padding:5px 10px;cursor:pointer;font-size:16px}
  @media(max-width:760px){.topic-select{display:none}}
</style>
