<script lang="ts">
	import '../app.css';

	export let data;

	$: ({ meta } = data);
	$: ({ count } = meta);
</script>

<header>
	<p><a href="/" data-sveltekit-reload>Go home</a> · {count} posts</p>
</header>

<main>
	<slot />
</main>
