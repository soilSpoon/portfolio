<script lang="ts">
	import { clients } from '$lib/data/clients';

	const CORNER_SVG = `<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 0V8M0 4H8" stroke="currentColor" stroke-width="0.8" opacity="0.4"/></svg>`;
</script>

<section class="s">
	<div class="c">
		<div data-hide="m" class="spacer-10"></div>
		<div data-client-section="" class="grid-main is-home-client">

			<!-- "Trusted by + Leaders" 헤딩 -->
			<div class="eb-wrap is--clients">
				<div class="o-hidden t-flex">
					<h2 split-text="" stagger-scroll="1" class="h-eyebrow">Trusted by</h2>
				</div>
				<div class="o-hidden t-flex">
					<h2 data-client-tag="" class="h-eyebrow is--outline is--clients">Leaders</h2>
				</div>
			</div>

			<!-- 클라이언트 로고 그리드 -->
			<div class="home-client__grid-w">
				{#each clients as client}
					<div data-client-item={client.name} class="home-client__grid-item">
						<div class="home-client__grid-img w-embed">
							{@html client.svg}
						</div>
						<div class="home-client__corner-w">
							<span class="home-client__corner-img is-1">{@html CORNER_SVG}</span>
							<span class="home-client__corner-img is-2">{@html CORNER_SVG}</span>
							<span class="home-client__corner-img is-3">{@html CORNER_SVG}</span>
							<span class="home-client__corner-img is-4">{@html CORNER_SVG}</span>
							<div class="home-client__border"></div>
						</div>
					</div>
				{/each}
			</div>

		</div>
	</div>
</section>

<style>
	/* grid-main.is-home-client: 12열 그리드
	   - eb-wrap.is--clients: span 2 cols (cols1-2)
	   - home-client__grid-w: cols 3-12 */
	:global(.grid-main.is-home-client) {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		column-gap: 1.25em;
		align-items: start;
	}

	/* cols 1-2 (span 2) */
	.eb-wrap.is--clients {
		grid-column: 1 / 3;
		display: flex;
		flex-direction: column;
		gap: 0.3em;
	}

	/* cols 3-12 (10 cols) + 5열 로고 그리드 */
	.home-client__grid-w {
		grid-column: 3 / 13;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0;
		align-items: stretch;
	}

	/* 각 클라이언트 아이템 */
	.home-client__grid-item {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5em 1em;
		opacity: 0.5;
		transition: opacity 0.3s ease;
		cursor: default;
	}
	.home-client__grid-item:hover { opacity: 1; }

	/* SVG 로고 래퍼 */
	.home-client__grid-img {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
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

	/* 코너 데코레이터 */
	.home-client__corner-w {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}
	.home-client__corner-img {
		position: absolute;
		display: block;
		width: 0.6em;
		height: 0.6em;
		opacity: 0.4;
	}
	.home-client__corner-img.is-1 { top: 0; left: 0; }
	.home-client__corner-img.is-2 { top: 0; right: 0; }
	.home-client__corner-img.is-3 { bottom: 0; left: 0; }
	.home-client__corner-img.is-4 { bottom: 0; right: 0; }
	.home-client__border {
		position: absolute;
		inset: 0;
		border: 1px solid var(--border-color, rgba(111,111,111,0.2));
	}

	.spacer-10 { height: 10vw; }
	.o-hidden { overflow: hidden; }
	.h-eyebrow {
		font-size: var(--fs-eyebrow);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-weight: 400;
		margin: 0;
		line-height: 1.2;
	}
	.h-eyebrow.is--outline {
		-webkit-text-stroke: 1px currentColor;
		color: transparent;
	}
</style>
