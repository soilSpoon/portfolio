<script lang="ts">
	import { awards } from '$lib/data/awards';
</script>

<section class="s">
	<div class="c">
		<div class="spacer-10"></div>

		<div class="grid-main t-flex">
			<!-- 좌측 sticky 헤딩 -->
			<div class="eb-wrap is-sticky">
				<div class="o-hidden t-flex">
					<div class="o-hidden">
						<h2 split-text="" stagger-scroll="1" class="h-eyebrow">
							Recognitions<br />+ Awards
						</h2>
					</div>
					<div class="o-hidden">
						<div split-text="" stagger-scroll="1" class="text-mini float-count is-eyebrow">52</div>
					</div>
				</div>
			</div>

			<!-- 어워드 목록 -->
			<div class="haw-sub-group">
				{#each awards as award (award.name)}
					<div class="haw-grid-row">
						<div class="haw-grid-item">
							<div class="o-hidden">
								<p split-text="" stagger-scroll="1" class="text-mini">{award.num}</p>
							</div>
							<div class="o-hidden">
								<p split-text="" stagger-scroll="1" class="h-c caps">{award.name}</p>
							</div>
							<div class="haw-item-sub-wrap">
								{#each award.items as item (item.label)}
									<div class="rel is-h-flex">
										<div class="o-hidden">
											<p split-text="" stagger-scroll="1" class="text-small caps">{item.label}</p>
										</div>
										<div class="o-hidden">
											<div split-text="" stagger-scroll="1" class="text-mini float-count is-haw">
												{item.count}
											</div>
										</div>
									</div>
								{/each}
							</div>
						</div>
						<div class="link-track"><div class="link-track-fill"></div></div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	/* grid-main.t-flex: 12열 grid — 좌측 sticky 헤딩 + 우측 어워드 목록 */
	:global(.grid-main.t-flex) {
		align-items: start;
	}

	.eb-wrap.is-sticky {
		grid-column: 1 / 4; /* cols 1-3 */
		position: sticky;
		top: 2em;
		align-self: start;
	}

	/* h-c: 중형 타이포그래피 — font-size는 전역 var, margin만 로컬 override */
	.h-c {
		font-size: var(--fs-h-c);
		margin: 0.3em 0;
	}

	.haw-sub-group {
		grid-column: 4 / 13; /* cols 4-12 */
		display: flex;
		flex-direction: column;
	}
	.haw-grid-row {
		border-bottom: 1px solid var(--border-color, rgba(218, 218, 218, 0.2));
		padding: 2em 0;
		position: relative;
	}
	.haw-grid-item {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}
	.haw-item-sub-wrap {
		display: flex;
		flex-direction: column;
		gap: 0.3em;
		margin-top: 0.5em;
	}
	.rel.is-h-flex {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.text-small.caps {
		font-size: 0.75em; /* 전역 --fs-small(0.8em)보다 작은 로컬 사이즈 */
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.text-mini {
		font-size: var(--fs-mini);
		letter-spacing: 0.05em; /* 전역 0.03em보다 넓은 로컬 간격 */
	}
	.float-count {
		font-variant-numeric: tabular-nums;
	}
	.link-track {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: currentColor;
		opacity: 0.15;
	}
	.o-hidden {
		overflow: hidden;
	}
</style>
