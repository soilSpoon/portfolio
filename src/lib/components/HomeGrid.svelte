<script lang="ts">
	import { gridItems as items } from '$lib/data/grid';
</script>

<section class="w-full relative">
	<div class="relative w-full px-[2vw]">
		<div class="h-[10vw]"></div>

		<!-- 텍스트 오버레이 -->
		<div data-grid-overlay pointer-none="" class="mix-blend-difference text-main-light select-none pointer-events-none absolute inset-0 z-10">
			<div class="sticky top-0 h-screen">
				<div class="absolute bottom-[3em] left-0 w-full px-[2vw]">
					<h2 split-text="" class="text-[6em] font-normal uppercase leading-none tracking-[-0.02em]">
						<span class="invisible">****</span>
						Build Efficiently. Ship Relentlessly.
					</h2>
				</div>
			</div>
		</div>

		<!-- 그리드 콘텐츠 -->
		<div class="relative">
			<div class="h-[10vw]"></div>
			<div class="relative mx-auto grid w-full max-w-[40vw] place-items-center [perspective:4000px] will-change-transform">
				<div grid-anim="" class="grid grid-cols-[repeat(8,1fr)] [grid-auto-flow:dense] gap-[0.35em] h-[50vh] [perspective:4000px] [transform-style:preserve-3d] will-change-transform">
					{#each items as item, i (i)}
						{#if item.type === 'stat'}
							<div data-grid-item class="[aspect-ratio:14/9] rounded-sm overflow-hidden relative bg-[rgba(140,140,140,0.1)] will-change-transform flex flex-col items-center justify-center">
								<div class="text-[1.4em] font-medium tracking-[-0.02em] leading-none">{item.value}</div>
								<div class="text-[0.5em] uppercase tracking-[0.1em] opacity-50 mt-[0.3em]">{item.label}</div>
							</div>
						{:else}
							<div data-grid-item class="[aspect-ratio:14/9] rounded-sm overflow-hidden relative bg-[rgba(140,140,140,0.05)] will-change-transform flex items-center justify-center">
								<div class="text-[0.7em] uppercase tracking-[0.05em] opacity-40">{item.label}</div>
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
	:global(.grid-overlay .line) { overflow: hidden; }
</style>
