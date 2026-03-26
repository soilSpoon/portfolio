<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<section class="w-full">
	<div class="w-full max-w-full px-[2vw] mx-auto relative">
		<div class="h-[10vw]"></div>

		<!-- 메인 태그라인: cols 3-12 -->
		<div class="grid grid-cols-12 gap-x-5">
			<div class="overlay-text col-start-3 col-end-12">
				<div class="overflow-hidden">
					<h2 stagger-scroll="" split-text="" class="text-h-b font-normal uppercase leading-none tracking-[-0.02em]">
						<span class="invisible">****</span>
						언어를 가리지 않는 풀스택 개발자. AI 도구로 효율을 만들고, 필요하면 직접 만듭니다.
					</h2>
				</div>
			</div>
		</div>

		<div class="h-[10vw]"></div>

		<!-- 설명 텍스트 두 열 -->
		<div class="grid grid-cols-12 gap-x-5">
			<div class="overlay-text col-start-2 col-end-4">
				<div class="overflow-hidden">
					<p split-text="" stagger-scroll="1" class="text-[0.75em] leading-[1.6] uppercase tracking-[0.05em]">
						7년차 풀스택 개발자. B2B SaaS부터 3D CAD 엔진, 오픈소스까지.
					</p>
				</div>
				<div link-reveal="" class="link-wrap hide-m overflow-hidden">
					<div class="overflow-hidden">
						<a reveal-target="" stagger-el="" href={resolve('/cv')} class="group/link relative inline-flex items-center gap-2 mt-[1.2em] text-inherit no-underline opacity-60 transition-opacity duration-200 hover:opacity-100">
							<div class="overflow-hidden">
								<div split-text="" stagger-text="" class="text-[0.85em]">View CV</div>
								<div class="flex items-center opacity-70"><div class="text-[0.85em]">-&gt;</div></div>
							</div>
							<div class="absolute -bottom-px left-0 h-px w-full bg-current opacity-30">
								<div class="h-full w-0 bg-current transition-[width] duration-300 ease-[ease] group-hover/link:w-full"></div>
							</div>
						</a>
					</div>
				</div>
			</div>
			<div class="overlay-text col-start-5 col-end-8">
				<div class="overflow-hidden">
					<p stagger-lines="2" split-text="" class="text-[0.85em] leading-[1.6]">
						React·TypeScript를 주력으로 하되, C++, Rust, PHP 등 필요한 언어는 가리지 않습니다.
						Claude Code, Codex 등 AI 코딩 도구를 적극 활용해 효율적으로 개발하며,
						제품의 설계부터 운영까지 전 주기를 주도해왔습니다.
					</p>
				</div>
			</div>
		</div>

		<div class="h-[10vw]"></div>
	</div>
</section>
