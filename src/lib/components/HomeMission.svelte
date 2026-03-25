<script lang="ts">
	import { resolve } from '$app/paths';
	// Section 2: "With EMOTION + INNOVATION..." 태그라인 + 기관 설명
	// 원본 w-node CSS 기반 정확한 그리드 배치:
	//   .grid-main (12-col): heading → grid-area: 1/3/2/12
	//   .grid-main.hm-text-grid (12-col):
	//     description+link → grid-column: 2/4
	//     body text        → grid-column: 5/8
</script>

<section class="s">
	<div class="c">
		<div class="spacer-10"></div>

		<!-- 메인 태그라인: cols 3-12 -->
		<div class="grid-main">
			<div class="mbm-diff hm-heading-col">
				<div class="o-hidden">
					<h2 stagger-scroll="" split-text="" class="h-b">
						<span class="span-hidden">****</span>
						With EMOTION + INNOVATION, We push THE BOUNDARIES OF DIGITAL CREATIVITY.
					</h2>
				</div>
			</div>
		</div>

		<div class="spacer-10 mob-2"></div>

		<!-- 설명 텍스트 두 열: left=cols2-4, right=cols5-8 -->
		<div class="grid-main hm-text-grid">
			<div class="mbm-diff hm-desc-col">
				<div class="o-hidden">
					<p split-text="" stagger-scroll="1" class="text-small caps">
						We are a founder-led Scottish born, global digital marketing, branding &amp; web design
						agency.
					</p>
				</div>
				<div link-reveal="" class="o-hidden link-wrap hide-m">
					<div class="o-hidden">
						<a reveal-target="" stagger-el="" href={resolve('/')} class="page-link-w">
							<div class="o-hidden page-link-inner">
								<div split-text="" stagger-text="" class="text-small btn-txt">About Us</div>
								<div class="btn-icon-w"><div class="text-small btn-txt">-&gt;</div></div>
							</div>
							<div class="link-track"><div class="link-track-fill"></div></div>
						</a>
					</div>
				</div>
			</div>
			<div class="mbm-diff hm-body-col">
				<div class="o-hidden">
					<p stagger-lines="2" split-text="" class="text-small">
						Every brand has a story, from startups finding their voice to titans refining their
						legacy. We ensure that tale shines brilliantly. With a blend of rapid iteration and
						collaborative spirit, we empower you to reshape your digital narrative.
					</p>
				</div>
			</div>
		</div>

		<div class="spacer-10"></div>
	</div>
</section>

<style>
	/* ─── 헤딩 그리드: cols 3-12 */
	.hm-heading-col {
		grid-column: 3 / 12;
	}

	/* ─── 텍스트 그리드 (12열) */
	.hm-text-grid {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		column-gap: 1.25em;
	}
	.hm-desc-col {
		grid-column: 2 / 4;
	}
	.hm-body-col {
		grid-column: 5 / 8;
	}

	/* ─── 타이포그래피 */
	.text-small {
		font-size: 0.85em;
		line-height: 1.6;
	}
	.text-small.caps {
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-size: 0.75em;
	}

	/* ─── About Us 링크 */
	.page-link-w {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		margin-top: 1.2em;
		text-decoration: none;
		color: inherit;
		opacity: 0.6;
		transition: opacity 0.2s;
		position: relative;
	}
	.page-link-w:hover {
		opacity: 1;
	}
	.page-link-inner {
		display: flex;
		align-items: center;
		gap: 0.3em;
	}
	.link-track {
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 100%;
		height: 1px;
		background: currentColor;
		opacity: 0.3;
	}
	.link-track-fill {
		height: 100%;
		width: 0%;
		background: currentColor;
		transition: width 0.3s ease;
	}
	.page-link-w:hover .link-track-fill {
		width: 100%;
	}

	.span-hidden {
		visibility: hidden;
	}
	.spacer-10 {
		height: 10vw;
	}
	.o-hidden {
		overflow: hidden;
	}
</style>
