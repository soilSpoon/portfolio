<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import LogoSvg from './LogoSvg.svelte';
	interface Props {
		currentPath?: string;
	}
	let { currentPath = '/' }: Props = $props();

	let menuOpen = $state(false);
	let isDark = $state(true);

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function toggleMode() {
		isDark = !isDark;
		const html = document.documentElement;
		if (isDark) {
			html.classList.remove('light');
			html.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			html.classList.remove('dark');
			html.classList.add('light');
			localStorage.setItem('theme', 'light');
		}
	}

	onMount(() => {
		isDark = !document.documentElement.classList.contains('light');
	});
</script>

<!--
	HUD 구조:
	  fixed overlay (z-1000) > container > content
	    .hud-brand-w   — top-left 로고
	    scroll indicator — bottom-right
	    menu overlay   — 버튼 + bg + nav + toggle
-->
<div class="pointer-events-none fixed inset-0 z-[1000]">
	<div class="relative h-full w-full px-[2vw]">
		<div class="pointer-events-none relative h-full w-full">
			<!-- ─── 브랜드 로고 (top-left) ──────────────────────────────────── -->
			<div class="hud-brand-w pointer-events-auto absolute inset-[0%_auto_auto_0%] pt-6">
				<a
					href={resolve('/')}
					data-hud-brand
					class="hud-brand-link block h-[2.2em] w-[2.2em] no-underline opacity-0 -translate-y-full"
					aria-label="OFF+BRAND home"
				>
					<div class="hud-brand-img w-embed">
						<LogoSvg class="h-full w-full" />
					</div>
				</a>
			</div>

			<!-- ─── 스크롤 인디케이터 (bottom-right) ──────── -->
			<div
				data-hud-scroll
				class="pointer-events-none absolute inset-[auto_4em_0%_auto] flex items-end pb-6 opacity-0"
				aria-hidden="true"
			>
				<div class="flex flex-col items-center gap-y-[0.2em]">
					<div class="h-[5em] w-px bg-current opacity-40 origin-top animate-scroll-pulse"></div>
					<div class="h-[0.5em] w-[0.5em] rounded-full bg-current opacity-50"></div>
					<div class="h-[3.5em] w-px bg-current opacity-40"></div>
				</div>
			</div>

			<!-- ─── 우상단 네비게이션 링크 ─────────────────────────────────── -->
			<div
				class="pointer-events-auto absolute top-6 right-16 flex items-center gap-8"
			></div>

			<!-- ─── 메뉴 오버레이 ── -->
			<div
				class="absolute inset-[auto_0%_0%_auto] z-[999]"
				class:pointer-events-none={!menuOpen}
				class:pointer-events-auto={menuOpen}
			>
				<!-- 메뉴 햄버거 버튼 -->
				<button
					type="button"
					aria-label="menu"
					aria-expanded={menuOpen}
					data-hud-menu
					class="pointer-events-auto absolute right-0 bottom-6 z-[1001] cursor-pointer border-none bg-none p-[0.76rem_0.48rem] opacity-0 translate-y-full"
					onclick={toggleMenu}
				>
					<div class="relative flex h-[1.5rem] w-[2rem] flex-col justify-between">
						<div
							class="block h-px w-[1.5rem] bg-current transition-[transform,opacity] duration-300 ease-[ease]"
							class:translate-y-[0.6rem]={menuOpen}
							class:rotate-45={menuOpen}
						></div>
						<div
							class="block h-px w-[1.5rem] bg-current transition-[transform,opacity] duration-300 ease-[ease]"
							class:opacity-0={menuOpen}
						></div>
						<div
							class="block h-px w-[1.5rem] bg-current transition-[transform,opacity] duration-300 ease-[ease]"
							class:-translate-y-[0.6rem]={menuOpen}
							class:-rotate-45={menuOpen}
						></div>
					</div>
				</button>

				<!-- 메뉴 배경 -->
				<div
					class="pointer-events-none fixed inset-0 z-0 bg-bg transition-opacity duration-[0.4s] ease-[ease]"
					class:opacity-0={!menuOpen}
					class:opacity-97={menuOpen}
					class:pointer-events-auto={menuOpen}
				></div>

				<!-- 메뉴 콘텐츠 -->
				<div
					class="fixed inset-0 z-1 flex flex-col items-start justify-center gap-[2.5rem] pl-[4vw] transition-opacity duration-300 ease-[ease] delay-100"
					class:opacity-0={!menuOpen}
					class:opacity-100={menuOpen}
					class:pointer-events-none={!menuOpen}
					class:pointer-events-auto={menuOpen}
				>
					<nav class="flex flex-col gap-[0.2em]" aria-label="Main navigation">
						<a
							href={resolve('/')}
							class="block overflow-hidden no-underline text-h-b font-normal uppercase text-text leading-none tracking-[-0.02em] transition-opacity duration-200 ease-[ease] hover:opacity-100"
							class:opacity-50={currentPath !== '/'}
							class:opacity-100={currentPath === '/'}
						>Home</a>
					</nav>

					<!-- 다크/라이트 토글 -->
					<div class="overflow-hidden">
						<button
							type="button"
							aria-label="Toggle colour theme"
							aria-pressed={!isDark}
							mode-toggle={isDark ? 'dark' : 'light'}
							class="pointer-events-auto cursor-pointer border-none bg-none p-0"
							onclick={toggleMode}
						>
							<div class="h-[1.2em] w-[2.4em] overflow-hidden rounded-[6em] border border-current opacity-60">
								<div class="relative h-full w-full">
									<div
										class="absolute top-1/2 h-[0.8em] w-[0.8em] -translate-y-1/2 rounded-full bg-current transition-[left] duration-300 ease-[ease]"
										style:left={isDark ? '2px' : 'calc(100% - 0.9em)'}
									></div>
								</div>
							</div>
						</button>
					</div>

					<!-- 소셜 링크 -->
					<div class="flex gap-8">
						<a
							href="https://twitter.com/itsoffbrand"
							class="text-sm uppercase tracking-[0.1em] text-current no-underline opacity-50 transition-opacity duration-200 ease-[ease] hover:opacity-100"
							target="_blank"
							rel="noopener noreferrer">Twitter</a
						>
						<a
							href="https://instagram.com/itsoffbrand"
							class="text-sm uppercase tracking-[0.1em] text-current no-underline opacity-50 transition-opacity duration-200 ease-[ease] hover:opacity-100"
							target="_blank"
							rel="noopener noreferrer">Instagram</a
						>
						<a
							href="https://linkedin.com/company/itsoffbrand"
							class="text-sm uppercase tracking-[0.1em] text-current no-underline opacity-50 transition-opacity duration-200 ease-[ease] hover:opacity-100"
							target="_blank"
							rel="noopener noreferrer">LinkedIn</a
						>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

