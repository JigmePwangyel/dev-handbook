<script lang="ts">
  import { flatPages } from '../../lib/content';
  import { page } from '$app/state';

  let { data } = $props();

  const topic = $derived(data.topics.find((t) => t.id === page.params.topic));
  const first = $derived(topic && flatPages(topic)[0]);
</script>

<svelte:head><title>{topic ? `${topic.title} · Dev Handbook` : 'Dev Handbook'}</title></svelte:head>

<div class="page">
  {#if topic}
    <h1>{topic.icon} {topic.title}</h1>
    <p class="lead">{topic.blurb}</p>
    {#if first}
      <p><a class="btn" href="/{topic.id}/{first.section.id}/{first.id}">Start learning →</a></p>
    {/if}
    <div class="grid">
      {#each topic.sections as s (s.id)}
        {#if s.pages[0]}
          <a class="card" href="/{topic.id}/{s.id}/{s.pages[0].id}">
            <h3>{s.icon} {s.title}</h3>
            <p>{s.blurb}</p>
            <p><small>{s.pages.length} lessons</small></p>
          </a>
        {/if}
      {/each}
    </div>
  {:else}
    <h1>Topic not found</h1>
    <p><a href="/">Back to all topics</a></p>
  {/if}
</div>

<style>
  .page{max-width:1000px;margin:0 auto;padding:96px 24px 60px}
  .lead{font-size:1.15rem;color:var(--muted)}
  .btn{display:inline-block;background:var(--accent);color:#fff;padding:9px 18px;border-radius:8px;text-decoration:none;font-weight:600}
</style>
