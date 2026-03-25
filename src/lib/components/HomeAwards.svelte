<script lang="ts">
	import { awards } from '$lib/data/awards';
</script>

<section class="s">
	<div class="c">
		<div class="spacer-10"></div>

		<div class="grid-main t-flex">
			<!-- 좌측 sticky 헤딩 -->
			<div class="eb-wrap is-sticky col-start-1 col-end-4">
				<div class="t-flex overflow-hidden">
					<div class="overflow-hidden">
						<h2 split-text="" stagger-scroll="1" class="h-eyebrow">
							Recognitions<br />+ Awards
						</h2>
					</div>
					<div class="overflow-hidden">
						<div split-text="" stagger-scroll="1" class="text-mini float-count is-eyebrow">52</div>
					</div>
				</div>
			</div>

			<!-- 어워드 목록 -->
			<div class="col-start-4 col-end-13 flex flex-col">
				{#each awards as award (award.name)}
					<div class="relative border-b border-[var(--border-color,rgba(218,218,218,0.2))] py-8">
						<div class="flex flex-col gap-2">
							<div class="overflow-hidden">
								<p split-text="" stagger-scroll="1" class="text-mini">{award.num}</p>
							</div>
							<div class="overflow-hidden">
								<p split-text="" stagger-scroll="1" class="h-c caps">{award.name}</p>
							</div>
							<div class="mt-2 flex flex-col gap-[0.3em]">
								{#each award.items as item (item.label)}
									<div class="flex items-center justify-between">
										<div class="overflow-hidden">
											<p split-text="" stagger-scroll="1" class="text-small caps">{item.label}</p>
										</div>
										<div class="overflow-hidden">
											<div split-text="" stagger-scroll="1" class="text-mini float-count is-haw">
												{item.count}
											</div>
										</div>
									</div>
								{/each}
							</div>
						</div>
						<div class="absolute inset-x-0 bottom-0 h-px bg-current opacity-15"></div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	@reference "tailwindcss";

	/* ─── Global overrides (can't be expressed as utilities) ─── */

	/* grid-main.t-flex: 12열 grid — align items to start */
	:global(.grid-main.t-flex) {
		align-items: start;
	}

	/* .h-c: overrides global margin (0.3em 0 vs global 0) for vertical spacing in awards list */
	.h-c {
		font-size: var(--fs-h-c);
		margin: 0.3em 0;
	}

	/* .text-small.caps: overrides global font-size (0.75em vs global 0.8em) for compact awards text */
	.text-small.caps {
		font-size: 0.75em;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	/* .text-mini: overrides global letter-spacing (0.05em vs global 0.03em) for wider spacing in awards */
	.text-mini {
		font-size: var(--fs-mini);
		letter-spacing: 0.05em;
	}

	/* .float-count: tabular-nums for aligned numbers */
	.float-count {
		@apply tabular-nums;
	}
</style>
