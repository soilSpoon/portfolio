<script lang="ts">
	import LogoSvg from './LogoSvg.svelte';
</script>

<!-- data-hide="tab": 태블릿에서 숨김 -->
<section data-hide="tab" data-hsc-section class="hsc-section w-full overflow-clip mix-blend-darken dark:mix-blend-lighten">
	<div hsc-track="" class="hsc-track relative min-h-[300vh]">
		<div class="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
			<!-- 중앙 텍스트 (스크롤하면 슬라이드인) -->
			<div class="pointer-events-none absolute inset-0 z-3 flex items-center justify-center">
				<div hsc-text="" class="max-w-[60vw] overflow-hidden text-center">
					<div
						split-text=""
						data-hsc-heading
						class="text-[2.25em] leading-[1.2] font-normal tracking-[-0.01em] uppercase text-main-dark"
					>
						Build Efficiently. Ship Relentlessly.
					</div>
				</div>
			</div>

			<!-- 중앙 아이콘 (scale + rotate) -->
			<div
				hsc-scale=""
				class="pointer-events-none absolute inset-0 z-1 flex items-center justify-center bg-white dark:bg-black mix-blend-lighten dark:mix-blend-multiply"
			>
				<div hsc-rotate="" class="flex items-center justify-center will-change-transform">
					<div hsc-img="" class="relative h-80 w-80 will-change-transform">
						<!-- OFF+BRAND 로고 SVG (X+원 형태) -->
						<div class="hsc-img h-full w-full">
							<LogoSvg class="h-full w-full" pathClass="fill-black dark:fill-white" />
						</div>
					</div>
				</div>
			</div>

			<!-- 그라데이션 배경 진화 -->
			<div
				gradient-evolve=""
				class="absolute inset-0 -z-1 h-screen w-full bg-[linear-gradient(255deg,#facb0e,#f06ba8_30%,#78bae6_65%,#fff)] before:absolute before:inset-0 before:bg-[linear-gradient(255deg,#f06ba8,#facb0e_30%,#78bae6_65%,#fff)] before:animate-loop-gradient before:content-['']"
			></div>
		</div>
	</div>
</section>

