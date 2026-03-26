<script lang="ts">
	import { gridItems as items } from '$lib/data/grid';
</script>

<section class="relative w-full">
	<div class="relative w-full px-[2vw]">
		<div class="h-[10vw]"></div>

		<!-- 텍스트 오버레이 -->
		<div data-grid-overlay class="pointer-events-none absolute inset-0 z-10 overlay-text">
			<div class="sticky top-0 h-screen">
				<div class="absolute bottom-[3em] left-0 w-full px-[2vw]">
					<h2
						split-text=""
						class="text-[6em] leading-none font-normal tracking-[-0.02em] uppercase"
					>
						<span class="invisible">****</span>
						Build Efficiently. Ship Relentlessly.
					</h2>
				</div>
			</div>
		</div>

		<!-- 그리드 콘텐츠 -->
		<div class="relative">
			<div class="h-[10vw]"></div>
			<div
				class="relative mx-auto grid w-full max-w-[40vw] place-items-center will-change-transform [perspective:4000px]"
			>
				<div
					grid-anim=""
					class="grid h-[50vh] [grid-auto-flow:dense] grid-cols-[repeat(8,1fr)] gap-[0.35em] will-change-transform [perspective:4000px] [transform-style:preserve-3d]"
				>
					{#each items as item, i (i)}
						{#if item.type === 'stat'}
							<div
								data-grid-item
								class="relative flex [aspect-ratio:14/9] flex-col items-center justify-center overflow-hidden rounded-sm bg-[rgba(140,140,140,0.1)] will-change-transform"
							>
								<div class="text-[1.4em] leading-none font-medium tracking-[-0.02em]">
									{item.value}
								</div>
								<div class="mt-[0.3em] text-[0.5em] tracking-[0.1em] uppercase opacity-50">
									{item.label}
								</div>
							</div>
						{:else}
							<div
								data-grid-item
								class="relative flex [aspect-ratio:14/9] items-center justify-center overflow-hidden rounded-sm bg-[rgba(140,140,140,0.05)] will-change-transform"
							>
								<div class="text-[0.7em] tracking-[0.05em] uppercase opacity-40">{item.label}</div>
							</div>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	/* SplitType .line inside grid overlay — runtime injected, must be global */
	:global(.grid-overlay .line) {
		overflow: hidden;
	}
</style>
