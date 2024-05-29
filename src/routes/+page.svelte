<script lang="ts">
	import { page } from '$app/stores';

	const PAGE_GENERATED_ON = new Date();

	export let data;

	$: ({ allPosts, layoutCacheTags, pageCacheTags, etag } = data);
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<ul>
	{#each allPosts as { title, slug }}
		<li><a href={`/${slug}`}>{title}</a></li>
	{/each}
</ul>

<footer>
	<p>
		Cache tags from page queries:
		<code>
			{JSON.stringify(pageCacheTags)}
		</code>
	</p>
	<p>
		Cache tags from layout queries:
		<code>
			{JSON.stringify(layoutCacheTags)}
		</code>
	</p>

	<p>ETag: {etag}</p>
	
	<p>This page has been generated on {PAGE_GENERATED_ON}</p>
</footer>
