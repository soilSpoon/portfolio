<script lang="ts">
	import { VID, gridItems as items } from '$lib/data/grid';
</script>

<section class="w-full relative">
	<div class="relative w-full px-[2vw]">
		<div class="h-[10vw]"></div>

		<!-- ① 텍스트 오버레이: position:absolute;inset:0 → sticky child로 텍스트 고정 -->
		<!-- mix-blend-mode:difference 가 grid 위에서 색상 반전 효과 만듦 -->
		<div data-grid-overlay pointer-none="" class="grid-overlay mix-blend-difference text-main-light select-none pointer-events-none absolute inset-0">
			<div class="hg-grid-overlay-sticky sticky top-0 h-screen">
				<!-- position:absolute;bottom:3em;left:0 — 하단 좌측 고정 -->
				<div class="absolute bottom-[3em] left-0 w-full px-[2vw]">
					<h2 split-text="" class="text-[5em] font-normal uppercase leading-none tracking-[-0.02em]">
						<span class="invisible">****</span>
						Elevating Brands in Unexpected Ways.
					</h2>
				</div>
			</div>
		</div>

		<!-- ② 실제 그리드 콘텐츠 -->
		<div class="hg-grid-track relative">
			<div class="h-[10vw]"></div>
			<div class="grid-wrapper">
				<div grid-anim="" class="grid-body">
					{#each items as item, i (i)}
						{#if item.type === 'text'}
							<div data-grid-item class="is-text">
								<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted static grid data -->
								<div data-grid-text>{@html item.label}</div>
							</div>
						{:else if item.type === 'vid'}
							<div data-grid-item>
								<div data-grid-inner class="grid-inner" style:background-image="url({item.imageUrl})">
									<div class="grid-img-overlay absolute inset-0"></div>
									<div class="grid-vid-w absolute inset-0">
										<video home-vid="" playsinline loop muted autoplay data-object-fit="cover">
											<source src="{VID}/OFF_siteclips_{item.vid}.mp4" />
										</video>
									</div>
								</div>
							</div>
						{:else}
							<div data-grid-item>
								<div data-grid-inner class="grid-inner" style:background-image="url({item.imageUrl})">
									<div class="grid-img-overlay absolute inset-0"></div>
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
	.grid-overlay { z-index: 10; }
	:global(.grid-overlay .line) { overflow: hidden; }

	.grid-wrapper {
		max-width: 40vw; margin-left: auto; margin-right: auto;
		position: relative; display: grid; place-items: center;
		width: 100%; perspective: 4000px; will-change: transform;
	}
	.grid-body {
		display: grid; grid-template-columns: repeat(8, 1fr);
		grid-auto-flow: dense; gap: 0.35em; height: 50vh;
		perspective: 4000px; transform-style: preserve-3d; will-change: transform;
	}
	[data-grid-item] {
		aspect-ratio: 14 / 9; border-radius: 0.625em; overflow: hidden;
		position: relative; background-color: rgba(140, 140, 140, 0.1); will-change: transform;
	}
	[data-grid-item].is-text {
		display: flex; justify-content: center; align-items: center;
		text-align: center; overflow: visible; background: none;
	}
	[data-grid-text] {
		font-size: 0.7em; text-transform: uppercase; letter-spacing: 0.05em;
		line-height: 1.3; opacity: 0.6; position: absolute;
		transform: translateZ(0); -webkit-font-smoothing: antialiased;
	}
	.grid-inner {
		border-radius: 0.625em; height: 100%; position: relative;
		background-size: cover; background-position: 50%;
	}
	.grid-img-overlay { z-index: 1; }
	:global(html.dark) .grid-img-overlay { background: rgba(29, 29, 29, 0.3); }
	:global(html.light) .grid-img-overlay { background: rgba(255, 255, 255, 0.3); }
	.grid-vid-w { z-index: 2; }
	.grid-vid-w video { width: 100%; height: 100%; object-fit: cover; display: block; }
</style>
