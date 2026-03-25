<script lang="ts">
	import { resolve } from '$app/paths';
	// Section 2: "With EMOTION + INNOVATION..." 태그라인 + 기관 설명
	// 원본 w-node CSS 기반 정확한 그리드 배치:
	//   .grid-main (12-col): heading → grid-area: 1/3/2/12
	//   .grid-main.hm-text-grid (12-col):
	//     description+link → grid-column: 2/4
	//     body text        → grid-column: 5/8
</script>

<section class="w-full">
	<div class="w-full max-w-full px-[2vw] mx-auto relative">
		<div class="h-[10vw]"></div>

		<!-- 메인 태그라인: cols 3-12 -->
		<div class="grid grid-cols-12 gap-x-5">
			<div class="mix-blend-difference text-main-light select-none col-start-3 col-end-12">
				<div class="overflow-hidden">
					<h2 stagger-scroll="" split-text="" class="text-h-b font-normal uppercase leading-none tracking-[-0.02em]">
						<span class="invisible">****</span>
						With EMOTION + INNOVATION, We push THE BOUNDARIES OF DIGITAL CREATIVITY.
					</h2>
				</div>
			</div>
		</div>

		<div class="h-[10vw] mob-2"></div>

		<!-- 설명 텍스트 두 열: left=cols2-4, right=cols5-8 -->
		<div class="grid grid-cols-12 gap-x-5">
			<div class="mix-blend-difference text-main-light select-none col-start-2 col-end-4">
				<div class="overflow-hidden">
					<p split-text="" stagger-scroll="1" class="text-[0.75em] leading-[1.6] uppercase tracking-[0.05em]">
						We are a founder-led Scottish born, global digital marketing, branding &amp; web design
						agency.
					</p>
				</div>
				<div link-reveal="" class="link-wrap hide-m overflow-hidden">
					<div class="overflow-hidden">
						<a reveal-target="" stagger-el="" href={resolve('/')} class="page-link-w inline-flex items-center gap-2 mt-[1.2em] text-inherit no-underline opacity-60 transition-opacity duration-200 hover:opacity-100">
							<div class="page-link-inner overflow-hidden">
								<div split-text="" stagger-text="" class="text-[0.85em]">About Us</div>
								<div class="flex items-center opacity-70"><div class="text-[0.85em]">-&gt;</div></div>
							</div>
							<div class="link-track"><div class="link-track-fill"></div></div>
						</a>
					</div>
				</div>
			</div>
			<div class="mix-blend-difference text-main-light select-none col-start-5 col-end-8">
				<div class="overflow-hidden">
					<p stagger-lines="2" split-text="" class="text-[0.85em] leading-[1.6]">
						Every brand has a story, from startups finding their voice to titans refining their
						legacy. We ensure that tale shines brilliantly. With a blend of rapid iteration and
						collaborative spirit, we empower you to reshape your digital narrative.
					</p>
				</div>
			</div>
		</div>

		<div class="h-[10vw]"></div>
	</div>
</section>

<style>
	/* hover track animation — parent:hover child, can't express in Tailwind */
	.page-link-w {
		position: relative;
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
</style>
