<script lang="ts">
	import { resolve } from '$app/paths';
	import { projects } from '$lib/data/projects';
</script>

<!-- home-work ScrollTrigger 트리거 -->
<section home-work="" class="relative w-full">
	<div class="relative mx-auto w-full max-w-full px-[2vw]">
		<div class="h-[10vw]"></div>
		<div class="grid w-full grid-cols-12 gap-5">
			<!-- ─── Left: sticky eyebrow + CTA ── -->
			<div class="sticky top-20 col-span-2 flex flex-col gap-2 self-start">
				<div class="overflow-hidden">
					<h3
						stagger-scroll="1"
						class="m-0 text-[1em] leading-none font-normal tracking-[0.05em] uppercase"
					>
						Projects
					</h3>
				</div>
				<div btn-reveal="">
					<div class="flex overflow-hidden">
						<a
							reveal-target=""
							href={resolve('/cv')}
							class="group/btn relative inline-flex overflow-hidden rounded-[6.25em] border border-border bg-transparent px-[1.2em] py-[0.6em] text-inherit no-underline"
						>
							<div class="relative z-1 flex items-center gap-2">
								<div class="overflow-hidden">
									<div stagger-text="" class="text-[0.8em] tracking-[0.05em]">View CV</div>
								</div>
								<div class="opacity-60">
									<div class="text-sm">→</div>
								</div>
							</div>
							<div class="absolute inset-0 z-0">
								<div
									class="h-full w-0 bg-text transition-[width] duration-[0.4s] ease-[ease] group-hover/btn:w-full"
								></div>
							</div>
						</a>
					</div>
				</div>
			</div>

			<!-- ─── Right: project cards ── -->
			<div class="relative z-1 col-[5/13] grid grid-flow-dense grid-cols-8 gap-5">
				{#each projects as project (project.slug)}
					<a
						data-work-item
						hover-anim=""
						href={resolve('/')}
						class="group relative col-span-4 flex aspect-square flex-col justify-end overflow-hidden rounded-sm p-8 text-inherit no-underline will-change-[transform,opacity]"
					>
						<div class="relative z-2 flex h-full flex-col justify-end">
							<div class="flex flex-col gap-[0.5em] text-white">
								<div
									class="flex translate-y-[1em] flex-col transition-transform duration-[0.6s] ease-[cubic-bezier(0.38,0.005,0.215,1)] group-hover:translate-y-0"
								>
									<p class="m-0 text-[1.2em] font-medium tracking-[0.02em] uppercase">
										{project.name}
									</p>
									<p class="m-0 mt-[0.4em] text-[0.8em] leading-[1.5] opacity-80">
										{project.description}
									</p>
									<div class="mt-[0.5em] flex flex-wrap gap-[0.4em]">
										{#each project.tags as tag (tag)}
											<span
												class="rounded-full border border-white/30 px-[0.6em] py-[0.15em] text-[0.75em] font-normal tracking-[0.05em] uppercase opacity-60"
												>{tag}</span
											>
										{/each}
									</div>
								</div>
							</div>
						</div>
						<!-- gradient overlay -->
						<div
							class="pointer-events-none absolute inset-0 z-1 rounded-sm bg-gradient-to-t from-black/80 via-black/40 to-black/10"
						></div>
						<!-- gradient background -->
						<div
							class="absolute inset-0 -z-1 h-full scale-105 rounded-sm transition-transform duration-[0.6s] ease-[cubic-bezier(0.38,0.005,0.215,1)] group-hover:scale-100"
							style:background={project.gradient}
						></div>
					</a>
				{/each}
			</div>
		</div>
		<div class="h-[10vw]"></div>
	</div>
</section>
