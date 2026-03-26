<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import * as m from '$lib/paraglide/messages';
	import ResumeLayout from '$lib/components/ResumeLayout.svelte';
	import CareerLayout from '$lib/components/CareerLayout.svelte';
	let { data } = $props();

	function handlePrint() {
		if (browser) window.print();
	}
</script>

<svelte:head>
	<title>{m.cv_detail_title({ title: data.title })}</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="no-print mb-6 flex items-center justify-between">
	<nav class="flex items-center gap-2 text-sm text-gray-400">
		<a href={resolve('/cv')} class="text-blue-600 no-underline hover:underline">{m.cv_list()}</a>
		<span>/</span>
		<span>{data.title}</span>
	</nav>
	<button
		onclick={handlePrint}
		class="cursor-pointer rounded-md border-none bg-gray-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-700"
	>
		PDF 저장
	</button>
</div>

{#if data.mode === 'resume'}
	<ResumeLayout {data} theme={data.theme} />
{:else}
	<CareerLayout {data} theme={data.theme} />
{/if}
