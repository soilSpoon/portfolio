<script lang="ts">
	import { resolve } from '$app/paths';
	import * as m from '$lib/paraglide/messages';
	let { data } = $props();
</script>

<svelte:head>
	<title>{m.cv_page_title()}</title>
</svelte:head>

<h1>{m.cv_page_heading()}</h1>
<p>{m.cv_page_description()}</p>

<hr />

<nav class="mt-6 grid gap-4">
	{#each data.entries as entry (entry.resumeSlug)}
		<div
			class="flex flex-col gap-2 rounded-lg border border-gray-200 px-6 py-5 transition-all hover:border-gray-400 hover:shadow-md"
		>
			<strong class="text-[1.05rem] text-gray-900">{entry.title}</strong>
			{#if entry.subtitle}
				<span class="text-sm text-gray-500">{entry.subtitle}</span>
			{/if}
			<div class="flex gap-3 text-sm">
				<a
					href={resolve(`/cv/${entry.resumeSlug}`)}
					class="text-blue-600 no-underline hover:underline">이력서</a
				>
				{#if entry.careerSlug}
					<a
						href={resolve(`/cv/${entry.careerSlug}`)}
						class="text-blue-600 no-underline hover:underline">경력기술서</a
					>
				{/if}
			</div>
		</div>
	{/each}
</nav>
