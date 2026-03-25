<script lang="ts">
	import LogoSvg from './LogoSvg.svelte';
</script>

<!-- data-hide="tab": 태블릿에서 숨김 -->
<section data-hide="tab" class="s is-hsc overflow-clip">
	<div hsc-track="" class="hsc-track relative min-h-[300vh]">
		<div class="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
			<!-- 중앙 텍스트 (스크롤하면 슬라이드인) -->
			<div class="pointer-events-none absolute inset-0 z-3 flex items-center justify-center">
				<div hsc-text="" class="max-w-[60vw] overflow-hidden text-center">
					<div
						split-text=""
						class="h-c is-anim text-[2.25em] leading-[1.2] font-normal tracking-[-0.01em] uppercase"
					>
						Where Different Is the Standard. Choose Off+Brand.
					</div>
				</div>
			</div>

			<!-- 중앙 아이콘 (scale + rotate) -->
			<div
				hsc-scale=""
				class="c is-hsc pointer-events-none absolute inset-0 z-1 flex items-center justify-center"
			>
				<div hsc-rotate="" class="flex items-center justify-center will-change-transform">
					<div hsc-img="" class="relative h-80 w-80 will-change-transform">
						<!-- OFF+BRAND 로고 SVG (X+원 형태) -->
						<div class="hsc-img h-full w-full">
							<LogoSvg pathClass="hsc-img-path" />
						</div>
					</div>
				</div>
			</div>

			<!-- 그라데이션 배경 진화 -->
			<div gradient-evolve="" class="hs-track-ul"></div>
		</div>
	</div>
</section>

<style>
	/* ─── SVG sizing ─────────────────────────────────────────────────────────── */
	.hsc-img :global(svg) {
		width: 100%;
		height: 100%;
	}

	/* ─── Cross path fill: theme-dependent ───────────────────────────────────── */
	:global(html.dark) .hsc-img :global(.hsc-img-path) {
		fill: white;
	}
	:global(html.light) .hsc-img :global(.hsc-img-path) {
		fill: black;
	}

	/* ─── mix-blend-mode (다크/라이트 모드별) ──────────────────────────────── */
	:global(html.dark) .s.is-hsc {
		mix-blend-mode: lighten;
	}
	:global(html.dark) .c.is-hsc {
		background: black;
		mix-blend-mode: multiply;
	}
	:global(html.light) .s.is-hsc {
		mix-blend-mode: darken;
	}
	:global(html.light) .c.is-hsc {
		background: white;
		mix-blend-mode: lighten;
	}

	/* ─── HSC 텍스트 색상 (다크/라이트 모두 var(--main-dark)) ──────────────── */
	:global(html.light) .hsc-track :global(.h-c) {
		color: var(--main-dark);
	}
	:global(html.dark) .hsc-track :global(.h-c) {
		color: var(--main-dark);
	}

	/* ─── 그라데이션 배경 (원본: 255deg 방향 multi-color) ──────────────────── */
	.hs-track-ul {
		position: absolute;
		inset: 0%;
		z-index: -1;
		width: 100%;
		height: 100vh;
		background-image: linear-gradient(255deg, #facb0e, #f06ba8 30%, #78bae6 65%, #fff);
	}
	/* Pseudo-element: 두 번째 그라데이션이 5초 주기로 페이드인/아웃 */
	.hs-track-ul::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image: linear-gradient(255deg, #f06ba8, #facb0e 30%, #78bae6 65%, #fff);
		animation: loopGradient 5s infinite;
	}
	@keyframes loopGradient {
		0% {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
</style>
