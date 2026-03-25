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
	실제 bundle 구조:
	  .hud-w (fixed, inset: 0)
	    .c.is-hud (100% × 100%, position: relative)
	      .hud-content (100% × 100%, position: relative)
	        .hud-brand-w   — top-left (position: absolute; inset: 0% auto auto 0%)
	        .hud-scroll-w  — bottom-left (position: absolute; inset: auto auto 0% 0%)
	        .hud-menu-o    — top-right 메뉴 오버레이 (버튼 + bg + nav + 다크/라이트 토글 포함)
-->
<div class="hud-w pointer-events-none fixed inset-0">
	<div class="c is-hud relative h-full w-full px-[2vw]">
		<div class="hud-content pointer-events-none relative h-full w-full">
			<!-- ─── 브랜드 로고 (top-left) ──────────────────────────────────── -->
			<div class="hud-brand-w pointer-events-auto absolute inset-[0%_auto_auto_0%] pt-6">
				<a
					href={resolve('/')}
					data-hud-brand
					class="hud-brand-link block h-[2.2em] w-[2.2em] no-underline"
					aria-label="OFF+BRAND home"
				>
					<div class="hud-brand-img w-embed">
						<LogoSvg />
					</div>
				</a>
			</div>

			<!-- ─── 스크롤 인디케이터 (bottom-right, 메뉴 버튼 왼쪽) ──────────────────────────── -->
			<div
				data-hud-scroll
				class="hud-scroll-w pointer-events-none absolute inset-[auto_4em_0%_auto] flex items-end pb-6"
				aria-hidden="true"
			>
				<div class="hud-scroll-inner flex flex-col items-center gap-y-[0.2em]">
					<div class="hud-scroll-line-top"></div>
					<div class="hud-scroll-dot"></div>
					<div class="hud-scroll-line-btm"></div>
				</div>
			</div>

			<!-- ─── 우상단 네비게이션 링크 ─────────────────────────────────── -->
			<div
				class="hud-nav-w pointer-events-auto absolute top-6 right-16 flex items-center gap-8"
			></div>

			<!-- ─── 메뉴 오버레이 (.hud-menu-o) — 버튼 + 배경 + 콘텐츠 포함 ── -->
			<div
				class="hud-menu-o pointer-events-none absolute inset-[auto_0%_0%_auto]"
				class:is-open={menuOpen}
			>
				<!-- 메뉴 햄버거 버튼 -->
				<button
					type="button"
					aria-label="menu"
					aria-expanded={menuOpen}
					data-hud-menu
					class="hud-menu-w pointer-events-auto absolute right-0 bottom-6 cursor-pointer border-none bg-none p-[0.76rem_0.48rem]"
					class:is-open={menuOpen}
					onclick={toggleMenu}
				>
					<div class="hud-menu-c relative flex h-[1.5rem] w-[2rem] flex-col justify-between">
						<div class="hud-menu-line is-1 block h-px w-[1.5rem] bg-current"></div>
						<div class="hud-menu-line is-2 block h-px w-[1.5rem] bg-current"></div>
						<div class="hud-menu-line is-3 block h-px w-[1.5rem] bg-current"></div>
					</div>
				</button>

				<!-- 메뉴 배경 (작은 원에서 전체화면으로 확장) -->
				<div class="hud-menu-bg pointer-events-none fixed inset-0"></div>

				<!-- 메뉴 콘텐츠: nav + 다크/라이트 토글 + 소셜 -->
				<div
					class="hud-menu-content pointer-events-none fixed inset-0 flex flex-col items-start justify-center gap-[2.5rem] pl-[4vw]"
				>
					<nav class="hud-menu-link-w flex flex-col gap-[0.2em]" aria-label="Main navigation">
						<a
							href={resolve('/')}
							class="hud-menu-link menu-l2 block overflow-hidden no-underline"
							class:active={currentPath === '/'}>Home</a
						>
					</nav>

					<!-- 다크/라이트 토글 (메뉴 안) -->
					<div class="hud-mode-o-hidden overflow-hidden">
						<button
							type="button"
							aria-label="Toggle colour theme"
							aria-pressed={!isDark}
							mode-toggle={isDark ? 'dark' : 'light'}
							class="hud-mode-toggle-w pointer-events-auto cursor-pointer border-none bg-none p-0"
							onclick={toggleMode}
						>
							<div
								class="mode-toggle-track h-[1.2em] w-[2.4em] overflow-hidden rounded-[6em] border border-current"
							>
								<div class="mode-toggle-inner relative h-full w-full">
									<div
										class="mode-toggle-btn absolute top-1/2 h-[0.8em] w-[0.8em] rounded-full bg-current"
										class:is-light={!isDark}
									></div>
								</div>
							</div>
						</button>
					</div>

					<!-- 소셜 링크 -->
					<div class="hud-menu-socials flex gap-8">
						<a
							href="https://twitter.com/itsoffbrand"
							class="hud-social-link no-underline"
							target="_blank"
							rel="noopener noreferrer">Twitter</a
						>
						<a
							href="https://instagram.com/itsoffbrand"
							class="hud-social-link no-underline"
							target="_blank"
							rel="noopener noreferrer">Instagram</a
						>
						<a
							href="https://linkedin.com/company/itsoffbrand"
							class="hud-social-link no-underline"
							target="_blank"
							rel="noopener noreferrer">LinkedIn</a
						>
					</div>
				</div>
			</div>
		</div>
		<!-- /.hud-content -->
	</div>
	<!-- /.c.is-hud -->
</div>

<!-- /.hud-w -->

<style>
	/* ─── HUD 컨테이너 z-index ──────────────────────────────────────────── */
	.hud-w {
		z-index: 1000;
	}

	/* ─── 브랜드 로고 SVG sizing ─────────────────────────────────────────── */
	.hud-brand-img :global(svg) {
		width: 100%;
		height: 100%;
	}

	/* ─── 스크롤 인디케이터 lines/dot ─────────────────────────────────────── */
	.hud-scroll-line-top,
	.hud-scroll-line-btm {
		width: 1px;
		background: currentColor;
		opacity: 0.4;
	}
	.hud-scroll-line-top {
		height: 5em;
		transform-origin: top center;
		animation: scrollPulse 4s infinite ease-in-out;
	}
	.hud-scroll-line-btm {
		height: 3.5em;
	}
	.hud-scroll-dot {
		width: 0.5em;
		height: 0.5em;
		border-radius: 50%;
		background: currentColor;
		opacity: 0.5;
	}
	@keyframes scrollPulse {
		0% {
			transform: scale3d(1, 0, 1);
			opacity: 0;
		}
		50% {
			transform: scale3d(1, 1, 1);
			opacity: 1;
		}
		100% {
			transform: scale3d(1, 0, 1);
			opacity: 0;
		}
	}

	/* ─── 메뉴 오버레이 z-index ──────────────────────────────────────────── */
	.hud-menu-o {
		z-index: 999;
	}
	.hud-menu-o.is-open {
		pointer-events: all;
	}

	/* ─── 메뉴 버튼 z-index ──────────────────────────────────────────────── */
	.hud-menu-w {
		z-index: 1001;
	}

	/* ─── 메뉴 라인 애니메이션 ───────────────────────────────────────────── */
	.hud-menu-line {
		transition:
			transform 0.3s ease,
			opacity 0.3s ease;
	}
	.hud-menu-w.is-open .hud-menu-line.is-1 {
		transform: translateY(0.6rem) rotate(45deg);
	}
	.hud-menu-w.is-open .hud-menu-line.is-2 {
		opacity: 0;
	}
	.hud-menu-w.is-open .hud-menu-line.is-3 {
		transform: translateY(-0.6rem) rotate(-45deg);
	}

	/* ─── 메뉴 배경 ──────────────────────────────────────────────────────── */
	.hud-menu-bg {
		background: var(--bg-color, #1d1d1d);
		opacity: 0;
		transition: opacity 0.4s ease;
		z-index: 0;
	}
	.hud-menu-o.is-open .hud-menu-bg {
		opacity: 0.97;
		pointer-events: all;
	}

	/* ─── 메뉴 콘텐츠 ────────────────────────────────────────────────────── */
	.hud-menu-content {
		z-index: 1;
		opacity: 0;
		transition: opacity 0.3s ease 0.1s;
	}
	.hud-menu-o.is-open .hud-menu-content {
		opacity: 1;
		pointer-events: all;
	}

	/* ─── 메뉴 링크 스타일 ───────────────────────────────────────────────── */
	.hud-menu-link {
		font-size: var(--font-size-h-b);
		font-weight: 400;
		text-transform: uppercase;
		color: var(--text-color, #e5e4e0);
		line-height: 1;
		letter-spacing: -0.02em;
		transition: opacity 0.2s ease;
		opacity: 0.5;
	}
	.hud-menu-link.active,
	.hud-menu-link:hover {
		opacity: 1;
	}

	/* ─── 모드 토글 ──────────────────────────────────────────────────────── */
	.mode-toggle-track {
		opacity: 0.6;
	}
	.mode-toggle-btn {
		left: 2px;
		transform: translateY(-50%);
		transition: left 0.3s ease;
	}
	.mode-toggle-btn.is-light {
		left: calc(100% - 0.9em);
	}

	/* ─── 소셜 링크 ──────────────────────────────────────────────────────── */
	.hud-social-link {
		font-size: var(--font-size-sm);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: currentColor;
		opacity: 0.5;
		transition: opacity 0.2s ease;
	}
	.hud-social-link:hover {
		opacity: 1;
	}
</style>
