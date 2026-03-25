<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Preloader from '$lib/components/Preloader.svelte';
	import Cursor from '$lib/components/Cursor.svelte';
	import HUD from '$lib/components/HUD.svelte';
	import Orb from '$lib/components/Orb.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	let preloaderDone = $state(false);
	let currentPath = $derived(page.url.pathname);

	onMount(() => {
		// 다크/라이트 모드 초기화
		const saved = localStorage.getItem('colorMode');
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const mode = saved ?? (prefersDark ? 'dark' : 'light');
		document.documentElement.classList.add(mode);
	});

	function handlePreloaderDone() {
		preloaderDone = true;
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- ─── 커스텀 커서 ─────────────────────────────────────────────────────────── -->
<Cursor />

<!-- ─── HUD (fixed nav) ───────────────────────────────────────────────────── -->
<HUD {currentPath} />

<!-- ─── 전역 Orb (fixed, z-index:-2) ────────────────────────────────────────
     실제 사이트: <div data-orb-wrap="" pointer-none="" class="orb-w">
                    <div data-orb="" class="orb"></div>
                    <div orb-out-w="1" class="orb-outline-w">...</div>
                    <div orb-out-w="2" class="orb-outline-w is-2">...</div>
                  </div>
-->
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

<!-- ─── pagew-grid (배경 그리드 가이드) ───────────────────────────────────── -->
<div class="pagew-grid">
	<div class="pagew-block is--1"></div>
	<div class="pagew-block is--2"></div>
	<div class="pagew-block is--1"></div>
	<div class="pagew-block is--2"></div>
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
<Preloader onDone={handlePreloaderDone} />

<!-- ─── 페이지 콘텐츠 ─────────────────────────────────────────────────────── -->
<div class="page-w">
	{@render children()}
</div>

<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>
