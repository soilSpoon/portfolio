<script lang="ts">
	// Home Hero 섹션
	// 실제 구조: section[home-hero].s > .c.is-home-hero > .grid-main.is-home-hero
	//   4개의 .hh-text-block: "A different" / "Creative" / "approach" / "scroll ↓"
	//   각 블록: div[hh-tb="N"].hh-transform > .hh-text-ovf > h1[split-hero].h-a
</script>

<!-- home-hero ScrollTrigger 트리거 -->
<section home-hero="" class="w-full relative">
	<div class="is-home-hero mx-auto h-screen w-full max-w-none px-[2vw]">
		<!-- 그리드: 12열, 7행 -->
		<div
			class="grid-main is-home-hero grid h-full w-full grid-cols-12 grid-rows-[1fr_min-content_1fr_min-content_1fr_min-content_1fr] gap-x-5 gap-y-0"
		>
			<!-- row 2, col 2-9: "A different" -->
			<div class="hh-text-block hh-1 col-[2/9] row-[2/3] justify-self-start overflow-visible">
				<div hh-tb="1" class="hh-transform will-change-transform">
					<div class="hh-text-ovf overflow-hidden">
						<h1
							split-hero=""
							class="text-h-a leading-none whitespace-nowrap text-[var(--text-color,inherit)] will-change-transform"
						>
							A different
						</h1>
					</div>
				</div>
			</div>

			<!-- row 4, col 7-12: "Creative" -->
			<div class="hh-text-block hh-2 col-[7/12] row-[4/5] justify-self-end overflow-visible">
				<div hh-tb="2" class="hh-transform will-change-transform">
					<div class="hh-text-ovf overflow-hidden">
						<h1
							split-hero=""
							class="text-h-a leading-none whitespace-nowrap text-[var(--text-color,inherit)] will-change-transform"
						>
							Creative
						</h1>
					</div>
				</div>
			</div>

			<!-- row 6, col 3-9: "approach" -->
			<div class="hh-text-block hh-3 col-[3/9] row-[6/7] justify-self-start overflow-visible">
				<div hh-tb="3" class="hh-transform will-change-transform">
					<div class="hh-text-ovf overflow-hidden">
						<h1
							split-hero=""
							class="text-h-a leading-none whitespace-nowrap text-[var(--text-color,inherit)] will-change-transform"
						>
							approach
						</h1>
					</div>
				</div>
			</div>

			<!-- row 7, col 5-9: "scroll ↓" -->
			<div
				class="hh-text-block is--scroll hh-4 col-[5/9] row-[7/8] justify-self-center overflow-visible"
			>
				<div hh-tb="4" class="hh-transform will-change-transform">
					<div class="hh-text-ovf overflow-hidden">
						<div
							split-hero=""
							class="text-regular caps text-[1em] tracking-[0.08em] uppercase opacity-50"
						>
							scroll ↓
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
