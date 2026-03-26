<script lang="ts">
	import { ossProjects } from '$lib/data/oss';
</script>

{#snippet cornerSvg()}
<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 0V8M0 4H8" stroke="currentColor" stroke-width="0.8" opacity="0.4"/></svg>
{/snippet}

<section class="w-full">
	<div class="relative mx-auto w-full max-w-full px-[2vw]">
		<div data-hide="m" class="h-[10vw]"></div>
		<div data-client-section="" class="grid grid-cols-12 items-start gap-x-5">
			<!-- 헤딩 -->
			<div class="[grid-column:1/3] flex flex-col gap-[0.3em]">
				<div class="t-flex overflow-hidden">
					<h2
						split-text=""
						stagger-scroll="1"
						class="text-eyebrow leading-[1.2] font-normal tracking-[0.1em] uppercase"
					>
						Open Source
					</h2>
				</div>
				<div class="t-flex overflow-hidden">
					<h2
						data-client-tag=""
						class="text-eyebrow leading-[1.2] font-normal tracking-[0.1em] uppercase"
						style="-webkit-text-stroke: 1px currentColor; color: transparent;"
					>
						Contributions
					</h2>
				</div>
			</div>

			<!-- OSS 프로젝트 그리드 -->
			<div class="[grid-column:3/13] grid grid-cols-5 items-stretch gap-0">
				{#each ossProjects as project (project.name)}
					<div
						data-client-item={project.name}
						class="relative flex cursor-default flex-col items-center justify-center p-[1.5em_1em] opacity-50 transition-opacity duration-300 ease-in-out hover:opacity-100"
					>
						<div class="text-[1.1em] font-medium tracking-[-0.01em]">{project.name}</div>
						<div
							class="mt-[0.3em] flex items-center gap-[0.4em] text-[0.75em] tracking-[0.05em] opacity-60"
						>
							<span>★ {project.stars}</span>
							<span>·</span>
							<span>{project.prs} PRs</span>
						</div>
						<div class="pointer-events-none absolute inset-0">
							<span class="absolute top-0 left-0 block h-[0.6em] w-[0.6em] opacity-40"
								>{@render cornerSvg()}</span
							>
							<span class="absolute top-0 right-0 block h-[0.6em] w-[0.6em] opacity-40"
								>{@render cornerSvg()}</span
							>
							<span class="absolute bottom-0 left-0 block h-[0.6em] w-[0.6em] opacity-40"
								>{@render cornerSvg()}</span
							>
							<span class="absolute right-0 bottom-0 block h-[0.6em] w-[0.6em] opacity-40"
								>{@render cornerSvg()}</span
							>
							<div class="absolute inset-0 border border-border"></div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
