<script lang="ts">
	// Home Work 섹션 (Featured Work)
	// 원본 w-node CSS 기반 정확한 그리드 배치:
	//   .grid-main.is-hw (12-col):
	//     .eb-wrap.is-sticky → grid-area: span1/span2 (cols 1-2)
	//     .grid-main.hcs-grid-w → grid-area: 1/5/2/13 (8-col inner grid)
	//   Each .hcs-item-w → grid-area: span1/span4 (4 of 8 cols = 2 per row)

	// TODO: resolve() 사용 — 해당 라우트 구현 후 전환
	import { resolve } from '$app/paths';
	import { projects } from '$lib/data/projects';

	const crossSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 162 162" xml:space="preserve"><path class="hcs-cross-svg" d="M108 88.7c-10.8 0-19.7 8.8-19.7 19.7v47.4c0 1.9-1.5 3.4-3.4 3.4h-8.6c-1.9 0-3.4-1.5-3.4-3.4v-47.4c0-10.8-8.8-19.7-19.7-19.7H6.4c-1.9 0-3.4-1.5-3.4-3.4v-8c0-1.9 1.5-3.4 3.4-3.4h46.9c10.8 0 19.7-8.8 19.6-19.7V6.4c0-1.9 1.5-3.4 3.4-3.4H85c1.9 0 3.4 1.5 3.4 3.4v47.8c0 10.8 8.8 19.7 19.7 19.7h46.6c1.9 0 3.4 1.5 3.4 3.4v8c0 1.9-1.5 3.4-3.4 3.4H108z" style="fill-rule:evenodd;clip-rule:evenodd;" fill="white"/></svg>`;
</script>

<!-- home-work ScrollTrigger 트리거 -->
<section home-work="" class="s relative">
	<div class="c">
		<div class="spacer-10"></div>
		<!-- 12열 그리드: left sticky (cols 1-2) + right grid (cols 5-12) -->
		<div class="is-hw grid w-full grid-cols-12 gap-5">
			<!-- ─── Left: sticky eyebrow + CTA (cols 1-2) ──────────────── -->
			<div class="hw-left eb-wrap sticky top-20 col-span-2 flex flex-col gap-y-[2rem] self-start">
				<div class="overflow-hidden">
					<h3 stagger-scroll="1" class="h-eyebrow">Featured work</h3>
				</div>
				<div btn-reveal="" class="page-btn-w">
					<div class="flex overflow-hidden">
						<a reveal-target="" href={resolve('/')} class="btn-w">
							<div class="btn-inner">
								<div class="overflow-hidden">
									<div stagger-text="" class="btn-txt">All Work</div>
								</div>
								<div class="btn-icon-w">
									<div class="text-small btn-txt">→</div>
								</div>
							</div>
							<div class="btn-bg-w">
								<div class="btn-bg-fill"></div>
							</div>
						</a>
					</div>
				</div>
			</div>

			<!-- ─── Right: 8-col work grid (cols 5-12) ─────────────────── -->
			<div class="hcs-grid-w relative z-1 col-[5/13] grid grid-flow-dense grid-cols-8 gap-5">
				{#each projects as project (project.slug)}
					<a hover-anim="" href={resolve('/')} class="hcs-item-w">
						<div class="hcs-content-w">
							<div class="hcs-titles-w">
								<div class="hcs-titles">
									<div class="hcs-info-w">
										<p class="text-small caps">{project.name}</p>
										<div class="hcs-title-w">
											{#each project.tags as tag (tag)}
												<p class="text-mini">{tag}</p>
											{/each}
										</div>
									</div>
								</div>
								<div class="hcs-cross-w">
									<div class="hsc-cross">
										<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted static SVG constant -->
										{@html crossSvg}
									</div>
								</div>
							</div>
						</div>
						<div class="hcs-img-w {project.imgClass}"></div>
					</a>
				{/each}
			</div>
		</div>
		<div class="spacer-10"></div>
	</div>
</section>

<style>
	/* ─── 타이포그래피 overrides (component-specific, differ from global) ── */
	/* .h-eyebrow: overrides global — larger font-size (1em vs 0.85em), tighter letter-spacing (0.05em vs 0.08em), line-height 1 vs 1.4 */
	.h-eyebrow {
		font-size: 1em;
		font-weight: 400;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		line-height: 1;
		margin: 0;
	}
	/* .text-small.caps: overrides global — larger font-size (1em vs 0.8em), different letter-spacing for work card labels */
	.text-small.caps {
		font-size: 1em;
		font-weight: 400;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		margin: 0;
	}
	/* .text-mini: overrides global — adds text-transform, line-height, opacity, margin for work card tags */
	.text-mini {
		font-size: 0.75em;
		font-weight: 400;
		text-transform: uppercase;
		line-height: 1;
		opacity: 0.7;
		margin: 0;
	}

	/* ─── work item: 8열 중 4열 span, 1:1, GSAP targets y/opacity ─────── */
	.hcs-item-w {
		grid-column: span 4;
		aspect-ratio: 1 / 1;
		border-radius: 0.625em;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: 2em;
		position: relative;
		overflow: hidden;
		text-decoration: none;
		color: inherit;
		cursor: pointer;
		will-change: transform, opacity;
	}

	/* ─── content / titles layout ─────────────────────────────────────── */
	.hcs-content-w {
		flex-direction: column;
		justify-content: flex-end;
		height: 100%;
		display: flex;
		position: relative;
		z-index: 2;
	}
	.hcs-titles-w {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-end;
		color: #fff;
	}
	.hcs-titles {
		display: flex;
		flex-direction: column;
		row-gap: 0.5em;
		max-width: 80%;
		overflow: hidden;
	}

	/* ─── hover effects (parent:hover child — can't express in Tailwind) ── */
	.hcs-info-w {
		display: flex;
		flex-direction: column;
		transform: translateY(1em);
		transition: transform var(--dur-med) var(--ease-smooth);
	}
	.hcs-item-w:hover .hcs-info-w {
		transform: translateY(0);
	}

	.hcs-title-w {
		display: flex;
		flex-direction: column;
		gap: 0.15em;
		margin-top: 0.3em;
	}

	.hcs-cross-w {
		transition: transform var(--dur-med) var(--ease-smooth);
		flex-shrink: 0;
		width: 2em;
		height: 2em;
	}
	.hcs-cross-w :global(svg) {
		width: 100%;
		height: 100%;
	}

	/* ─── 배경 이미지 (hover scale transition) ────────────────────────── */
	.hcs-img-w {
		position: absolute;
		inset: 0;
		height: 100%;
		border-radius: 0.625em;
		z-index: -1;
		background-position: 50%;
		background-size: cover;
		background-repeat: no-repeat;
		background-color: rgba(200, 200, 200, 0.1);
		transform: scale(1.05);
		transition: transform var(--dur-med) var(--ease-smooth);
	}
	.hcs-item-w:hover .hcs-img-w {
		transform: scale(1);
	}

	/* 그라데이션 오버레이 */
	.hcs-item-w::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, transparent 60%);
		border-radius: 0.625em;
		z-index: 1;
	}

	/* ─── 배경 이미지 URLs ─────────────────────────────────────────────── */
	:global(.hcs-img-w.is-lando) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/68ece3e91ef2f1125c5b57eb_lando-cs-hero-img.jpg');
	}
	:global(.hcs-img-w.is--vizcom) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/6980c243418b458602403062_ob-cs-lead.jpg');
	}
	:global(.hcs-img-w.is--aether) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/688216a05de42d3adfe4bf47_aether1-awwwards-main.webp');
	}
	:global(.hcs-img-w.is--bella) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/6734a0e12af1829d3c649f35_bella-cs-hero-img.webp');
	}
	:global(.hcs-img-w.is--jasp) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/6863c2232943ccb7fa37b67e_jasp%202.webp');
		background-size: cover;
	}
	:global(.hcs-img-w.is--slack) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/68b6edabe6aadf7c4b4218a7_overview.jpg');
	}
	:global(.hcs-img-w.is--totem.is--aptos) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/680b5774ed70ee2ddaa9d963_aptoslabs.png');
	}
	:global(.hcs-img-w.is--wf) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/6523d7db7bde5cea960a5dca_webflow%20logo%20square.svg');
	}
	:global(.hcs-img-w.is--dl) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/651d0f87d43cf1073e47ec97_cs-dl-hero.jpg');
	}
	:global(.hcs-img-w.is--cmcc) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/651ee37db52db1b35c9463f0_cs-cmcc-follow-up-large-2.jpg');
		background-position: 50%;
	}
	:global(.hcs-img-w.is--tos) {
		background-image: url('https://cdn.prod.website-files.com/64cf4cc8c9b14fe4cb3c54b4/651ee3dfcff32289633127b1_cs-tos-follow-up-1.jpg');
		background-position: 50%;
	}

	/* ─── CTA 버튼: overrides global .btn-w — different padding, adds overflow:hidden for fill animation */
	.btn-w {
		border: 1px solid var(--border-color, rgba(120, 120, 120, 0.4));
		background-color: transparent;
		border-radius: 6.25em;
		position: relative;
		overflow: hidden;
		display: flex;
		text-decoration: none;
		color: inherit;
		padding: 0.6em 1.2em;
	}
	/* .btn-inner: overrides global — adds position:relative + z-index:1 for stacking above .btn-bg-fill */
	.btn-inner {
		display: flex;
		align-items: center;
		gap: 0.5em;
		position: relative;
		z-index: 1;
	}
	/* .btn-txt: overrides global — different font-size (0.8em vs 0.85em), adds letter-spacing */
	.btn-txt {
		font-size: 0.8em;
		letter-spacing: 0.05em;
	}
	/* .btn-icon-w: overrides global — only opacity (0.6 vs global 0.7), removes display:flex */
	.btn-icon-w {
		opacity: 0.6;
	}
	.btn-bg-w {
		position: absolute;
		inset: 0;
		z-index: 0;
	}
	.btn-bg-fill {
		width: 0%;
		height: 100%;
		background: var(--text-color, currentColor);
		transition: width 0.4s ease;
	}
	.btn-w:hover .btn-bg-fill {
		width: 100%;
	}
</style>
