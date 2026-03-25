<script lang="ts">
	import LogoSvg from './LogoSvg.svelte';
</script>

<!-- data-hide="tab": 태블릿에서 숨김 -->
<section data-hide="tab" data-hsc-section class="hsc-section w-full overflow-clip">
	<div hsc-track="" class="hsc-track relative min-h-[300vh]">
		<div class="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
			<!-- 중앙 텍스트 (스크롤하면 슬라이드인) -->
			<div class="pointer-events-none absolute inset-0 z-3 flex items-center justify-center">
				<div hsc-text="" class="max-w-[60vw] overflow-hidden text-center">
					<div
						split-text=""
						data-hsc-heading
						class="text-[2.25em] leading-[1.2] font-normal tracking-[-0.01em] uppercase"
					>
						Where Different Is the Standard. Choose Off+Brand.
					</div>
				</div>
			</div>

			<!-- 중앙 아이콘 (scale + rotate) -->
			<div
				hsc-scale=""
				class="hsc-inner pointer-events-none absolute inset-0 z-1 flex items-center justify-center"
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
	/* SVG sizing */
	.hsc-img :global(svg) { width: 100%; height: 100%; }
	:global(html.dark) .hsc-img :global(.hsc-img-path) { fill: white; }
	:global(html.light) .hsc-img :global(.hsc-img-path) { fill: black; }

	/* mix-blend-mode — section level */
	:global(html.dark) .hsc-section { mix-blend-mode: lighten; }
	:global(html.light) .hsc-section { mix-blend-mode: darken; }

	/* mix-blend-mode — inner wrapper with background */
	:global(html.dark) .hsc-inner { background: black; mix-blend-mode: multiply; }
	:global(html.light) .hsc-inner { background: white; mix-blend-mode: lighten; }

	/* text color: always dark regardless of theme */
	:global(html.light) .hsc-track :global([data-hsc-heading]) { color: var(--color-main-dark); }
	:global(html.dark) .hsc-track :global([data-hsc-heading]) { color: var(--color-main-dark); }

	/* gradient background */
	.hs-track-ul {
		position: absolute;
		inset: 0%;
		z-index: -1;
		width: 100%;
		height: 100vh;
		background-image: linear-gradient(255deg, #facb0e, #f06ba8 30%, #78bae6 65%, #fff);
	}
	.hs-track-ul::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image: linear-gradient(255deg, #f06ba8, #facb0e 30%, #78bae6 65%, #fff);
		animation: loopGradient 5s infinite;
	}
	@keyframes loopGradient {
		0% { opacity: 0; }
		50% { opacity: 1; }
		100% { opacity: 0; }
	}
</style>
