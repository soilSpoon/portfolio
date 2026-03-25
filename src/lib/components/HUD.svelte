<script lang="ts">
	import { onMount } from 'svelte';
	interface Props { currentPath?: string; }
	let { currentPath = '/' }: Props = $props();

	let menuOpen = $state(false);
	let isDark = $state(true);

	function toggleMenu() { menuOpen = !menuOpen; }

	function toggleMode() {
		isDark = !isDark;
		const html = document.documentElement;
		if (isDark) {
			html.classList.remove('light');
			html.classList.add('dark');
			localStorage.setItem('colorMode', 'dark');
		} else {
			html.classList.remove('dark');
			html.classList.add('light');
			localStorage.setItem('colorMode', 'light');
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
<div class="hud-w">
	<div class="c is-hud">
		<div class="hud-content">

			<!-- ─── 브랜드 로고 (top-left) ──────────────────────────────────── -->
			<div class="hud-brand-w">
				<a href="/" class="hud-brand-link" aria-label="OFF+BRAND home">
					<div class="hud-brand-img w-embed">
						<svg viewBox="0 0 162 162" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<path
								d="M108 88.7c-10.8 0-19.7 8.8-19.7 19.7v47.4c0 1.9-1.5 3.4-3.4 3.4h-8.6c-1.9 0-3.4-1.5-3.4-3.4v-47.4c0-10.8-8.8-19.7-19.7-19.7H6.4c-1.9 0-3.4-1.5-3.4-3.4v-8c0-1.9 1.5-3.4 3.4-3.4h46.9c10.8 0 19.7-8.8 19.6-19.7V6.4c0-1.9 1.5-3.4 3.4-3.4H85c1.9 0 3.4 1.5 3.4 3.4v47.8c0 10.8 8.8 19.7 19.7 19.7h46.6c1.9 0 3.4 1.5 3.4 3.4v8c0 1.9-1.5 3.4-3.4 3.4H108z"
								style="fill-rule:evenodd;clip-rule:evenodd;"
								fill="var(--text-color, currentColor)"
							/>
						</svg>
					</div>
				</a>
			</div>

			<!-- ─── 스크롤 인디케이터 (bottom-left) ──────────────────────────── -->
			<div class="hud-scroll-w" aria-hidden="true">
				<div class="hud-scroll-inner">
					<div class="hud-scroll-line-top"></div>
					<div class="hud-scroll-dot"></div>
					<div class="hud-scroll-line-btm"></div>
				</div>
			</div>

			<!-- ─── 메뉴 오버레이 (.hud-menu-o) — 버튼 + 배경 + 콘텐츠 포함 ── -->
			<div class="hud-menu-o" class:is-open={menuOpen}>
				<!-- 메뉴 햄버거 버튼 -->
				<button
					type="button"
					aria-label="menu"
					aria-expanded={menuOpen}
					class="hud-menu-w"
					class:is-open={menuOpen}
					onclick={toggleMenu}
				>
					<div class="hud-menu-c">
						<div class="hud-menu-line is-1"></div>
						<div class="hud-menu-line is-2"></div>
						<div class="hud-menu-line is-3"></div>
					</div>
				</button>

				<!-- 메뉴 배경 (작은 원에서 전체화면으로 확장) -->
				<div class="hud-menu-bg"></div>

				<!-- 메뉴 콘텐츠: nav + 다크/라이트 토글 + 소셜 -->
				<div class="hud-menu-content">
					<nav class="hud-menu-link-w" aria-label="Main navigation">
						<a href="/" class="hud-menu-link o-hidden menu-l2" class:active={currentPath === '/'}>Home</a>
						<a href="/about" class="hud-menu-link o-hidden menu-l2" class:active={currentPath.startsWith('/about')}>About Us</a>
						<a href="/work" class="hud-menu-link o-hidden menu-l2" class:active={currentPath.startsWith('/work')}>Work</a>
						<a href="/services" class="hud-menu-link o-hidden menu-l2" class:active={currentPath.startsWith('/services')}>Services</a>
						<a href="/contact" class="hud-menu-link o-hidden menu-l2" class:active={currentPath.startsWith('/contact')}>Contact</a>
					</nav>

					<!-- 다크/라이트 토글 (메뉴 안) -->
					<div class="hud-mode-o-hidden">
						<button
							type="button"
							aria-label="Toggle colour theme"
							aria-pressed={!isDark}
							mode-toggle={isDark ? 'dark' : 'light'}
							class="hud-mode-toggle-w"
							onclick={toggleMode}
						>
							<div class="mode-toggle-track">
								<div class="mode-toggle-inner">
									<div class="mode-toggle-btn" class:is-light={!isDark}></div>
								</div>
							</div>
						</button>
					</div>

					<!-- 소셜 링크 -->
					<div class="hud-menu-socials">
						<a href="https://twitter.com/itsoffbrand" class="hud-social-link" target="_blank" rel="noopener">Twitter</a>
						<a href="https://instagram.com/itsoffbrand" class="hud-social-link" target="_blank" rel="noopener">Instagram</a>
						<a href="https://linkedin.com/company/itsoffbrand" class="hud-social-link" target="_blank" rel="noopener">LinkedIn</a>
					</div>
				</div>
			</div>

		</div><!-- /.hud-content -->
	</div><!-- /.c.is-hud -->
</div><!-- /.hud-w -->

<style>
	/* ─── HUD 컨테이너 ──────────────────────────────────────────────────────── */
	.hud-w {
		position: fixed;
		inset: 0;
		z-index: 1000;
		pointer-events: none;
	}
	.c.is-hud {
		position: relative;
		width: 100%;
		height: 100%;
		padding-left: 2vw;
		padding-right: 2vw;
	}
	/* hud-content: full 100% × 100% container, absolute children positioned within */
	.hud-content {
		position: relative;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	/* ─── 브랜드 로고 (top-left absolute) ─────────────────────────────────── */
	.hud-brand-w {
		position: absolute;
		inset: 0% auto auto 0%;
		padding-top: 1.5em;
		pointer-events: all;
	}
	.hud-brand-link {
		display: block;
		width: 2.2em;
		height: 2.2em;
		text-decoration: none;
	}
	.hud-brand-img svg {
		width: 100%;
		height: 100%;
	}

	/* ─── 스크롤 인디케이터 (bottom-left absolute) ─────────────────────────── */
	.hud-scroll-w {
		position: absolute;
		inset: auto auto 0% 0%;
		padding-bottom: 1.5em;
		display: flex;
		align-items: flex-end;
		pointer-events: none;
	}
	.hud-scroll-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		row-gap: 0.2em;
	}
	.hud-scroll-line-top,
	.hud-scroll-line-btm {
		width: 1px;
		background: currentColor;
		opacity: 0.4;
	}
	.hud-scroll-line-top {
		height: 5rem;
		transform-origin: top center;
		animation: scrollPulse 4s infinite ease-in-out;
	}
	.hud-scroll-line-btm { height: 3.5rem; }
	.hud-scroll-dot {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: currentColor;
		opacity: 0.5;
	}
	@keyframes scrollPulse {
		0%   { transform: scale3d(1, 0, 1); opacity: 0; }
		50%  { transform: scale3d(1, 1, 1); opacity: 1; }
		100% { transform: scale3d(1, 0, 1); opacity: 0; }
	}

	/* ─── 메뉴 오버레이 (.hud-menu-o) ────────────────────────────────────── */
	.hud-menu-o {
		position: absolute;
		inset: 0% 0% auto auto;   /* top-right */
		z-index: 999;
		pointer-events: none;
	}
	.hud-menu-o.is-open {
		pointer-events: all;
	}

	/* ─── 메뉴 버튼 (top-right) ──────────────────────────────────────────── */
	.hud-menu-w {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.76rem 0.48rem;
		pointer-events: all;
		position: absolute;
		top: 1.5em;
		right: 0;
		z-index: 1001;
	}
	.hud-menu-c {
		width: 2rem;
		height: 1.5rem;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.hud-menu-line {
		width: 1.5rem;
		height: 1px;
		background: currentColor;
		transition: transform 0.3s ease, opacity 0.3s ease;
		display: block;
	}
	.hud-menu-w.is-open .hud-menu-line.is-1 { transform: translateY(0.6rem) rotate(45deg); }
	.hud-menu-w.is-open .hud-menu-line.is-2 { opacity: 0; }
	.hud-menu-w.is-open .hud-menu-line.is-3 { transform: translateY(-0.6rem) rotate(-45deg); }

	/* ─── 메뉴 배경 ──────────────────────────────────────────────────────── */
	.hud-menu-bg {
		position: fixed;
		inset: 0;
		background: var(--bg-color, #1d1d1d);
		opacity: 0;
		transition: opacity 0.4s ease;
		pointer-events: none;
		z-index: 0;
	}
	.hud-menu-o.is-open .hud-menu-bg {
		opacity: 0.97;
		pointer-events: all;
	}

	/* ─── 메뉴 콘텐츠 ────────────────────────────────────────────────────── */
	.hud-menu-content {
		position: fixed;
		inset: 0;
		z-index: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
		padding-left: 4vw;
		gap: 2.5rem;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.3s ease 0.1s;
	}
	.hud-menu-o.is-open .hud-menu-content {
		opacity: 1;
		pointer-events: all;
	}
	.hud-menu-link-w {
		display: flex;
		flex-direction: column;
		gap: 0.2em;
	}
	.hud-menu-link {
		font-size: 3.5em;
		font-weight: 400;
		text-transform: uppercase;
		text-decoration: none;
		color: var(--text-color, #e5e4e0);
		line-height: 1;
		letter-spacing: -0.02em;
		transition: opacity 0.2s ease;
		opacity: 0.5;
		display: block;
	}
	.hud-menu-link.active,
	.hud-menu-link:hover { opacity: 1; }

	/* ─── 모드 토글 ──────────────────────────────────────────────────────── */
	.hud-mode-o-hidden { overflow: hidden; }
	.hud-mode-toggle-w {
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		pointer-events: all;
	}
	.mode-toggle-track {
		width: 2.4em;
		height: 1.2em;
		border: 1px solid currentColor;
		border-radius: 6em;
		overflow: hidden;
		opacity: 0.6;
	}
	.mode-toggle-inner {
		width: 100%;
		height: 100%;
		position: relative;
	}
	.mode-toggle-btn {
		position: absolute;
		left: 2px;
		top: 50%;
		transform: translateY(-50%);
		width: 0.8em;
		height: 0.8em;
		border-radius: 50%;
		background: currentColor;
		transition: left 0.3s ease;
	}
	.mode-toggle-btn.is-light { left: calc(100% - 0.9em); }

	/* ─── 소셜 링크 ──────────────────────────────────────────────────────── */
	.hud-menu-socials {
		display: flex;
		gap: 2em;
	}
	.hud-social-link {
		font-size: 0.8em;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		color: currentColor;
		opacity: 0.5;
		transition: opacity 0.2s ease;
	}
	.hud-social-link:hover { opacity: 1; }
</style>
