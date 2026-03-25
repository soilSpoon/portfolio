<script lang="ts">
	// Home Hero 섹션
	// 실제 구조: section[home-hero].s > .c.is-home-hero > .grid-main.is-home-hero
	//   4개의 .hh-text-block: "A different" / "Creative" / "approach" / "scroll ↓"
	//   각 블록: div[hh-tb="N"].hh-transform > .hh-text-ovf > h1[split-hero].h-a
</script>

<!-- home-hero ScrollTrigger 트리거 -->
<section home-hero="" class="s">
	<div class="c is-home-hero">
		<!-- 그리드: 12열, 7행 -->
		<div class="grid-main is-home-hero">

			<!-- row 2, col 2-9: "A different" -->
			<div class="hh-text-block hh-1">
				<div hh-tb="1" class="hh-transform">
					<div class="hh-text-ovf">
						<h1 split-hero="" class="h-a">A different</h1>
					</div>
				</div>
			</div>

			<!-- row 4, col 7-12: "Creative" -->
			<div class="hh-text-block hh-2">
				<div hh-tb="2" class="hh-transform">
					<div class="hh-text-ovf">
						<h1 split-hero="" class="h-a">Creative</h1>
					</div>
				</div>
			</div>

			<!-- row 6, col 3-9: "approach" -->
			<div class="hh-text-block hh-3">
				<div hh-tb="3" class="hh-transform">
					<div class="hh-text-ovf">
						<h1 split-hero="" class="h-a">approach</h1>
					</div>
				</div>
			</div>

			<!-- row 7, col 5-9: "scroll ↓" -->
			<div class="hh-text-block is--scroll hh-4">
				<div hh-tb="4" class="hh-transform">
					<div class="hh-text-ovf">
						<div split-hero="" class="text-regular caps">scroll ↓</div>
					</div>
				</div>
			</div>

		</div>
	</div>
</section>

<style>
	/* ─── Hero 섹션 ─────────────────────────────────────────────────────────── */
	section.s {
		position: relative;
	}
	.c.is-home-hero {
		height: 100vh;
		width: 100%;
		max-width: none;
		padding-left: 2vw;
		padding-right: 2vw;
		margin: 0 auto;
	}
	.grid-main.is-home-hero {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		grid-template-rows: 1fr min-content 1fr min-content 1fr min-content 1fr;
		column-gap: 1.25em;
		row-gap: 0;
	}

	/* ─── hh-text-block 그리드 배치 ─────────────────────────────────────────── */
	.hh-text-block {
		overflow: visible;
	}
	.hh-1 { grid-area: 2 / 2 / 3 / 9;  justify-self: start; }
	.hh-2 { grid-area: 4 / 7 / 5 / 12; justify-self: end;   }
	.hh-3 { grid-area: 6 / 3 / 7 / 9;  justify-self: start; }
	.hh-4 { grid-area: 7 / 5 / 8 / 9;  justify-self: center; }

	.hh-transform {
		will-change: transform;
	}
	.hh-text-ovf {
		overflow: hidden;
	}

	/* ─── 타이포그래피 ───────────────────────────────────────────────────────── */
	.h-a {
		font-size: 6.75em;
		font-weight: 400;
		text-transform: uppercase;
		line-height: 1;
		letter-spacing: -0.02em;
		margin: 0;
		color: var(--text-color, inherit);
		will-change: transform;
		white-space: nowrap;
	}
	.text-regular.caps {
		font-size: 1em;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		opacity: 0.5;
	}
</style>
