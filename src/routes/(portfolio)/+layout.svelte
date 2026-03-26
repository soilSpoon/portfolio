<script lang="ts">
	import '../layout.css';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import favicon from '$lib/assets/favicon.svg';
	import Preloader from '$lib/components/Preloader.svelte';
	import Cursor from '$lib/components/Cursor.svelte';
	import HUD from '$lib/components/HUD.svelte';
	import Orb from '$lib/components/Orb.svelte';

	const META_TITLE = '이대희 — Full-stack Developer';
	const META_DESC = '풀스택 개발자 이대희. 언어를 가리지 않고, AI 도구로 효율적으로 개발합니다.';

	let { children } = $props();

	let currentPath = $derived(page.url.pathname);

	onMount(() => {
		const root = document.documentElement;
		const savedTheme = localStorage.getItem('theme') ?? 'light';
		root.classList.remove('light', 'dark');
		root.classList.add(savedTheme === 'dark' ? 'dark' : 'light');
	});
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>{META_TITLE}</title>
	<meta name="description" content={META_DESC} />
	<meta property="og:title" content={META_TITLE} />
	<meta property="og:description" content={META_DESC} />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={META_TITLE} />
	<meta name="twitter:description" content={META_DESC} />
	<link rel="icon" href={favicon} />
	{#each locales as locale (locale)}
		<link rel="alternate" hreflang={locale} href={localizeHref(page.url.pathname, { locale })} />
	{/each}
</svelte:head>

<div class="portfolio">
<!-- ─── 커스텀 커서 ─────────────────────────────────────────────────────────── -->
<Cursor />

<!-- ─── HUD (fixed nav) ───────────────────────────────────────────────────── -->
<HUD {currentPath} />

<!-- ─── 전역 Orb (fixed, z-index:-2) ──────────────────────────────────────── -->
<div data-orb-wrap="" pointer-none="" class="fixed inset-0 flex items-center justify-center -z-2 pointer-events-none overflow-x-clip">
	<Orb />
	<!-- 첫 번째 outline ring (80vh) -->
	<div orb-out-w="1" class="absolute h-[80vh] w-[80vh] -z-2 will-change-transform">
		<div orb-out-r="1" class="absolute h-full w-full">
			<div orb-outline="1" class="absolute rounded-full w-full h-full -z-2 opacity-0 border border-dashed border-border-strong will-change-transform"></div>
		</div>
	</div>
	<!-- 두 번째 outline ring (100vh) -->
	<div orb-out-w="2" class="absolute h-[100vh] w-[100vh] -z-2 will-change-transform">
		<div orb-out-r="2" class="absolute h-full w-full">
			<div orb-outline="2" class="absolute rounded-full w-full h-full -z-2 opacity-0 border border-dashed border-border-strong will-change-transform"></div>
		</div>
	</div>
</div>

<!-- ─── 프리로더 ──────────────────────────────────────────────────────────── -->
<Preloader />

<!-- ─── 페이지 콘텐츠 ─────────────────────────────────────────────────────── -->
<div data-page-wrapper class="relative w-full overflow-x-clip">
	{@render children()}
</div>
</div>


<style>
	/* Three.js canvas — runtime injected, :global required */
	:global(.portfolio canvas) {
		display: block;
		border-radius: 50%;
		background-color: transparent !important;
	}
	:global(.portfolio canvas.orb-canvas) {
		border-radius: 0;
		width: 100% !important;
		height: 100% !important;
		background-color: transparent !important;
	}
</style>
