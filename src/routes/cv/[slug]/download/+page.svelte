<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import * as m from '$lib/paraglide/messages';

	let { data } = $props();

	const DOWNLOAD_PIN = '0938';

	let pin = $state('');
	let authorized = $state(false);
	let error = $state('');

	function checkPin() {
		if (pin === DOWNLOAD_PIN) {
			authorized = true;
			error = '';
		} else {
			error = m.cv_pin_incorrect();
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') checkPin();
	}

	function handlePrint() {
		if (browser) window.print();
	}
</script>

<svelte:head>
	<title>{m.cv_download_title({ title: m[data.titleKey]() })}</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if !authorized}
	<div class="flex min-h-[60vh] items-center justify-center">
		<div class="text-center">
			<h2 class="mb-1 border-none text-xl font-semibold">{m.cv_pdf_download()}</h2>
			<p class="mb-6 text-sm text-gray-400">{m[data.titleKey]()}</p>
			<div class="flex justify-center gap-2">
				<input
					type="password"
					bind:value={pin}
					onkeydown={handleKeydown}
					placeholder={m.cv_enter_pin()}
					autocomplete="off"
					class="font-inherit w-[140px] rounded-md border border-gray-300 px-4 py-2.5 text-center text-base tracking-widest outline-none focus:border-gray-500"
				/>
				<button
					onclick={checkPin}
					class="font-inherit cursor-pointer rounded-md border-none bg-gray-900 px-5 py-2.5 text-sm text-white hover:bg-gray-700"
				>
					{m.cv_confirm()}
				</button>
			</div>
			{#if error}
				<p class="mt-3 text-sm text-red-600">{error}</p>
			{/if}
		</div>
	</div>
{:else}
	<div class="no-print mb-6 flex items-center justify-between border-b border-gray-100 py-3">
		<a href={resolve(`/cv/${data.slug}`)} class="text-sm text-blue-600 no-underline hover:underline"
			>&larr; {m.cv_view_web()}</a
		>
		<button
			onclick={handlePrint}
			class="font-inherit cursor-pointer rounded-md border-none bg-gray-900 px-5 py-2 text-sm text-white hover:bg-gray-700"
		>
			{m.cv_save_as_pdf()}
		</button>
	</div>

	<article>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted local markdown rendered at build time -->
		{@html data.html}
	</article>
{/if}
