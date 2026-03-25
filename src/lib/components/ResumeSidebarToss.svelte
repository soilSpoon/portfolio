<div
	class="resume-page mx-auto grid h-[297mm] w-[210mm] grid-cols-[72mm_minmax(0,1fr)] bg-white text-[10px] leading-[1.5] text-[#333D4B] shadow-[0_12px_40px_rgba(15,23,42,0.12)]"
>
	<!-- ─── Sidebar ─── -->
	<aside
		class="flex h-full min-h-0 flex-col gap-[20px] bg-[#202632] px-[16px] pt-[28px] pb-[26px]"
	>
		<div class="border-b border-white/10 pb-[12px]">
			<div class="text-center text-[24px] font-bold tracking-[0.5px] text-white">이대희</div>
			<div class="mt-[4px] text-center text-[11px] text-[#8B95A1]">Frontend Developer</div>
		</div>

		<div>
			<div
				class="mb-[6px] border-b border-[#2B3240] pb-[4px] text-[9px] font-bold tracking-[1.2px] text-[#0064FF] uppercase"
			>
				Contact
			</div>
			<div class="flex flex-col gap-[5px] text-[9.5px] text-[#B0B8C1]">
				<div class="flex min-w-0 items-center gap-[6px]">
					<svg class="h-[12px] w-[12px] shrink-0 fill-[#6B7684]" viewBox="0 0 24 24"
						><path
							d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z"
						/></svg
					>
					<span class="min-w-0">010-9382-0872</span>
				</div>
				<div class="flex min-w-0 items-center gap-[6px]">
					<svg class="h-[12px] w-[12px] shrink-0 fill-[#6B7684]" viewBox="0 0 24 24"
						><path
							d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
						/></svg
					>
					<span class="min-w-0 break-all">lee111dae11@proton.me</span>
				</div>
				<a
					class="sidebar-link flex min-w-0 items-center gap-[6px] font-bold underline underline-offset-[2px]"
					href="https://github.com/soilSpoon"
				>
					<svg class="h-[12px] w-[12px] shrink-0 fill-[#6B7684]" viewBox="0 0 24 24"
						><path
							d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.806 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.51 11.51 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z"
						/></svg
					>
					<span class="min-w-0 break-all">soilSpoon</span>
				</a>
				<a
					class="sidebar-link flex min-w-0 items-center gap-[6px] font-bold underline underline-offset-[2px]"
					href="https://www.linkedin.com/in/mlz37"
				>
					<svg class="h-[12px] w-[12px] shrink-0 fill-[#6B7684]" viewBox="0 0 24 24"
						><path
							d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
						/></svg
					>
					<span class="min-w-0 break-all">mlz37</span>
				</a>
			</div>
		</div>

		<div>
			<div
				class="mb-[6px] border-b border-[#2B3240] pb-[4px] text-[9px] font-bold tracking-[1.2px] text-[#0064FF] uppercase"
			>
				Skills
			</div>
			{#each [{ label: 'Frontend', tags: ['TypeScript', 'React', 'Next.js', 'Jotai', 'Zustand', 'React Query', 'Zod', 'Tailwind CSS', 'shadcn/ui', 'Emotion', 'Chakra UI', 'Electron', 'React Native'] }, { label: 'Build & Tooling', tags: ['Vite', 'SWC', 'Webpack', 'WASM/Emscripten', 'Storybook'] }, { label: 'Backend', tags: ['Node.js', 'Nest.js', 'Laravel', 'MySQL', 'PostgreSQL', 'Redis'] }, { label: 'DevOps', tags: ['Docker', 'GitHub Actions', 'AWS', 'Vercel'] }] as cat}
				<div class="mb-[6px]">
					<div class="mb-[3px] text-[8px] font-bold tracking-[0.5px] text-[#6B7684] uppercase">
						{cat.label}
					</div>
					<div class="flex flex-wrap gap-[5px]">
						{#each cat.tags as t}
							<span
								class="rounded-full bg-[#2B3240] px-[7px] py-[2.5px] text-[7.8px] font-medium text-[#DDE3EA]"
								>{t}</span
							>
						{/each}
					</div>
				</div>
			{/each}
		</div>

		<div>
			<div
				class="mb-[6px] border-b border-[#2B3240] pb-[4px] text-[9px] font-bold tracking-[1.2px] text-[#0064FF] uppercase"
			>
				Education
			</div>
			<div class="mb-[6px]">
				<div class="text-[9.5px] font-bold text-[#D1D6DB]">국가평생교육진흥원 학점은행제</div>
				<div class="text-[8.5px] text-[#8B95A1]">컴퓨터공학 학사 | 2024~ 재학</div>
			</div>
			<div class="mb-[4px]">
				<div class="text-[9.5px] font-bold text-[#D1D6DB]">세명컴퓨터고등학교</div>
				<div class="text-[8.5px] text-[#8B95A1]">스마트보안솔루션학과 | 2016–2019</div>
			</div>
			<div>
				<div class="text-[9.5px] font-bold text-[#D1D6DB]">서울여자대학교 정보보호영재교육원</div>
				<div class="text-[8.5px] text-[#8B95A1]">수료 | 2017</div>
			</div>
		</div>

		<div>
			<div
				class="mb-[6px] border-b border-[#2B3240] pb-[4px] text-[9px] font-bold tracking-[1.2px] text-[#0064FF] uppercase"
			>
				Certifications
			</div>
			<div class="flex flex-col gap-[3px] text-[9.5px] text-[#B0B8C1]">
				<span>정보처리기사 <span class="text-[#6B7684]">2022.06</span></span>
				<span>정보기기운용기능사 <span class="text-[#6B7684]">2018.07</span></span>
				<span>인터넷윤리지도사 <span class="text-[#6B7684]">2017.07</span></span>
			</div>
		</div>

		<div>
			<div
				class="mb-[6px] border-b border-[#2B3240] pb-[4px] text-[9px] font-bold tracking-[1.2px] text-[#0064FF] uppercase"
			>
				Other
			</div>
			<div class="text-[9px] leading-[1.6] text-[#8B95A1]">
				Upstage AI Lab 2기 수료 (2024)<br />
				산업기능요원 복무 (2020–2022)
			</div>
		</div>
	</aside>

	<!-- ─── Main ─── -->
	<main class="flex min-w-0 flex-col gap-[14px] px-[28px] pt-[28px] pb-[24px]">
		<!-- Profile -->
		<div class="min-w-0 border-b border-[#E5E8EB] pb-[8px] break-keep">
			<p class="m-0 mb-[9px] text-[11px] leading-[1.65] text-[#4E5968]">
				React·TypeScript 기반 <strong class="text-[#333D4B]">7년차</strong> 프론트엔드 엔지니어.
				Jotai·Emotion·React Query 등 상태관리 아키텍처 설계, 디자인 시스템 구축, 대량 데이터 렌더링 최적화,
				웹 접근성까지 주도해왔습니다.
			</p>
			<ul class="bullet-list">
				<li>
					B2B SaaS 프론트엔드 — Chakra UI 디자인 시스템, React Query/Jotai/Zustand 3계층 상태관리, 수천 행 가상화 최적화
				</li>
				<li>
					webpack 내부 수정으로 React Fast Refresh 구현 — laravel-mix에 12개 PR merged, SWC·Jotai·Valtio 등 오픈소스 기여
				</li>
				<li>
					OpenCASCADE WASM 브라우저 이식 + Next.js SSR 호환 — AI 챗봇 UI로 복잡한 워크플로우 단순화
				</li>
			</ul>
		</div>

		<!-- 경력~사이드 프로젝트 -->
		<div class="grid flex-1 auto-rows-max content-between gap-[14px]">
			<!-- 경력 -->
			<section class="min-w-0 space-y-[5px]">
				<h2
					class="m-0 mb-[6px] border-b border-[#0064FF]/40 pb-[4px] text-[14px] font-bold tracking-[0.3px] text-[#333D4B]"
				>
					경력
				</h2>
				<div class="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-[8px]">
					<span class="min-w-0 text-[11.5px] font-bold text-[#333D4B]"
						>주식회사 에브리심 — <span class="font-normal text-[#6B7684]">제품개발 책임</span></span
					>
					<span class="shrink-0 pl-[8px] text-right text-[9px] text-[#8B95A1]">2025.03 – 재직중</span>
				</div>
				<div class="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-[8px]">
					<span class="min-w-0 text-[11.5px] font-bold text-[#333D4B]"
						>씨엠유니버스(주) — <span class="font-normal text-[#6B7684]">개발 주임</span></span
					>
					<span class="shrink-0 pl-[8px] text-right text-[9px] text-[#8B95A1]">2018.09 – 2023.11 (5년 3개월)</span>
				</div>
			</section>

			<!-- 프로젝트 -->
			<section class="min-w-0 space-y-[8px]">
				<h2
					class="m-0 mb-[6px] border-b border-[#0064FF]/40 pb-[4px] text-[14px] font-bold tracking-[0.3px] text-[#333D4B]"
				>
					프로젝트
				</h2>
				<div class="flex flex-col gap-[12px]">
					<article class="space-y-[3px]">
						<div class="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-[8px]">
							<span class="min-w-0 text-[12px] font-bold text-[#333D4B]"
								>에브리드론 — 드론/CFD 시뮬레이션 플랫폼</span
							>
							<span class="shrink-0 pl-[8px] text-right text-[9px] text-[#8B95A1]">2025.03 – 2026.01</span>
						</div>
						<div class="text-[9px] text-[#8B95A1] [overflow-wrap:anywhere]">
							에브리심 · 제품개발 책임 · <a
								href="https://everydrone.io"
								class="text-[#0064FF] underline decoration-[#0064FF]/30">everydrone.io</a
							>
						</div>
						<ul class="bullet-list">
							<li>
								통합 디자인 시스템 + Storybook 기반 컴포넌트 단위 개발·테스트 자동화
							</li>
							<li>
								OpenCASCADE WASM 컴파일 — d.ts 자동 생성, Next.js SSR 호환(dynamic import + Suspense)
							</li>
							<li>
								AI SDK v5 기반 챗봇 프론트엔드 — 스트리밍 응답 렌더링, 클라이언트 사이드 도구 실행으로 시뮬레이션 직접 제어
							</li>
							<li>PostHog 이벤트 트래킹으로 UX 병목 식별 — heatmap 분석 기반 UI 개선</li>
						</ul>
						<div class="text-[8px] text-[#8B95A1] [overflow-wrap:anywhere]">
							Next.js · TypeScript · Nest.js · WASM/Emscripten · AI SDK · Prisma · PostHog · Storybook
						</div>
					</article>

					<article class="space-y-[3px]">
						<div class="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-[8px]">
							<span class="min-w-0 text-[12px] font-bold text-[#333D4B]"
								>출근노트 — 근태 및 급여 관리 SaaS</span
							>
							<span class="shrink-0 pl-[8px] text-right text-[9px] text-[#8B95A1]">2020.08 – 2025.03</span>
						</div>
						<div class="text-[9px] text-[#8B95A1] [overflow-wrap:anywhere]">
							씨엠유니버스 · 풀스택 개발자 · <a
								href="https://new.gwnote.com/"
								class="text-[#0064FF] underline decoration-[#0064FF]/30">gwnote.com</a
							>
						</div>
						<ul class="bullet-list">
							<li>
								Chakra UI 디자인 시스템 53개 공통 컴포넌트 — WAI-ARIA 접근성 적용, 346개 파일 재사용, 개발 시간
								50% 단축
							</li>
							<li>
								React Query/Zustand/Jotai 3계층 상태관리 — 서버·전역·로컬 상태 분리로 리렌더링 제거
							</li>
							<li>
								수천 명 급여 정산 최적화 — react-window 가상화 + React.memo + Redis 캐싱으로 UI
								프리징 해소
							</li>
							<li>
								B2B2C 5단계 권한 체계 — PermissionGate 중앙 집중화, 노무법인 6개 모듈 신규 개발
							</li>
							<li>React Native + WebView 하이브리드 모바일 앱 — iOS/Android 플랫폼 차이 대응, 스토어 배포</li>
							<li>jQuery/PHP 5 → React/Laravel 전면 전환 주도 — 컴포넌트 기반 UI 개발 체계 구축</li>
						</ul>
						<div class="text-[8px] text-[#8B95A1] [overflow-wrap:anywhere]">
							React · TypeScript · Jotai · Zustand · React Query · Zod · Emotion · Chakra UI · React Native ·
							Laravel · Redis · MySQL
						</div>
					</article>

					<article class="space-y-[3px]">
						<div class="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-[8px]">
							<span class="min-w-0 text-[12px] font-bold text-[#333D4B]"
								>GSS — 포스코 철판 결함 분석 시스템 (MES)</span
							>
							<span class="shrink-0 pl-[8px] text-right text-[9px] text-[#8B95A1]">2019.12 – 2023.11</span>
						</div>
						<div class="text-[9px] text-[#8B95A1] [overflow-wrap:anywhere]">
							씨엠유니버스 · 풀스택 개발자 (MES 차공정 주도)
						</div>
						<ul class="bullet-list">
							<li>Electron + React 실시간 대시보드 — WebSocket 대량 데이터 전처리 + 배치 렌더링</li>
							<li>코일 품질 판정 규칙 엔진 — 설정 파일 기반, 코드 수정 없이 판정 기준 변경</li>
							<li>중간 데이터를 메모리 파이프라인으로 전환 — 디스크 누적 문제 해결</li>
						</ul>
						<div class="text-[8px] text-[#8B95A1] [overflow-wrap:anywhere]">
							Electron · TypeScript · React · Next.js · Ant Design · Laravel · MySQL · WebSocket
						</div>
					</article>
				</div>
			</section>

			<!-- 오픈소스 기여 -->
			<section class="min-w-0 space-y-[5px]">
				<h2
					class="m-0 mb-[6px] border-b border-[#0064FF]/40 pb-[4px] text-[14px] font-bold tracking-[0.3px] text-[#333D4B]"
				>
					오픈소스 기여
				</h2>
				<ul class="bullet-list">
					<li>100+ stars 오픈소스 23개 프로젝트에 53개 PR merged — 소스 분석 후 직접 기여</li>
					<li>
						<a href="https://github.com/withastro/astro" class="oss-link">Astro</a> ·
						<a href="https://github.com/swc-project/swc" class="oss-link">SWC</a> ·
						<a href="https://github.com/pmndrs/jotai" class="oss-link">Jotai</a> ·
						<a href="https://github.com/pmndrs/valtio" class="oss-link">Valtio</a> ·
						<a href="https://github.com/FredKSchott/snowpack" class="oss-link">Snowpack</a> ·
						<a href="https://github.com/tremorlabs/tremor" class="oss-link">Tremor</a> 등에 기여
					</li>
					<li>
						<a href="https://github.com/laravel-mix/laravel-mix" class="oss-link">laravel-mix</a>:
						webpack 내부 수정 — React Fast Refresh 구현, dev-server 4.0 마이그레이션 등 12개 PR merged
					</li>
					<li>
						<a href="https://github.com/router-for-me/CLIProxyAPI" class="oss-link">CLIProxyAPI</a
						> 메인테이너 — Claude/Gemini/Codex 프록시 에러 핸들링, thinking/tool signature
						처리, 캐시 최적화 등 기여
					</li>
				</ul>
			</section>

			<!-- 사이드 프로젝트 -->
			<section class="min-w-0 space-y-[5px]">
				<h2
					class="m-0 mb-[6px] border-b border-[#0064FF]/40 pb-[4px] text-[14px] font-bold tracking-[0.3px] text-[#333D4B]"
				>
					사이드 프로젝트
				</h2>
				<div class="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-[8px]">
					<span class="min-w-0 text-[11.5px] font-bold text-[#333D4B]"
						>슈퍼워크 바닥가 — M2E 신발 가격 트래커</span
					>
					<span class="shrink-0 pl-[8px] text-right text-[9px] text-[#8B95A1]">2022.07~</span>
				</div>
				<div class="text-[9px] text-[#8B95A1] [overflow-wrap:anywhere]">
					<a
						href="https://superwalk.vercel.app/"
						class="text-[#0064FF] underline decoration-[#0064FF]/30">superwalk.vercel.app</a
					> · 인프라 비용 0원
				</div>
				<ul class="bullet-list">
					<li>Next.js + Chakra UI + TanStack Query, Chart.js 가격 추이 시각화</li>
					<li>Drizzle ORM + Neon PostgreSQL, Vercel KV 캐싱, i18next 다국어 지원</li>
				</ul>
			</section>
		</div>
	</main>
</div>
<style>
	@reference "tailwindcss";

	.resume-page {
		font-family:
			'Toss Product Sans',
			-apple-system,
			BlinkMacSystemFont,
			sans-serif;
		box-sizing: border-box;
	}

	/* li bullet — 유일한 커스텀 스타일 (::before pseudo-element는 Tailwind로 반복하면 너무 장황) */
	.bullet-list {
		margin: 5px 0 0 0;
		padding-left: 13px;
		list-style: none;
	}

	.bullet-list li {
		font-size: 10px;
		color: #4e5968;
		line-height: 1.5;
		margin-bottom: 3px;
		position: relative;
		overflow-wrap: anywhere;
	}

	.bullet-list li::before {
		content: '·';
		position: absolute;
		left: -9px;
		color: #8b95a1;
	}

	.oss-link,
	.oss-link:visited,
	.oss-link:link {
		color: #333d4b;
		font-weight: 700;
		text-decoration: underline;
		text-decoration-color: rgba(51, 61, 75, 0.3);
		text-underline-offset: 2px;
	}

	.sidebar-link,
	.sidebar-link:visited,
	.sidebar-link:link {
		color: #e8e8e8;
		text-decoration-color: rgba(232, 232, 232, 0.4);
	}

	/* @page 규칙은 +layout.svelte의 인라인 <style>에서 관리 — 여기서 선언하면 전역 충돌 */
	@media print {
		:global(.no-print) {
			display: none;
		}

		.resume-page {
			width: 210mm;
			height: 297mm;
			min-height: 297mm;
			margin: 0;
			box-shadow: none;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}
	}
</style>
