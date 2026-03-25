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

<section class="s is-footer relative">
	<div class="c is-footer w-full max-w-none px-[2vw]">
		<div class="ft-content-w border-t border-[var(--border-color,rgba(218,218,218,0.2))]">
			<div class="spacer-5"></div>

			<div class="grid-main is-footer">
				<!-- ─── CTA 영역 ───────────────────────── -->
				<div class="grid-main ft-cta-grid flex flex-col gap-[0.1em]">
					<div class="mbm-diff">
						<div class="overflow-hidden">
							<div stagger-scroll="" split-text="" class="h-a is-sub">How about</div>
						</div>
					</div>
					<div class="mbm-diff">
						<div class="overflow-hidden">
							<div stagger-scroll="" split-text="" class="h-a is-sub">we do a thing</div>
						</div>
					</div>
					<div class="ft-cta-row flex flex-wrap items-center gap-8">
						<div class="mbm-diff is-nb">
							<div class="overflow-hidden">
								<div stagger-scroll="" split-text="" class="h-a is-sub">or two,</div>
							</div>
						</div>
						<a
							href={resolve('/')}
							class="btn-w is-large inline-flex items-center gap-2 rounded-lg border border-current px-[1.6em] py-[0.8em] text-[length:var(--fs-eyebrow)] text-inherit no-underline transition-[background,color] duration-[var(--dur-fast)] ease-[ease] hover:bg-[var(--text-color)] hover:text-[var(--bg-color)]"
						>
							<div class="btn-inner">
								<div class="overflow-hidden">
									<div split-text="" stagger-text="" class="btn-txt">Get in touch</div>
								</div>
								<div class="btn-icon-w"><div class="text-small btn-txt">→</div></div>
							</div>
						</a>
					</div>
					<div class="mbm-diff">
						<div class="overflow-hidden">
							<div stagger-scroll="" split-text="" class="h-a is-sub">To+Gether</div>
						</div>
					</div>
				</div>

				<!-- ─── 네비게이션 그리드 ───────────────── -->
				<div class="grid-main ft-nav-w mbm-diff">
					<div class="ft-nav-col flex flex-col gap-4">
						<div class="overflow-hidden">
							<p split-text="" stagger-scroll="1" class="text-small uppercase opacity-60">Sitemap</p>
						</div>
						<div class="ft-nav-link-w flex flex-col gap-2">
							<a
								href={resolve('/')}
								class="page-link-w flex items-center gap-[0.3em] text-[0.75em] text-inherit no-underline opacity-70 transition-opacity duration-200 hover:opacity-100"
							>
								<span class="text-small btn-txt">Home</span>
								<span class="btn-icon-w"><span class="text-small btn-txt">→</span></span>
							</a>
							<a
								href={resolve('/cv')}
								class="page-link-w flex items-center gap-[0.3em] text-[0.75em] text-inherit no-underline opacity-70 transition-opacity duration-200 hover:opacity-100"
							>
								<span class="text-small btn-txt">CV</span>
								<span class="btn-icon-w"><span class="text-small btn-txt">→</span></span>
							</a>
						</div>
					</div>
					<div class="ft-nav-col flex flex-col gap-4">
						<div class="overflow-hidden">
							<p split-text="" stagger-scroll="1" class="text-small uppercase opacity-60">Services</p>
						</div>
						<div class="ft-nav-link-w flex flex-col gap-2">
							{#each ['Brand Identity', 'Digital Experiences', 'Motion', 'WebGL/VR', 'UX/UI'] as svc (svc)}
								<span class="text-small ft-service-item block text-[0.75em] opacity-50">{svc}</span>
							{/each}
						</div>
					</div>
					<div class="ft-nav-col flex flex-col gap-4">
						<div class="overflow-hidden">
							<p split-text="" stagger-scroll="1" class="text-small uppercase opacity-60">Social</p>
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
									<span class="text-small btn-txt">{name}</span>
									<span class="btn-icon-w"><span class="text-small btn-txt">↗</span></span>
								</a>
							{/each}
						</div>
					</div>
				</div>

				<!-- ─── 하단 바 ───────────────────────── -->
				<div
					class="ft-bottom mbm-diff flex items-center justify-between border-t border-[var(--border-color,rgba(218,218,218,0.2))] pt-6 pb-8"
				>
					<div class="ft-logo-w h-8 w-8 opacity-40">
						<LogoSvg />
					</div>
					<div class="ft-copy flex flex-col gap-[0.3em] text-right">
						<p class="text-mini opacity-60">© 2025 OFF+BRAND. All rights reserved.</p>
						<p class="text-mini opacity-60">Glasgow, Scotland · offbrand.studio</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	/* ─── Global overrides (can't be expressed as utilities) ─── */

	/* grid-main.is-footer: override 12-col grid to flex column */
	:global(.grid-main.is-footer) {
		display: flex;
		flex-direction: column;
		gap: 4em;
	}

	/* h-a.is-sub: footer CTA heading variant */
	:global(.h-a.is-sub) {
		font-size: 5em;
		font-weight: 400;
		text-transform: uppercase;
		line-height: 1;
		letter-spacing: -0.02em;
		margin: 0;
		/* stagger-scroll yPercent 애니메이션 클리핑 */
		overflow: hidden;
	}

	/* Nav grid: override 12-col grid to 4-col */
	:global(.grid-main.ft-nav-w) {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 2em;
	}

	/* .text-small: overrides global font-size (0.75em vs global 0.8em) for compact footer text */
	.text-small {
		font-size: 0.75em;
	}
	.text-small.caps {
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	/* SVG inside logo wrapper: full size */
	.ft-logo-w :global(svg) {
		width: 100%;
		height: 100%;
	}
</style>
