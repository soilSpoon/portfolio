<script lang="ts">
	import { resolve } from '$app/paths';
	import { CV_ENTRIES } from '$lib/data/cv';
	import * as m from '$lib/paraglide/messages';
</script>

<svelte:head>
	<title>{m.cv_page_title()}</title>
</svelte:head>

<h1>{m.cv_page_heading()}</h1>
<p>{m.cv_page_description()}</p>

<hr />

<nav class="mt-6 grid gap-4">
	{#each CV_ENTRIES as entry (entry.slug)}
		<a
			href={resolve(`/cv/${entry.slug}`)}
			class="flex flex-col gap-1 rounded-lg border border-gray-200 px-6 py-5 text-inherit no-underline transition-all hover:border-gray-400 hover:shadow-md"
		>
			<strong class="text-[1.05rem] text-gray-900">{m[entry.titleKey]()}</strong>
			<span class="text-sm text-gray-500">{m[entry.subtitleKey]()}</span>
		</a>
	{/each}
</nav>
