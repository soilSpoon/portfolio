<script lang="ts">
	import { VID, gridItems as items } from '$lib/data/grid';
</script>

<section class="s is-hg">
	<div class="c hg-c">
		<div class="spacer-10"></div>

		<!-- ① 텍스트 오버레이: position:absolute;inset:0 → sticky child로 텍스트 고정 -->
		<!-- mix-blend-mode:difference 가 grid 위에서 색상 반전 효과 만듦 -->
		<div pointer-none="" class="hg-grid-overlay mbm-diff">
			<div class="hg-grid-overlay-sticky">
				<!-- position:absolute;bottom:3em;left:0 — 하단 좌측 고정 -->
				<div class="c is-hg-o">
					<h2 split-text="" class="h-b">
						<span class="span-hidden">****</span>
						Elevating Brands in Unexpected Ways.
					</h2>
				</div>
			</div>
		</div>

		<!-- ② 실제 그리드 콘텐츠 -->
		<div class="hg-grid-track">
			<div class="spacer-10"></div>
			<div class="hg-grid-w">
				<div grid-anim="" class="hg-grid">
					{#each items as item, i (i)}
						{#if item.type === 'text'}
							<div class="hg-grid-item is-text">
								<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted static grid data -->
								<div class="text-small caps">{@html item.label}</div>
							</div>
						{:else if item.type === 'vid'}
							<div class="hg-grid-item">
								<div class="hg-grid-inner is-{item.inner}">
									<div class="hg-img-w">
										<div class="hg-img-overlay"></div>
									</div>
									<div class="hg-vid-w">
										<video home-vid="" playsinline loop muted autoplay data-object-fit="cover">
											<source src="{VID}/OFF_siteclips_{item.vid}.mp4" />
										</video>
									</div>
								</div>
							</div>
						{:else}
							<div class="hg-grid-item">
								<div class="hg-grid-inner is-{item.inner}">
									<div class="hg-img-w">
										<div class="hg-img-overlay"></div>
									</div>
								</div>
							</div>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	/* ─── 섹션 ────────────────────────────────────────── */
	.s.is-hg {
		position: relative;
	}

	/* .c: position:relative (overlay의 절대위치 기준점) */
	.c.hg-c {
		position: relative;
		width: 100%;
		padding-left: 2vw;
		padding-right: 2vw;
	}
	.spacer-10 {
		height: 10em;
	}

	/* ─── 오버레이: .c 전체를 덮는 절대 위치 ─────────── */
	/* 원본: z-index:10;position:absolute;inset:0% */
	.hg-grid-overlay {
		position: absolute;
		inset: 0%;
		z-index: 10;
		pointer-events: none;
	}

	/* ─── 스티키 컨테이너: 100vh 고정 ────────────────── */
	/* 원본: height:100vh;position:sticky;top:0 */
	.hg-grid-overlay-sticky {
		height: 100vh;
		position: sticky;
		top: 0;
	}

	/* ─── 텍스트: 스티키 하단 좌측 배치 ─────────────── */
	/* 원본: position:absolute;inset:auto auto 3em 0% */
	.c.is-hg-o {
		position: absolute;
		bottom: 3em;
		left: 0;
		padding-left: 2vw;
		padding-right: 2vw;
		width: 100%;
	}

	/* ─── mix-blend-mode (injected CSS 복원) ─────────── */
	:global(.mbm-diff) {
		mix-blend-mode: difference;
		color: var(--main-light);
		user-select: none;
	}

	/* SplitType .line overflow 마스크 */
	:global(.hg-grid-overlay .line) {
		overflow: hidden;
	}

	/* ─── 헤딩 ─────────────────────────────────────────── */
	.h-b {
		font-size: 5em;
		font-weight: 400;
		text-transform: uppercase;
		line-height: 1;
		letter-spacing: -0.02em;
		margin: 0;
	}
	.span-hidden {
		visibility: hidden;
	}

	/* ─── 그리드 트랙 ─────────────────────────────────── */
	.hg-grid-track {
		position: relative;
	}

	/* ─── 그리드 래퍼 ──────────────────────────────────── */
	/* 원본 Webflow CSS: max-width:40vw;margin:0 auto;position:relative */
	/* 원본 injected CSS: display:grid;place-items:center;width:100%;perspective:4000px */
	.hg-grid-w {
		max-width: 40vw;
		margin-left: auto;
		margin-right: auto;
		position: relative;
		display: grid;
		place-items: center;
		width: 100%;
		perspective: var(--perspective);
		will-change: transform;
	}

	/* ─── 그리드 본체 ──────────────────────────────────── */
	/* 원본 injected: height:50vh!important;perspective;preserve-3d */
	.hg-grid {
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		grid-auto-flow: dense;
		gap: 0.35em;
		height: 50vh;
		perspective: var(--perspective);
		transform-style: preserve-3d;
		will-change: transform;
	}

	/* ─── 아이템 ────────────────────────────────────────── */
	/* 원본: aspect-ratio:14/9;will-change:transform */
	.hg-grid-item {
		aspect-ratio: 14 / 9;
		border-radius: 0.625em;
		overflow: hidden;
		position: relative;
		background-color: rgba(140, 140, 140, 0.1);
		will-change: transform;
	}
	.hg-grid-item.is-text {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		overflow: visible;
		background: none;
	}
	/* text-small: 절대 위치 + translateZ(0) (injected CSS) */
	.text-small.caps {
		font-size: 0.7em;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		line-height: 1.3;
		opacity: 0.6;
		position: absolute;
		transform: translateZ(0);
		-webkit-font-smoothing: antialiased;
	}

	/* ─── 이미지/비디오 래퍼 ──────────────────────────── */
	.hg-grid-inner {
		border-radius: 0.625em;
		height: 100%;
		position: relative;
		background-size: cover;
		background-position: 50%;
	}
	.hg-img-w {
		position: absolute;
		inset: 0;
	}
	.hg-img-overlay {
		position: absolute;
		inset: 0;
		z-index: 1;
	}
	:global(html.dark) .hg-img-overlay {
		background: rgba(29, 29, 29, 0.3);
	}
	:global(html.light) .hg-img-overlay {
		background: rgba(255, 255, 255, 0.3);
	}
	.hg-vid-w {
		position: absolute;
		inset: 0;
		z-index: 2;
	}
	.hg-vid-w video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	/* ─── 배경 이미지 ──────────────────────────────────── */
	:global(.hg-grid-inner.is-1) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bbb71a4e6f4396835c_CMCC.jpg');
	}
	:global(.hg-grid-inner.is-2) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bb2c1b097a069ab009_Kairon%20-%20logo-1.jpg');
	}
	:global(.hg-grid-inner.is-3) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bc1951138700a64251_Breeder%20-%201.jpg');
	}
	:global(.hg-grid-inner.is-4) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bc9a064f7034c1c2ab_DL%20-%201.jpg');
	}
	:global(.hg-grid-inner.is-5) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bcb71a4e6f4396844d_Mantra%20-%202.jpg');
	}
	:global(.hg-grid-inner.is-6) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bc53f7418145c54414_Kairon%20-%201.jpg');
	}
	:global(.hg-grid-inner.is-7) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bce7a3a91e4da982ab_Mantra%20-%203.jpg');
	}
	:global(.hg-grid-inner.is-8) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4be12def5051b902d01_Niftypays%20-%202.jpg');
	}
	:global(.hg-grid-inner.is-9) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4be4b7d8a0d7f1e8c2a_Kairon%20-%202.jpg');
	}
	:global(.hg-grid-inner.is-10) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4be89aeb93f1651f9b2_Niftypays%20-%201.jpg');
	}
	:global(.hg-grid-inner.is-11) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bca10d9c1c9e2e5a1b_Breeder%20-%202.jpg');
	}
	:global(.hg-grid-inner.is-12) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bc89aeb93f1651f9b2_Mantra%20-%201.jpg');
	}
	:global(.hg-grid-inner.is-13) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bcb71a4e6f43968456_DL%20-%202.jpg');
	}
	:global(.hg-grid-inner.is-14) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bdea6f38c9e2f91a34_Kairon%20-%203.jpg');
	}
	:global(.hg-grid-inner.is-15) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bd1951138700a64270_Niftypays%20-%203.jpg');
	}
	:global(.hg-grid-inner.is-16) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bd9a064f7034c1c2c3_Mantra%20-%204.jpg');
	}
	:global(.hg-grid-inner.is-17) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bdb71a4e6f43968468_Breeder%20-%203.jpg');
	}
	:global(.hg-grid-inner.is-18) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bd53f7418145c54428_DL%20-%203.jpg');
	}
	:global(.hg-grid-inner.is-19) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bde7a3a91e4da982c4_Kairon%20-%204.jpg');
	}
	:global(.hg-grid-inner.is-20) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4be12def5051b902d0e_Niftypays%20-%204.jpg');
	}
	:global(.hg-grid-inner.is-21) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4be4b7d8a0d7f1e8c38_Mantra%20-%205.jpg');
	}
	:global(.hg-grid-inner.is-22) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4be8c75728dbc28ce86_Mantra%20-%205.jpg');
	}
	:global(.hg-grid-inner.is-23) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4be89aeb93f1651f9c0_Breeder%20-%204.jpg');
	}
	:global(.hg-grid-inner.is-24) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bea10d9c1c9e2e5a2e_DL%20-%204.jpg');
	}
	:global(.hg-grid-inner.is-25) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bfea6f38c9e2f91a4a_Kairon%20-%205.jpg');
	}
	/* is-26~ : 원본 CDN 동적 로드분 — 기존 이미지 재활용 */
	:global(.hg-grid-inner.is-26) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bc89aeb93f1651f9b2_Mantra%20-%201.jpg');
	}
	:global(.hg-grid-inner.is-27) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bcb71a4e6f43968456_DL%20-%202.jpg');
	}
	:global(.hg-grid-inner.is-28) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bd1951138700a64270_Niftypays%20-%203.jpg');
	}
	:global(.hg-grid-inner.is-29) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bde7a3a91e4da982c4_Kairon%20-%204.jpg');
	}
	:global(.hg-grid-inner.is-30) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bd53f7418145c54428_DL%20-%203.jpg');
	}
	:global(.hg-grid-inner.is-31) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4be12def5051b902d01_Niftypays%20-%202.jpg');
	}
	:global(.hg-grid-inner.is-32) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4be4b7d8a0d7f1e8c2a_Kairon%20-%202.jpg');
	}
	:global(.hg-grid-inner.is-33) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4be89aeb93f1651f9b2_Niftypays%20-%201.jpg');
	}
	:global(.hg-grid-inner.is-34) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4be8c75728dbc28ce86_Mantra%20-%205.jpg');
	}
	:global(.hg-grid-inner.is-35) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bc53f7418145c54414_Kairon%20-%201.jpg');
	}
	:global(.hg-grid-inner.is-36) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bc9a064f7034c1c2ab_DL%20-%201.jpg');
	}
	:global(.hg-grid-inner.is-37) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/64ddf4bcb71a4e6f4396844d_Mantra%20-%202.jpg');
	}
</style>
