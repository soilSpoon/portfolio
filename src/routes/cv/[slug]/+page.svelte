<script lang="ts">
	import { resolve } from '$app/paths';
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.title} — 이대희</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<nav class="cv-breadcrumb no-print">
	<a href={resolve('/cv')}>목록</a>
	<span>/</span>
	<span>{data.title}</span>
</nav>

<article>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted local markdown rendered at build time -->
	{@html data.html}
</article>

<style>
	.cv-breadcrumb {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		font-size: 0.85rem;
		color: #888;
	}

	.cv-breadcrumb a {
		color: #2563eb;
		text-decoration: none;
	}

	.cv-breadcrumb a:hover {
		text-decoration: underline;
	}
</style>
