<script lang="ts">
	import { resolve } from '$app/paths';
	import * as m from '$lib/paraglide/messages';
	let { data } = $props();
</script>

<svelte:head>
	<title>{m.cv_detail_title({ title: m[data.titleKey]() })}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<nav class="no-print mb-6 flex items-center gap-2 text-sm text-gray-400">
	<a href={resolve('/cv')} class="text-blue-600 no-underline hover:underline">{m.cv_list()}</a>
	<span>/</span>
	<span>{m[data.titleKey]()}</span>
</nav>

<article>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted local markdown rendered at build time -->
	{@html data.html}
</article>
