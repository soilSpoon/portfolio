<script lang="ts">
	import { clients } from '$lib/data/clients';

	const CORNER_SVG = `<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 0V8M0 4H8" stroke="currentColor" stroke-width="0.8" opacity="0.4"/></svg>`;
</script>

<section class="s">
	<div class="c">
		<div data-hide="m" class="spacer-10"></div>
		<div data-client-section="" class="grid-main is-home-client">
			<!-- "Trusted by + Leaders" 헤딩 -->
			<div class="[grid-column:1/3] flex flex-col gap-[0.3em]">
				<div class="t-flex overflow-hidden">
					<h2 split-text="" stagger-scroll="1" class="h-eyebrow is-clients-eyebrow">Trusted by</h2>
				</div>
				<div class="t-flex overflow-hidden">
					<h2 data-client-tag="" class="h-eyebrow is--outline is-clients-eyebrow">Leaders</h2>
				</div>
			</div>

			<!-- 클라이언트 로고 그리드 -->
			<div class="[grid-column:3/13] grid grid-cols-5 items-stretch gap-0">
				{#each clients as client (client.name)}
					<div
						data-client-item={client.name}
						class="relative flex cursor-default items-center justify-center p-[1.5em_1em] opacity-50 transition-opacity duration-300 ease-in-out hover:opacity-100"
					>
						<div class="home-client__grid-img w-embed flex w-full items-center justify-center">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted static SVG data -->
							{@html client.svg}
						</div>
						<!-- eslint-disable svelte/no-at-html-tags -- trusted static SVG constant -->
						<div class="pointer-events-none absolute inset-0">
							<span class="absolute top-0 left-0 block h-[0.6em] w-[0.6em] opacity-40"
								>{@html CORNER_SVG}</span
							>
							<span class="absolute top-0 right-0 block h-[0.6em] w-[0.6em] opacity-40"
								>{@html CORNER_SVG}</span
							>
							<span class="absolute bottom-0 left-0 block h-[0.6em] w-[0.6em] opacity-40"
								>{@html CORNER_SVG}</span
							>
							<span class="absolute right-0 bottom-0 block h-[0.6em] w-[0.6em] opacity-40"
								>{@html CORNER_SVG}</span
							>
							<div
								class="absolute inset-0 border border-[var(--border-color,rgba(111,111,111,0.2))]"
							></div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	/* grid-main.is-home-client: 12열 그리드 (global override) */
	:global(.grid-main.is-home-client) {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		column-gap: 1.25em;
		align-items: start;
	}

	/* SVG 로고 크기 제어 */
	.home-client__grid-img :global(svg) {
		width: 100%;
		height: auto;
		max-height: 2.5em;
	}
	/* 다크 모드: 로고 → 흰색 (brightness(0) = black, invert(1) = white) */
	:global(html.dark) .home-client__grid-img :global(svg) {
		filter: brightness(0) invert(1);
	}
	/* 라이트 모드: 로고 → 검정색 */
	:global(html.light) .home-client__grid-img :global(svg) {
		filter: brightness(0);
	}

	/* .h-eyebrow: overrides global letter-spacing (0.1em vs global 0.08em) and line-height (1.2 vs global 1.4) for clients section */
	.is-clients-eyebrow {
		font-size: var(--fs-eyebrow);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-weight: 400;
		margin: 0;
		line-height: 1.2;
	}
</style>
