<script lang="ts">
	import { resolve } from '$app/paths';
	import { projects } from '$lib/data/projects';
</script>

<!-- home-work ScrollTrigger 트리거 -->
<section home-work="" class="w-full relative">
	<div class="w-full max-w-full px-[2vw] mx-auto relative">
		<div class="h-[10vw]"></div>
		<div class="grid w-full grid-cols-12 gap-5">
			<!-- ─── Left: sticky eyebrow + CTA ── -->
			<div class="flex flex-col gap-2 sticky top-20 col-span-2 self-start">
				<div class="overflow-hidden">
					<h3 stagger-scroll="1" class="text-[1em] font-normal tracking-[0.05em] uppercase leading-none m-0">Projects</h3>
				</div>
				<div btn-reveal="">
					<div class="flex overflow-hidden">
						<a reveal-target="" href={resolve('/cv')} class="group/btn relative inline-flex overflow-hidden rounded-[6.25em] border border-border bg-transparent px-[1.2em] py-[0.6em] text-inherit no-underline">
							<div class="relative z-1 flex items-center gap-2">
								<div class="overflow-hidden">
									<div stagger-text="" class="text-[0.8em] tracking-[0.05em]">View CV</div>
								</div>
								<div class="opacity-60">
									<div class="text-sm">→</div>
								</div>
							</div>
							<div class="absolute inset-0 z-0">
								<div class="h-full w-0 group-hover/btn:w-full bg-text transition-[width] duration-[0.4s] ease-[ease]"></div>
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
						class="group col-span-4 aspect-square rounded-sm flex flex-col justify-end p-8 relative overflow-hidden no-underline text-inherit will-change-[transform,opacity]"
					>
						<div class="flex flex-col justify-end h-full relative z-2">
							<div class="flex flex-col gap-[0.5em] text-white">
								<div class="flex flex-col translate-y-[1em] group-hover:translate-y-0 transition-transform duration-[0.6s] ease-[cubic-bezier(0.38,0.005,0.215,1)]">
									<p class="text-[1.2em] font-medium uppercase tracking-[0.02em] m-0">{project.name}</p>
									<p class="text-[0.8em] leading-[1.5] opacity-80 mt-[0.4em] m-0">{project.description}</p>
									<div class="flex flex-wrap gap-[0.4em] mt-[0.5em]">
										{#each project.tags as tag (tag)}
											<span class="text-[0.65em] font-normal uppercase tracking-[0.05em] opacity-60 border border-white/30 rounded-full px-[0.6em] py-[0.15em]">{tag}</span>
										{/each}
									</div>
								</div>
							</div>
						</div>
						<!-- gradient overlay -->
						<div class="pointer-events-none absolute inset-0 z-1 rounded-sm bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
						<!-- gradient background -->
						<div
							class="absolute inset-0 h-full rounded-sm -z-1 scale-105 group-hover:scale-100 transition-transform duration-[0.6s] ease-[cubic-bezier(0.38,0.005,0.215,1)]"
							style:background={project.gradient}
						></div>
					</a>
				{/each}
			</div>
		</div>
		<div class="h-[10vw]"></div>
	</div>
</section>
