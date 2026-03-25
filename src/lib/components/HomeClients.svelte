<script lang="ts">
	import { clients } from '$lib/data/clients';

	const CORNER_SVG = `<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 0V8M0 4H8" stroke="currentColor" stroke-width="0.8" opacity="0.4"/></svg>`;
</script>

<section class="w-full">
	<div class="w-full max-w-full px-[2vw] mx-auto relative">
		<div data-hide="m" class="h-[10vw]"></div>
		<div data-client-section="" class="grid grid-cols-12 gap-x-5 items-start">
			<!-- "Trusted by + Leaders" 헤딩 -->
			<div class="[grid-column:1/3] flex flex-col gap-[0.3em]">
				<div class="t-flex overflow-hidden">
					<h2 split-text="" stagger-scroll="1" class="text-eyebrow font-normal uppercase tracking-[0.1em] leading-[1.2]">Trusted by</h2>
				</div>
				<div class="t-flex overflow-hidden">
					<h2 data-client-tag="" class="text-eyebrow font-normal uppercase tracking-[0.1em] leading-[1.2]" style="-webkit-text-stroke: 1px currentColor; color: transparent;">Leaders</h2>
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
	/* SVG 로고 크기 제어 — {@html} injects SVGs not visible to compiler */
	.home-client__grid-img :global(svg) {
		width: 100%;
		height: auto;
		max-height: 2.5em;
	}
	:global(html.dark) .home-client__grid-img :global(svg) {
		filter: brightness(0) invert(1);
	}
	:global(html.light) .home-client__grid-img :global(svg) {
		filter: brightness(0);
	}
</style>
