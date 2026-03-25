<script lang="ts">
	import { resolve } from '$app/paths';
	import LogoSvg from './LogoSvg.svelte';
	// Section 8: Footer
	// 원본 구조:
	//   section.s.is-footer > .c.is-footer > .ft-content-w >
	//     .spacer-5
	//     .grid-main.is-footer >
	//       .grid-main.ft-cta-grid:  "How about / we do a thing / or two, [CTA] / To+Gether"
	//       .grid-main.ft-nav-w.mbm-diff: Sitemap + Services + Social + Legal
	//       .ft-bottom: 로고 + copyright + address
</script>

<section class="w-full relative">
	<div class="w-full max-w-full px-[2vw]">
		<div class="ft-content-w border-t border-[var(--border-color,rgba(218,218,218,0.2))]">
			<div class="h-[5vw]"></div>

			<div class="flex flex-col gap-16">
				<!-- ─── CTA 영역 ───────────────────────── -->
				<div class="grid-main ft-cta-grid flex flex-col gap-[0.1em]">
					<div class="mix-blend-difference text-main-light select-none">
						<div class="overflow-hidden">
							<div stagger-scroll="" split-text="" class="text-[5em] font-normal uppercase leading-none tracking-[-0.02em] overflow-hidden">How about</div>
						</div>
					</div>
					<div class="mix-blend-difference text-main-light select-none">
						<div class="overflow-hidden">
							<div stagger-scroll="" split-text="" class="text-[5em] font-normal uppercase leading-none tracking-[-0.02em] overflow-hidden">we do a thing</div>
						</div>
					</div>
					<div class="ft-cta-row flex flex-wrap items-center gap-8">
						<div class="mix-blend-difference text-main-light select-none">
							<div class="overflow-hidden">
								<div stagger-scroll="" split-text="" class="text-[5em] font-normal uppercase leading-none tracking-[-0.02em] overflow-hidden">or two,</div>
							</div>
						</div>
						<a
							href={resolve('/')}
							class="inline-flex items-center gap-2 rounded-[var(--radius-lg)] border border-current px-[1.6em] py-[0.8em] text-eyebrow text-inherit no-underline transition-[background,color] duration-300 ease-[ease] hover:bg-[var(--text-color)] hover:text-[var(--bg-color)]"
						>
							<div class="flex items-center gap-2">
								<div class="overflow-hidden">
									<div split-text="" stagger-text="">Get in touch</div>
								</div>
								<div class="opacity-60"><div class="text-[0.75em]">→</div></div>
							</div>
						</a>
					</div>
					<div class="mix-blend-difference text-main-light select-none">
						<div class="overflow-hidden">
							<div stagger-scroll="" split-text="" class="text-[5em] font-normal uppercase leading-none tracking-[-0.02em] overflow-hidden">To+Gether</div>
						</div>
					</div>
				</div>

				<!-- ─── 네비게이션 그리드 ───────────────── -->
				<div class="grid grid-cols-4 gap-8 mix-blend-difference text-main-light select-none">
					<div class="ft-nav-col flex flex-col gap-4">
						<div class="overflow-hidden">
							<p split-text="" stagger-scroll="1" class="text-[0.75em] leading-[1.6] uppercase tracking-[0.08em] opacity-60">Sitemap</p>
						</div>
						<div class="ft-nav-link-w flex flex-col gap-2">
							<a
								href={resolve('/')}
								class="page-link-w flex items-center gap-[0.3em] text-[0.75em] text-inherit no-underline opacity-70 transition-opacity duration-200 hover:opacity-100"
							>
								<span class="text-[0.75em]">Home</span>
								<span class="opacity-60"><span class="text-[0.75em]">→</span></span>
							</a>
							<a
								href={resolve('/cv')}
								class="page-link-w flex items-center gap-[0.3em] text-[0.75em] text-inherit no-underline opacity-70 transition-opacity duration-200 hover:opacity-100"
							>
								<span class="text-[0.75em]">CV</span>
								<span class="opacity-60"><span class="text-[0.75em]">→</span></span>
							</a>
						</div>
					</div>
					<div class="ft-nav-col flex flex-col gap-4">
						<div class="overflow-hidden">
							<p split-text="" stagger-scroll="1" class="text-[0.75em] leading-[1.6] uppercase tracking-[0.08em] opacity-60">Services</p>
						</div>
						<div class="ft-nav-link-w flex flex-col gap-2">
							{#each ['Brand Identity', 'Digital Experiences', 'Motion', 'WebGL/VR', 'UX/UI'] as svc (svc)}
								<span class="ft-service-item block text-[0.75em] opacity-50">{svc}</span>
							{/each}
						</div>
					</div>
					<div class="ft-nav-col flex flex-col gap-4">
						<div class="overflow-hidden">
							<p split-text="" stagger-scroll="1" class="text-[0.75em] leading-[1.6] uppercase tracking-[0.08em] opacity-60">Social</p>
						</div>
						<div class="ft-nav-link-w flex flex-col gap-2">
							{#each [['Twitter / X', 'https://twitter.com/itsoffbrand'], ['Instagram', 'https://instagram.com/itsoffbrand'], ['LinkedIn', 'https://linkedin.com/company/itsoffbrand']] as [name, url] (name)}
								<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external URL -->
								<a
									href={url}
									target="_blank"
									rel="noopener"
									class="page-link-w flex items-center gap-[0.3em] text-[0.75em] text-inherit no-underline opacity-70 transition-opacity duration-200 hover:opacity-100"
								>
									<span class="text-[0.75em]">{name}</span>
									<span class="opacity-60"><span class="text-[0.75em]">↗</span></span>
								</a>
							{/each}
						</div>
					</div>
				</div>

				<!-- ─── 하단 바 ───────────────────────── -->
				<div
					class="ft-bottom mix-blend-difference text-main-light select-none flex items-center justify-between border-t border-[var(--border-color,rgba(218,218,218,0.2))] pt-6 pb-8"
				>
					<div class="ft-logo-w h-8 w-8 opacity-40">
						<LogoSvg />
					</div>
					<div class="ft-copy flex flex-col gap-[0.3em] text-right">
						<p class="text-[var(--font-size-mini)] tracking-[0.03em] opacity-60">© 2025 OFF+BRAND. All rights reserved.</p>
						<p class="text-[var(--font-size-mini)] tracking-[0.03em] opacity-60">Glasgow, Scotland · offbrand.studio</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.ft-logo-w :global(svg) {
		width: 100%;
		height: 100%;
	}
</style>
