<script lang="ts">
	import '../layout.css';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import favicon from '$lib/assets/favicon.svg';
	import Preloader from '$lib/components/Preloader.svelte';
	import Cursor from '$lib/components/Cursor.svelte';
	import HUD from '$lib/components/HUD.svelte';
	import Orb from '$lib/components/Orb.svelte';

	let { children } = $props();

	let currentPath = $derived(page.url.pathname);

	onMount(() => {
		if (!browser) return;

		const root = document.documentElement;
		const savedTheme = localStorage.getItem('theme') ?? 'light';
		root.classList.remove('light', 'dark');
		root.classList.add(savedTheme === 'dark' ? 'dark' : 'light');
	});
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>OFF+BRAND — Creative Digital Agency</title>
	<meta
		name="description"
		content="A founder-led Scottish born, global digital marketing, branding & web design agency. We push the boundaries of digital creativity."
	/>
	<meta property="og:title" content="OFF+BRAND — Creative Digital Agency" />
	<meta
		property="og:description"
		content="A founder-led Scottish born, global digital marketing, branding & web design agency."
	/>
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="OFF+BRAND — Creative Digital Agency" />
	<meta
		name="twitter:description"
		content="A founder-led Scottish born, global digital marketing, branding & web design agency."
	/>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="portfolio">
<!-- ─── 커스텀 커서 ─────────────────────────────────────────────────────────── -->
<Cursor />

<!-- ─── HUD (fixed nav) ───────────────────────────────────────────────────── -->
<HUD {currentPath} />

<!-- ─── 전역 Orb (fixed, z-index:-2) ──────────────────────────────────────── -->
<div data-orb-wrap="" pointer-none="" class="orb-w">
	<Orb />
	<!-- 첫 번째 outline ring (80vh) -->
	<div orb-out-w="1" class="orb-outline-w">
		<div orb-out-r="1" class="orb-outline-r">
			<div orb-outline="1" class="orb-outline"></div>
		</div>
	</div>
	<!-- 두 번째 outline ring (100vh) -->
	<div orb-out-w="2" class="orb-outline-w is-2">
		<div orb-out-r="2" class="orb-outline-r">
			<div orb-outline="2" class="orb-outline is-2"></div>
		</div>
	</div>
</div>

<!-- ─── 페이지 wipe 트랜지션 레이어 ──────────────────────────────────────── -->
<div class="page-wipe-w">
	<div class="page-wipe-inner">
		<div class="page-wipe-object-w">
			<div class="page-wipe-path"></div>
		</div>
	</div>
</div>

<!-- ─── 프리로더 ──────────────────────────────────────────────────────────── -->
<Preloader />

<!-- ─── 페이지 콘텐츠 ─────────────────────────────────────────────────────── -->
<div data-page-wrapper class="page-w">
	{@render children()}
</div>
</div>

<div style="display:none">
	{#each locales as locale (locale)}
		<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- locale switcher requires localizeHref -->
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>

<style>
	/* ── Three.js canvas ── */
	:global(.portfolio canvas) {
		display: block;
		border-radius: 50%;
		background-color: transparent !important;
	}

	/* ── will-change for animated elements ── */
	:global([data-orb]),
	:global([orb-out-w]),
	:global([orb-outline]),
	:global([data-cursor]) {
		will-change: transform;
	}

	/* ── orb wrapper ── */
	.orb-w {
		position: fixed;
		inset: 0%;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: -2;
		pointer-events: none;
		overflow-x: clip;
	}

	/* ── orb element ── */
	:global(.orb) {
		position: absolute;
		border-radius: 100%;
		width: 0;
		height: 0;
		opacity: 0;
		z-index: -1;
		overflow: hidden;
	}
	:global(.orb canvas) {
		border-radius: 0;
		width: 100% !important;
		height: 100% !important;
		background-color: transparent !important;
	}

	/* ── orb outline rings ── */
	.orb-outline-w {
		position: absolute;
		width: 80vh;
		height: 80vh;
		z-index: -2;
	}
	.orb-outline-w.is-2 {
		width: 100vh;
		height: 100vh;
	}
	.orb-outline-r {
		width: 100%;
		height: 100%;
		position: absolute;
	}
	:global(.orb-outline) {
		position: absolute;
		border: 1px dashed rgba(111, 111, 111, 0.4);
		border-radius: 100%;
		width: 100%;
		height: 100%;
		z-index: -2;
		opacity: 0;
	}
</style>
