<script lang="ts">
  import { lessonCount } from '../lib/content';

  let { data } = $props();
</script>

<svelte:head><title>Dev Handbook</title></svelte:head>

<div class="page">
  <h1>Learn how software <em>really</em> works.</h1>
  <p class="lead">In-depth, hands-on handbooks for working engineers. Pick a topic to start.</p>
  <div class="grid">
    {#each data.topics as t (t.id)}
      <a class="card" href="/{t.id}">
        <h3>{t.icon} {t.title}</h3>
        <p>{t.blurb}</p>
        <p><small>{lessonCount(t)} lessons · {t.sections.length} sections</small></p>
      </a>
    {/each}
  </div>
</div>

<style>
  .page{max-width:1000px;margin:0 auto;padding:96px 24px 60px}
  h1{font-size:2.8rem;line-height:1.15}
  .lead{font-size:1.15rem;color:var(--muted)}
</style>
