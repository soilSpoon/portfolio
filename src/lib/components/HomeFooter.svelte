<script lang="ts">
	// Section 8: Footer
	// 원본 구조:
	//   section.s.is-footer > .c.is-footer > .ft-content-w >
	//     .spacer-5
	//     .grid-main.is-footer >
	//       .grid-main.ft-cta-grid:  "How about / we do a thing / or two, [CTA] / To+Gether"
	//       .grid-main.ft-nav-w.mbm-diff: Sitemap + Services + Social + Legal
	//       .ft-bottom: 로고 + copyright + address
</script>

<section class="s is-footer">
	<div class="c is-footer">
		<div class="ft-content-w">
			<div class="spacer-5"></div>

			<div class="grid-main is-footer">

				<!-- ─── CTA 영역 ───────────────────────── -->
				<div class="grid-main ft-cta-grid">
					<div class="mbm-diff">
						<div stagger-scroll="" split-text="" class="h-a is-sub">How about</div>
					</div>
					<div class="mbm-diff">
						<div stagger-scroll="" split-text="" class="h-a is-sub">we do a thing</div>
					</div>
					<div class="ft-cta-row">
						<div class="mbm-diff is-nb">
							<div stagger-scroll="" split-text="" class="h-a is-sub">or two,</div>
						</div>
						<a href="/contact" class="btn-w is-large">
							<div class="btn-inner">
								<div class="o-hidden">
									<div split-text="" stagger-text="" class="btn-txt">Get in touch</div>
								</div>
								<div class="btn-icon-w"><div class="text-small btn-txt">→</div></div>
							</div>
						</a>
					</div>
					<div class="mbm-diff">
						<div stagger-scroll="" split-text="" class="h-a is-sub">To+Gether</div>
					</div>
				</div>

				<!-- ─── 네비게이션 그리드 ───────────────── -->
				<div class="grid-main ft-nav-w mbm-diff">
					<div class="ft-nav-col">
						<p split-text="" stagger-scroll="1" class="text-small caps op-60">Sitemap</p>
						<div class="ft-nav-link-w">
							{#each ['Home', 'About Us', 'Work', 'Contact'] as link}
								<a href="/{link.toLowerCase().replace(' ', '-')}" class="page-link-w">
									<span class="text-small btn-txt">{link}</span>
									<span class="btn-icon-w"><span class="text-small btn-txt">→</span></span>
								</a>
							{/each}
						</div>
					</div>
					<div class="ft-nav-col">
						<p split-text="" stagger-scroll="1" class="text-small caps op-60">Services</p>
						<div class="ft-nav-link-w">
							{#each ['Brand Identity', 'Digital Experiences', 'Motion', 'WebGL/VR', 'UX/UI'] as svc}
								<span class="text-small ft-service-item">{svc}</span>
							{/each}
						</div>
					</div>
					<div class="ft-nav-col">
						<p split-text="" stagger-scroll="1" class="text-small caps op-60">Social</p>
						<div class="ft-nav-link-w">
							{#each [['Twitter / X', 'https://twitter.com/itsoffbrand'], ['Instagram', 'https://instagram.com/itsoffbrand'], ['LinkedIn', 'https://linkedin.com/company/itsoffbrand']] as [name, url]}
								<a href={url} target="_blank" rel="noopener" class="page-link-w">
									<span class="text-small btn-txt">{name}</span>
									<span class="btn-icon-w"><span class="text-small btn-txt">↗</span></span>
								</a>
							{/each}
						</div>
					</div>
					<div class="ft-nav-col">
						<p split-text="" stagger-scroll="1" class="text-small caps op-60">Legal</p>
						<div class="ft-nav-link-w">
							<a href="/privacy" class="page-link-w">
								<span class="text-small btn-txt">Privacy</span>
								<span class="btn-icon-w"><span class="text-small btn-txt">→</span></span>
							</a>
						</div>
					</div>
				</div>

				<!-- ─── 하단 바 ───────────────────────── -->
				<div class="ft-bottom mbm-diff">
					<div class="ft-logo-w">
						<svg viewBox="0 0 162 162" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<path d="M108 88.7c-10.8 0-19.7 8.8-19.7 19.7v47.4c0 1.9-1.5 3.4-3.4 3.4h-8.6c-1.9 0-3.4-1.5-3.4-3.4v-47.4c0-10.8-8.8-19.7-19.7-19.7H6.4c-1.9 0-3.4-1.5-3.4-3.4v-8c0-1.9 1.5-3.4 3.4-3.4h46.9c10.8 0 19.7-8.8 19.6-19.7V6.4c0-1.9 1.5-3.4 3.4-3.4H85c1.9 0 3.4 1.5 3.4 3.4v47.8c0 10.8 8.8 19.7 19.7 19.7h46.6c1.9 0 3.4 1.5 3.4 3.4v8c0 1.9-1.5 3.4-3.4 3.4H108z" style="fill-rule:evenodd;clip-rule:evenodd;" fill="currentColor"/>
						</svg>
					</div>
					<div class="ft-copy">
						<p class="text-mini op-60">© 2025 OFF+BRAND. All rights reserved.</p>
						<p class="text-mini op-60">Glasgow, Scotland · offbrand.studio</p>
					</div>
				</div>

			</div>
		</div>
	</div>
</section>

<style>
	/* Footer 전체 */
	.s.is-footer {
		position: relative;
		/* z-index: 1 제거 — z-index가 stacking context를 생성해
		   .mbm-diff { mix-blend-mode: difference }가 footer의 투명 backdrop과 블렌딩됨
		   → difference(#e5e4e0, transparent) = #e5e4e0 → 배경과 동일색 = 텍스트 투명
		   position: relative만으로도 orb(z-index:-2) 위에 올바르게 위치함 */
	}
	.c.is-footer {
		width: 100%;
		padding-left: 2vw;
		padding-right: 2vw;
		max-width: none;
	}
	.ft-content-w {
		border-top: 1px solid var(--border-color, rgba(218,218,218,0.2));
	}

	/* grid-main.is-footer: 3열 */
	:global(.grid-main.is-footer) {
		display: flex;
		flex-direction: column;
		gap: 4em;
	}

	/* ─── CTA 영역 ─── */
	.ft-cta-grid {
		display: flex;
		flex-direction: column;
		gap: 0.1em;
	}
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
	.ft-cta-row {
		display: flex;
		align-items: center;
		gap: 2em;
		flex-wrap: wrap;
	}

	/* CTA 버튼 — 전역 .btn-w 기반, 패딩/반경만 동일하게 명시 */
	.btn-w.is-large {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		padding: 0.8em 1.6em;
		border: 1px solid currentColor;
		border-radius: var(--large-radius);
		text-decoration: none;
		color: inherit;
		font-size: var(--fs-eyebrow);
		transition: background var(--dur-fast) ease, color var(--dur-fast) ease;
	}
	.btn-w.is-large:hover {
		background: var(--text-color);
		color: var(--bg-color);
	}
	.btn-inner { display: flex; align-items: center; gap: 0.5em; }

	/* ─── Nav Grid ─── */
	:global(.grid-main.ft-nav-w) {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 2em;
	}
	.ft-nav-col {
		display: flex;
		flex-direction: column;
		gap: 1em;
	}
	.ft-nav-link-w {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
	}
	.page-link-w {
		display: flex;
		align-items: center;
		gap: 0.3em;
		text-decoration: none;
		color: inherit;
		opacity: 0.7;
		transition: opacity 0.2s;
		font-size: 0.75em;
	}
	.page-link-w:hover { opacity: 1; }
	.ft-service-item {
		display: block;
		font-size: 0.75em;
		opacity: 0.5;
	}
	/* footer 내 text-small/mini: 전역(0.8/0.65em)보다 작게 — 의도적 로컬 override */
	.text-small { font-size: 0.75em; }
	.text-small.caps { text-transform: uppercase; letter-spacing: 0.08em; }
	.op-60 { opacity: 0.6; }
	.text-mini { font-size: var(--fs-mini); }

	/* ─── 하단 바 ─── */
	.ft-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 2em;
		border-top: 1px solid var(--border-color, rgba(218,218,218,0.2));
		padding-top: 1.5em;
	}
	.ft-logo-w { width: 2em; height: 2em; opacity: 0.4; }
	.ft-logo-w svg { width: 100%; height: 100%; }
	.ft-copy { display: flex; flex-direction: column; gap: 0.3em; text-align: right; }
</style>
