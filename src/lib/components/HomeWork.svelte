<script lang="ts">
	// Home Work 섹션 (Featured Work)
	// 원본 w-node CSS 기반 정확한 그리드 배치:
	//   .grid-main.is-hw (12-col):
	//     .eb-wrap.is-sticky → grid-area: span1/span2 (cols 1-2)
	//     .grid-main.hcs-grid-w → grid-area: 1/5/2/13 (8-col inner grid)
	//   Each [data-work-item] → grid-area: span1/span4 (4 of 8 cols = 2 per row)

	// TODO: resolve() 사용 — 해당 라우트 구현 후 전환
	import { resolve } from '$app/paths';
	import { projects } from '$lib/data/projects';

	const crossSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 162 162" xml:space="preserve"><path data-work-cross class="hcs-cross-svg" d="M108 88.7c-10.8 0-19.7 8.8-19.7 19.7v47.4c0 1.9-1.5 3.4-3.4 3.4h-8.6c-1.9 0-3.4-1.5-3.4-3.4v-47.4c0-10.8-8.8-19.7-19.7-19.7H6.4c-1.9 0-3.4-1.5-3.4-3.4v-8c0-1.9 1.5-3.4 3.4-3.4h46.9c10.8 0 19.7-8.8 19.6-19.7V6.4c0-1.9 1.5-3.4 3.4-3.4H85c1.9 0 3.4 1.5 3.4 3.4v47.8c0 10.8 8.8 19.7 19.7 19.7h46.6c1.9 0 3.4 1.5 3.4 3.4v8c0 1.9-1.5 3.4-3.4 3.4H108z" style="fill-rule:evenodd;clip-rule:evenodd;" fill="white"/></svg>`;
</script>

<!-- home-work ScrollTrigger 트리거 -->
<section home-work="" class="w-full relative">
	<div class="w-full max-w-full px-[2vw] mx-auto relative">
		<div class="h-[10vw]"></div>
		<!-- 12열 그리드: left sticky (cols 1-2) + right grid (cols 5-12) -->
		<div class="grid w-full grid-cols-12 gap-5">
			<!-- ─── Left: sticky eyebrow + CTA (cols 1-2) ──────────────── -->
			<div class="flex flex-col gap-2 sticky top-20 col-span-2 self-start">
				<div class="overflow-hidden">
					<h3 stagger-scroll="1" class="text-[1em] font-normal tracking-[0.05em] uppercase leading-none m-0">Featured work</h3>
				</div>
				<div btn-reveal="" class="page-btn-w">
					<div class="flex overflow-hidden">
						<a reveal-target="" href={resolve('/')} class="work-btn relative inline-flex overflow-hidden rounded-[6.25em] border border-[var(--border-color,rgba(120,120,120,0.4))] bg-transparent px-[1.2em] py-[0.6em] text-inherit no-underline">
							<div class="relative z-1 flex items-center gap-2">
								<div class="overflow-hidden">
									<div stagger-text="" class="text-[0.8em] tracking-[0.05em]">All Work</div>
								</div>
								<div class="opacity-60">
									<div class="text-sm">→</div>
								</div>
							</div>
							<div class="work-btn-bg absolute inset-0 z-0">
								<div class="work-btn-fill h-full w-0 bg-[var(--text-color,currentColor)] transition-[width] duration-[0.4s] ease-[ease]"></div>
							</div>
						</a>
					</div>
				</div>
			</div>

			<!-- ─── Right: 8-col work grid (cols 5-12) ─────────────────── -->
			<div class="hcs-grid-w relative z-1 col-[5/13] grid grid-flow-dense grid-cols-8 gap-5">
				{#each projects as project (project.slug)}
					<a data-work-item hover-anim="" href={resolve('/')}>
						<div class="hcs-content-w">
							<div class="hcs-titles-w">
								<div class="hcs-titles">
									<div class="hcs-info-w">
										<p class="text-[1em] font-normal uppercase tracking-[0.03em] m-0">{project.name}</p>
										<div data-work-title>
											{#each project.tags as tag (tag)}
												<p class="text-[0.75em] font-normal uppercase leading-none opacity-70 m-0">{tag}</p>
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
						<div class="hcs-img-w" style:background-image="url({project.imageUrl})"></div>
					</a>
				{/each}
			</div>
		</div>
		<div class="h-[10vw]"></div>
	</div>
</section>

<style>
	/* work item: grid span + aspect ratio + hover effects */
	[data-work-item] {
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

	/* content / titles layout */
	.hcs-content-w { flex-direction: column; justify-content: flex-end; height: 100%; display: flex; position: relative; z-index: 2; }
	.hcs-titles-w { display: flex; flex-direction: row; justify-content: space-between; align-items: flex-end; color: #fff; }
	.hcs-titles { display: flex; flex-direction: column; row-gap: 0.5em; max-width: 80%; overflow: hidden; }

	/* hover: info slide-up */
	.hcs-info-w {
		display: flex;
		flex-direction: column;
		transform: translateY(1em);
		transition: transform 0.6s cubic-bezier(0.38, 0.005, 0.215, 1);
	}
	[data-work-item]:hover .hcs-info-w { transform: translateY(0); }

	[data-work-title] { display: flex; flex-direction: column; gap: 0.15em; margin-top: 0.3em; }

	.hcs-cross-w {
		transition: transform 0.6s cubic-bezier(0.38, 0.005, 0.215, 1);
		flex-shrink: 0; width: 2em; height: 2em;
	}
	.hcs-cross-w :global(svg) { width: 100%; height: 100%; }

	/* background image */
	.hcs-img-w {
		position: absolute; inset: 0; height: 100%; border-radius: 0.625em; z-index: -1;
		background-position: 50%; background-size: cover; background-repeat: no-repeat;
		background-color: rgba(200, 200, 200, 0.1);
		transform: scale(1.05);
		transition: transform 0.6s cubic-bezier(0.38, 0.005, 0.215, 1);
	}
	[data-work-item]:hover .hcs-img-w { transform: scale(1); }

	/* gradient overlay */
	[data-work-item]::after {
		content: ''; position: absolute; inset: 0;
		background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%);
		border-radius: 0.625em; z-index: 1;
	}

	/* button hover fill */
	.work-btn:hover .work-btn-fill { width: 100%; }
</style>
