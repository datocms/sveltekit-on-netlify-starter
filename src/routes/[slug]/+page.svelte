<script lang="ts">
	const PAGE_GENERATED_ON = new Date();

	export let data;

	$: ({ currentPost, previousPost, nextPost, layoutCacheTags, pageCacheTags } = data);
</script>

<h1>{currentPost.title}</h1>

<ul class="horizontal navigation">
	<li>
		Previous:
		{#if previousPost}
			<a href={`/${previousPost.slug}`}>{previousPost.title}</a>
		{:else}
			—
		{/if}
	</li>
	<li>
		Next:
		{#if nextPost}
			<a href={`/${nextPost.slug}`}>{nextPost.title}</a>
		{:else}
			—
		{/if}
	</li>
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

	<p>This page has been generated on {PAGE_GENERATED_ON}</p>
</footer>
