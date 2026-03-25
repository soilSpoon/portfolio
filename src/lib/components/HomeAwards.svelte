<script lang="ts">
	// Section 6: Recognitions + Awards (52개)
	// 원본 구조:
	//   section.s > .c >
	//     .spacer-10
	//     .grid-main.t-flex >
	//       .eb-wrap.is-sticky > "Recognitions + Awards" + count:52
	//       .haw-sub-group > 4 award groups

	const awards = [
		{
			num: '01',
			name: 'Awwwards',
			items: [
				{ label: 'Site of the day', count: '07' },
				{ label: 'Developer award', count: '06' },
				{ label: 'Honors', count: '18' },
			],
		},
		{
			num: '02',
			name: 'FWA',
			items: [
				{ label: 'FWA of the day', count: '04' },
			],
		},
		{
			num: '03',
			name: 'CSS Design Awards',
			items: [
				{ label: 'Site of the day', count: '8' },
			],
		},
		{
			num: '04',
			name: 'Orpetron',
			items: [
				{ label: 'Site of the day', count: '8' },
				{ label: 'Site of the month', count: '1' },
			],
		},
	];
</script>

<section class="s">
	<div class="c">
		<div class="spacer-10"></div>

		<div class="grid-main t-flex">

			<!-- 좌측 sticky 헤딩 -->
			<div class="eb-wrap is-sticky">
				<div class="o-hidden t-flex">
					<h2 split-text="" stagger-scroll="1" class="h-eyebrow">
						Recognitions<br/>+ Awards
					</h2>
					<div split-text="" stagger-scroll="1" class="text-mini float-count is-eyebrow">52</div>
				</div>
			</div>

			<!-- 어워드 목록 -->
			<div class="haw-sub-group">
				{#each awards as award}
					<div class="haw-grid-row">
						<div class="haw-grid-item">
							<p split-text="" stagger-scroll="1" class="text-mini">{award.num}</p>
							<p split-text="" stagger-scroll="1" class="h-c caps">{award.name}</p>
							<div class="haw-item-sub-wrap">
								{#each award.items as item}
									<div class="rel is-h-flex">
										<p split-text="" stagger-scroll="1" class="text-small caps">{item.label}</p>
										<div split-text="" stagger-scroll="1" class="text-mini float-count is-haw">{item.count}</div>
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
		grid-column: 1 / 4;   /* cols 1-3 */
		position: sticky;
		top: 2em;
		align-self: start;
	}

	.h-eyebrow {
		font-size: 0.85em;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		font-weight: 400;
		margin: 0;
		line-height: 1.4;
	}

	/* h-c: 중형 타이포그래피 */
	.h-c {
		font-size: 1.8em;
		font-weight: 400;
		text-transform: uppercase;
		line-height: 1;
		letter-spacing: -0.01em;
		margin: 0.3em 0;
	}
	.h-c.caps { text-transform: uppercase; }

	.haw-sub-group {
		grid-column: 4 / 13;  /* cols 4-12 */
		display: flex;
		flex-direction: column;
	}
	.haw-grid-row {
		border-bottom: 1px solid var(--border-color, rgba(218,218,218,0.2));
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
		font-size: 0.75em;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}
	.text-mini {
		font-size: 0.65em;
		letter-spacing: 0.05em;
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
</style>
