<script lang="ts">
	// Home Hero 섹션
	// 실제 구조: section[home-hero] > [data-home-hero] > grid
	//   3줄 타이포 + scroll indicator
</script>

<!-- home-hero ScrollTrigger 트리거 -->
<section home-hero="" class="w-full relative">
	<div data-home-hero class="mx-auto h-screen w-full max-w-none px-[2vw]">
		<!-- 그리드: 12열, 7행 -->
		<div
			class="grid h-full w-full grid-cols-12 grid-rows-[1fr_min-content_1fr_min-content_1fr_min-content_1fr] gap-x-5 gap-y-0"
		>
			<!-- row 2: 이대희 — 한글 3글자는 영문보다 작으므로 10em으로 스케일업 -->
			<div class="hh-text-block hh-1 col-[2/11] row-[2/3] justify-self-start overflow-visible">
				<div hh-tb="1" class="hh-transform will-change-transform">
					<div class="hh-text-ovf overflow-hidden">
						<h1
							split-hero=""
							class="text-[10em] leading-none whitespace-nowrap text-text will-change-transform tracking-[0.05em]"
						>
							이대희
						</h1>
					</div>
				</div>
			</div>

			<!-- row 4: Full-stack -->
			<div class="hh-text-block hh-2 col-[5/12] row-[4/5] justify-self-end overflow-visible">
				<div hh-tb="2" class="hh-transform will-change-transform">
					<div class="hh-text-ovf overflow-hidden">
						<h1
							split-hero=""
							class="text-h-a leading-none whitespace-nowrap text-text will-change-transform"
						>
							Full-stack
						</h1>
					</div>
				</div>
			</div>

			<!-- row 6: Developer -->
			<div class="hh-text-block hh-3 col-[3/11] row-[6/7] justify-self-start overflow-visible">
				<div hh-tb="3" class="hh-transform will-change-transform">
					<div class="hh-text-ovf overflow-hidden">
						<h1
							split-hero=""
							class="text-h-a leading-none whitespace-nowrap text-text will-change-transform"
						>
							Developer
						</h1>
					</div>
				</div>
			</div>

			<!-- row 7: scroll -->
			<div
				class="hh-text-block is--scroll hh-4 col-[5/9] row-[7/8] justify-self-center overflow-visible"
			>
				<div hh-tb="4" class="hh-transform will-change-transform">
					<div class="hh-text-ovf overflow-hidden">
						<div
							split-hero=""
							class="text-[1.2em] tracking-[0.08em] uppercase opacity-50"
						>
							scroll ↓
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
