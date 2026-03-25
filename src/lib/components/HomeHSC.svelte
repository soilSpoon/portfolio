<script lang="ts">
	// HSC 섹션 (Logo Reveal Scroll — "Where Different Is the Standard")
	// 실제 구조: section[data-hide="tab"].s.is-hsc
	//   > div[hsc-track=""].hsc-track (min-height:300vh)
	//     > .hsc-overlay-w (height:100vh, sticky, top:0, overflow:hidden)
	//       > .hsc-text-w (absolute center) > div[hsc-text=""].hsc-text-oh > h.h-c.is-anim
	//       > div[hsc-scale=""].c.is-hsc (scales)
	//         > div[hsc-rotate=""].hsc-rotate
	//           > div[hsc-img=""].hsc-img-w (20em x 20em)
	//             > .hsc-img.w-embed > SVG (OFF+BRAND 로고)
	//   + div[gradient-evolve=""].hs-track-ul (gradient footer)
</script>

<!-- data-hide="tab": 태블릿에서 숨김 -->
<section data-hide="tab" class="s is-hsc">
	<div hsc-track="" class="hsc-track">
		<div class="hsc-overlay-w">
			<!-- 중앙 텍스트 (스크롤하면 슬라이드인) -->
			<div class="hsc-text-w">
				<div hsc-text="" class="hsc-text-oh">
					<div split-text="" class="h-c is-anim">
						Where Different Is the Standard. Choose Off+Brand.
					</div>
				</div>
			</div>

			<!-- 중앙 아이콘 (scale + rotate) -->
			<div hsc-scale="" class="c is-hsc">
				<div hsc-rotate="" class="hsc-rotate">
					<div hsc-img="" class="hsc-img-w">
						<!-- OFF+BRAND 로고 SVG (X+원 형태) -->
						<div class="hsc-img w-embed">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 162 162" xml:space="preserve">
								<path
									class="hsc-img-path"
									d="M108 88.7c-10.8 0-19.7 8.8-19.7 19.7v47.4c0 1.9-1.5 3.4-3.4 3.4h-8.6c-1.9 0-3.4-1.5-3.4-3.4v-47.4c0-10.8-8.8-19.7-19.7-19.7H6.4c-1.9 0-3.4-1.5-3.4-3.4v-8c0-1.9 1.5-3.4 3.4-3.4h46.9c10.8 0 19.7-8.8 19.6-19.7V6.4c0-1.9 1.5-3.4 3.4-3.4H85c1.9 0 3.4 1.5 3.4 3.4v47.8c0 10.8 8.8 19.7 19.7 19.7h46.6c1.9 0 3.4 1.5 3.4 3.4v8c0 1.9-1.5 3.4-3.4 3.4H108z"
									style="fill-rule:evenodd;clip-rule:evenodd;"
									fill="currentColor"
								/>
							</svg>
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
	/* ─── HSC 섹션 ──────────────────────────────────────────────────────────── */
	.s.is-hsc {
		overflow: clip;
		/* position: relative 없음 — 원본과 동일. 있으면 mix-blend-mode stacking context 깨짐 */
	}
	.hsc-track {
		min-height: 300vh;
		position: relative;
	}
	.hsc-overlay-w {
		height: 100vh;
		position: sticky;
		top: 0;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* ─── 텍스트 (z-index: 3으로 .c.is-hsc 위에 렌더링) ────────────────────── */
	.hsc-text-w {
		position: absolute;
		inset: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 3;
		pointer-events: none;
	}
	.hsc-text-oh {
		overflow: hidden;
		max-width: 60vw;
		text-align: center;
	}
	.h-c.is-anim {
		font-size: 2.25em;
		font-weight: 400;
		text-transform: uppercase;
		line-height: 1.2;
		letter-spacing: -0.01em;
		/* 초기 상태는 GSAP이 제어 (gsap.set으로 opacity:0 설정) */
	}

	/* ─── 스케일 + 회전 래퍼 ────────────────────────────────────────────────── */
	/* position: absolute; inset: 0 → viewport 전체를 덮음
	   mix-blend-mode에 의해 크로스 모양만 그라데이션이 투과되는 구조:
	   - lighten(light): white bg가 gradient를 가리고 black cross만 gradient 통과
	   - multiply(dark): black bg가 gradient를 가리고 white cross만 gradient 통과 */
	.c.is-hsc {
		position: absolute;
		inset: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		pointer-events: none;
		z-index: 1;
	}
	.hsc-rotate {
		display: flex;
		justify-content: center;
		align-items: center;
		will-change: transform;
	}

	/* ─── 아이콘 ─────────────────────────────────────────────────────────────── */
	.hsc-img-w {
		width: 20em;
		height: 20em;
		position: relative;
		will-change: transform;
	}
	.hsc-img {
		width: 100%;
		height: 100%;
	}
	.hsc-img :global(svg) {
		width: 100%;
		height: 100%;
	}

	/* Cross path fill: white in dark mode, black in light mode */
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

	/* HSC 텍스트 색상: 원본과 동일하게 다크/라이트 모드 모두 var(--main-dark) (#1d1d1d)
	   mix-blend-mode: lighten 환경에서 어두운 색이 그라데이션 위로 올바르게 보임 */
	:global(html.light) .hsc-track :global(.h-c) {
		color: var(--main-dark);
	}
	:global(html.dark) .hsc-track :global(.h-c) {
		color: var(--main-dark);
	}

	/* ─── 그라데이션 배경 (원본: 255deg 방향 multi-color) ──────────────────── */
	/* opacity 초기값 없음 — 원본과 동일하게 CSS로 항상 표시.
	   mix-blend-mode가 시각적 마스킹을 담당 */
	.hs-track-ul {
		position: absolute;
		inset: 0%;
		z-index: -1;
		width: 100%;
		height: 100vh;
		background-image: linear-gradient(
			255deg,
			#facb0e,
			#f06ba8 30%,
			#78bae6 65%,
			#fff
		);
	}
	/* Pseudo-element: 두 번째 그라데이션이 5초 주기로 페이드인/아웃 */
	.hs-track-ul::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image: linear-gradient(
			255deg,
			#f06ba8,
			#facb0e 30%,
			#78bae6 65%,
			#fff
		);
		animation: loopGradient 5s infinite;
	}
	@keyframes loopGradient {
		0%   { opacity: 0; }
		50%  { opacity: 1; }
		100% { opacity: 0; }
	}
</style>
