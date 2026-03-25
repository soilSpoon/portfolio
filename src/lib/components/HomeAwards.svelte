<script lang="ts">
	import { awards } from '$lib/data/awards';
</script>

<section class="w-full">
	<div class="w-full max-w-full px-[2vw] mx-auto relative">
		<div class="h-[10vw]"></div>

		<div class="grid grid-cols-12 gap-x-5 items-start">
			<!-- 좌측 sticky 헤딩 -->
			<div class="flex flex-col gap-2 sticky top-8 col-start-1 col-end-4">
				<div class="t-flex overflow-hidden">
					<div class="overflow-hidden">
						<h2 split-text="" stagger-scroll="1" class="text-eyebrow font-normal uppercase tracking-[0.08em] leading-[1.4]">
							Recognitions<br />+ Awards
						</h2>
					</div>
					<div class="overflow-hidden">
						<div split-text="" stagger-scroll="1" class="text-mini tracking-[0.05em] tabular-nums">52</div>
					</div>
				</div>
			</div>

			<!-- 어워드 목록 -->
			<div class="col-start-4 col-end-13 flex flex-col">
				{#each awards as award (award.name)}
					<div class="relative border-b border-[var(--border-color,rgba(218,218,218,0.2))] py-8">
						<div class="flex flex-col gap-2">
							<div class="overflow-hidden">
								<p split-text="" stagger-scroll="1" class="text-mini tracking-[0.05em]">{award.num}</p>
							</div>
							<div class="overflow-hidden">
								<p split-text="" stagger-scroll="1" class="text-h-c leading-none tracking-[-0.01em] uppercase my-[0.3em]">{award.name}</p>
							</div>
							<div class="mt-2 flex flex-col gap-[0.3em]">
								{#each award.items as item (item.label)}
									<div class="flex items-center justify-between">
										<div class="overflow-hidden">
											<p split-text="" stagger-scroll="1" class="text-[0.75em] leading-[1.6] uppercase tracking-[0.05em]">{item.label}</p>
										</div>
										<div class="overflow-hidden">
											<div split-text="" stagger-scroll="1" class="text-mini tracking-[0.05em] tabular-nums">
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
