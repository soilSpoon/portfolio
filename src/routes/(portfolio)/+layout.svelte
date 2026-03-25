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
	<title>이대희 — Full-stack Developer</title>
	<meta
		name="description"
		content="풀스택 개발자 이대희. 언어를 가리지 않고, AI 도구로 효율적으로 개발합니다."
	/>
	<meta property="og:title" content="이대희 — Full-stack Developer" />
	<meta
		property="og:description"
		content="풀스택 개발자 이대희. 언어를 가리지 않고, AI 도구로 효율적으로 개발합니다."
	/>
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="이대희 — Full-stack Developer" />
	<meta
		name="twitter:description"
		content="풀스택 개발자 이대희. 언어를 가리지 않고, AI 도구로 효율적으로 개발합니다."
	/>
	<link rel="icon" href={favicon} />
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
	<div orb-out-w="1" class="absolute h-[80vh] w-[80vh] -z-2">
		<div orb-out-r="1" class="absolute h-full w-full">
			<div orb-outline="1" class="orb-outline"></div>
		</div>
	</div>
	<!-- 두 번째 outline ring (100vh) -->
	<div orb-out-w="2" class="absolute h-[100vh] w-[100vh] -z-2">
		<div orb-out-r="2" class="absolute h-full w-full">
			<div orb-outline="2" class="orb-outline is-2"></div>
		</div>
	</div>
</div>

<!-- ─── 페이지 wipe 트랜지션 레이어 ──────────────────────────────────────── -->
<div class="fixed inset-0 z-[9000] pointer-events-none opacity-0">
	<div class="page-wipe-inner">
		<div class="page-wipe-object-w">
			<div class="page-wipe-path"></div>
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
	:global(.orb-outline) {
		position: absolute;
		border: 1px dashed rgba(111, 111, 111, 0.4);
		border-radius: 100%;
		width: 100%;
		height: 100%;
		z-index: -2;
		opacity: 0;
	}

	/* ── FOUC prevention — initial hidden state before GSAP loads ── */
	:global(.hud-brand-w [data-hud-brand]) { opacity: 0; transform: translateY(-101%); }
	:global([data-hud-scroll]) { opacity: 0; }
	:global(.hud-menu-o [data-hud-menu]) { opacity: 0; transform: translateY(101%); }
	:global([hh-tb='1']), :global([hh-tb='3']) { transform: translateX(10em); }
	:global([hh-tb='2']) { transform: translateX(-10em); }
</style>
