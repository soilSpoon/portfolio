<script lang="ts">
	import { resolve } from '$app/paths';
	import { CV_ENTRIES } from '$lib/data/cv';
</script>

<svelte:head>
	<title>이력서 — 이대희</title>
</svelte:head>

<h1>이력서</h1>
<p>이대희 — 풀스택 개발자</p>

<hr />

<nav class="cv-nav">
	{#each CV_ENTRIES as entry (entry.slug)}
		<a href={resolve(`/cv/${entry.slug}`)} class="cv-card">
			<strong>{entry.title}</strong>
			<span>{entry.subtitle}</span>
		</a>
	{/each}
</nav>

<style>
	.cv-nav {
		display: grid;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.cv-card {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 1.25rem 1.5rem;
		border: 1px solid #e5e5e5;
		border-radius: 8px;
		text-decoration: none;
		color: inherit;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.cv-card:hover {
		border-color: #999;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
	}

	.cv-card strong {
		font-size: 1.05rem;
		color: #111;
	}

	.cv-card span {
		font-size: 0.875rem;
		color: #666;
	}
</style>
