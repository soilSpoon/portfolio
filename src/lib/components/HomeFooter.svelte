<script lang="ts">
	import { resolve } from '$app/paths';
	import LogoSvg from './LogoSvg.svelte';
</script>

<section class="relative w-full">
	<div class="w-full max-w-full px-[2vw]">
		<div class="border-t border-border">
			<div class="h-[5vw]"></div>

			<div class="flex flex-col gap-16">
				<!-- ─── CTA 영역 ───────────────────────── -->
				<div class="flex flex-col gap-[0.1em]">
					<div class="overlay-text">
						<div class="overflow-hidden">
							<div
								stagger-scroll=""
								split-text=""
								class="overflow-hidden text-[6em] leading-none font-normal tracking-[-0.02em] uppercase"
							>
								Let's build
							</div>
						</div>
					</div>
					<div class="overlay-text">
						<div class="overflow-hidden">
							<div
								stagger-scroll=""
								split-text=""
								class="overflow-hidden text-[6em] leading-none font-normal tracking-[-0.02em] uppercase"
							>
								something
							</div>
						</div>
					</div>
					<div class="flex flex-wrap items-center gap-8">
						<div class="overlay-text">
							<div class="overflow-hidden">
								<div
									stagger-scroll=""
									split-text=""
									class="overflow-hidden text-[6em] leading-none font-normal tracking-[-0.02em] uppercase"
								>
									efficient,
								</div>
							</div>
						</div>
						<a
							href="mailto:lee111dae11@proton.me"
							class="text-eyebrow inline-flex items-center gap-2 rounded-[var(--radius-lg)] border border-current px-[1.6em] py-[0.8em] text-inherit no-underline transition-[background,color] duration-300 ease-[ease] hover:bg-text hover:text-bg"
						>
							<div class="flex items-center gap-2">
								<div class="overflow-hidden">
									<div split-text="" stagger-text="">Get in touch</div>
								</div>
								<div class="opacity-60"><div class="text-[0.75em]">→</div></div>
							</div>
						</a>
					</div>
					<div class="overlay-text">
						<div class="overflow-hidden">
							<div
								stagger-scroll=""
								split-text=""
								class="overflow-hidden text-[6em] leading-none font-normal tracking-[-0.02em] uppercase"
							>
								To+Gether
							</div>
						</div>
					</div>
				</div>

				<!-- ─── 네비게이션 그리드 ───────────────── -->
				<div class="grid grid-cols-4 gap-8">
					<div class="flex flex-col gap-4">
						<div class="overflow-hidden">
							<p
								split-text=""
								stagger-scroll="1"
								class="text-[0.75em] leading-[1.6] tracking-[0.08em] uppercase opacity-60"
							>
								Sitemap
							</p>
						</div>
						<div class="flex flex-col gap-2">
							<a
								href={resolve('/')}
								class="flex items-center gap-[0.3em] text-[0.75em] text-inherit no-underline opacity-70 transition-opacity duration-200 hover:opacity-100"
							>
								<span class="text-[0.75em]">Home</span>
								<span class="opacity-60"><span class="text-[0.75em]">→</span></span>
							</a>
							<a
								href={resolve('/cv')}
								class="flex items-center gap-[0.3em] text-[0.75em] text-inherit no-underline opacity-70 transition-opacity duration-200 hover:opacity-100"
							>
								<span class="text-[0.75em]">CV</span>
								<span class="opacity-60"><span class="text-[0.75em]">→</span></span>
							</a>
						</div>
					</div>
					<div class="flex flex-col gap-4">
						<div class="overflow-hidden">
							<p
								split-text=""
								stagger-scroll="1"
								class="text-[0.75em] leading-[1.6] tracking-[0.08em] uppercase opacity-60"
							>
								Skills
							</p>
						</div>
						<div class="flex flex-col gap-2">
							{#each ['React / TypeScript', 'Next.js / SvelteKit', 'C++ / WASM', 'Nest.js / Laravel', 'AI Agents'] as skill (skill)}
								<span class="block text-[0.75em] opacity-50">{skill}</span>
							{/each}
						</div>
					</div>
					<div class="flex flex-col gap-4">
						<div class="overflow-hidden">
							<p
								split-text=""
								stagger-scroll="1"
								class="text-[0.75em] leading-[1.6] tracking-[0.08em] uppercase opacity-60"
							>
								Links
							</p>
						</div>
						<div class="flex flex-col gap-2">
							{#each [['GitHub', 'https://github.com/soilSpoon'], ['LinkedIn', 'https://linkedin.com/in/mlz37']] as [name, url] (name)}
								<a
									href={url}
									target="_blank"
									rel="external noopener"
									class="flex items-center gap-[0.3em] text-[0.75em] text-inherit no-underline opacity-70 transition-opacity duration-200 hover:opacity-100"
								>
									<span class="text-[0.75em]">{name}</span>
									<span class="opacity-60"><span class="text-[0.75em]">↗</span></span>
								</a>
								<!-- eslint-enable svelte/no-navigation-without-resolve -->
							{/each}
						</div>
					</div>
				</div>

				<!-- ─── 하단 바 ───────────────────────── -->
				<div
					class="flex items-center justify-between border-t border-border pt-6 pb-8"
				>
					<div class="h-8 w-8 opacity-40">
						<LogoSvg class="h-full w-full" />
					</div>
					<div class="flex flex-col gap-[0.3em] text-right">
						<p class="tracking-[0.03em] text-[var(--font-size-mini)] opacity-60">
							© 2025 이대희. All rights reserved.
						</p>
						<p class="tracking-[0.03em] text-[var(--font-size-mini)] opacity-60">
							lee111dae11@proton.me
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
