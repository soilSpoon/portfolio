<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<div class="resume-page">
	<!-- Row: Header -->
	<div class="sidebar-cell flex flex-col items-center border-b border-white/10 pt-7 pb-4">
		<div class="text-lg font-bold tracking-wide text-white">이대희</div>
		<div class="mt-0.5 text-center text-white/50" style="font-size:9px;font-weight:300;letter-spacing:0.5px">
			Fullstack Developer
		</div>
	</div>
	<div class="main-cell flex items-center border-b border-gray-200 pt-6 pb-3">
		<p class="m-0 leading-relaxed text-gray-500" style="font-size:9.2px">
			PHP/Laravel과 React/TypeScript 기반으로 <strong class="text-gray-900">7년간</strong> 풀스택 서비스를
			설계하고 운영해왔습니다. 대량 데이터 처리 최적화, 레거시 리팩토링, CI/CD 자동화를 통해 실질적인
			개발 효율을 끌어올린 경험이 있으며, 코드 품질 개선과 협업 문화 구축에 강점을 가지고 있습니다.
		</p>
	</div>

	<!-- Row: Contact -->
	<div class="sidebar-cell">
		<span class="section-label">Contact</span>
	</div>
	<div class="main-cell">
		<div class="flex flex-wrap gap-x-4 gap-y-1 text-gray-500" style="font-size:8.5px">
			<span>010-9382-0872</span>
			<span>lee111dae11@proton.me</span>
			<a href="https://github.com/soilSpoon" class="text-blue-500 no-underline">github.com/soilSpoon</a>
			<a href="https://www.linkedin.com/in/mlz37" class="text-blue-500 no-underline">linkedin.com/in/mlz37</a>
		</div>
	</div>

	<!-- Row: Skills -->
	<div class="sidebar-cell">
		<span class="section-label">Skills</span>
	</div>
	<div class="main-cell">
		<div class="flex flex-col gap-0.5">
			{#each [
				{ label: 'Backend', tags: ['PHP', 'Laravel', 'Node.js', 'Nest.js', 'Python', 'MySQL', 'PostgreSQL', 'Redis'] },
				{ label: 'Frontend', tags: ['TypeScript', 'React', 'Next.js', 'React Native', 'Electron'] },
				{ label: 'DevOps', tags: ['Docker', 'GitHub Actions', 'AWS', 'Vercel'] },
				{ label: 'Other', tags: ['WASM', 'C++', 'Golang', 'C#/WPF'] }
			] as { label, tags }}
				<div class="flex items-baseline gap-2">
					<span class="w-13 shrink-0 font-semibold text-gray-400" style="font-size:8px">{label}</span>
					<div class="flex flex-wrap gap-0.5">
						{#each tags as t}
							<span class="rounded bg-gray-100 px-1.5 py-px text-gray-500" style="font-size:7.8px">{t}</span>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Row: 경력 -->
	<div class="sidebar-cell">
		<span class="section-label">경력</span>
	</div>
	<div class="main-cell">
		<div class="career-row">
			<span>주식회사 에브리심 — <em class="not-italic text-gray-400" style="font-size:8.5px">제품개발 책임</em></span>
			<span class="period">2025.03 – 재직중</span>
		</div>
		<div class="career-row">
			<span>씨엠유니버스(주) — <em class="not-italic text-gray-400" style="font-size:8.5px">개발 주임</em></span>
			<span class="period">2018.09 – 2023.11 (5년 3개월)</span>
		</div>
	</div>

	<!-- Row: 프로젝트 -->
	<div class="sidebar-cell">
		<span class="section-label">프로젝트</span>
	</div>
	<div class="main-cell">
		<article class="mb-1.5">
			<div class="flex items-baseline justify-between">
				<strong class="text-gray-900" style="font-size:10px">에브리드론 — 드론 시뮬레이션 플랫폼</strong>
				<span class="period">2025.03 – 2026.01</span>
			</div>
			<p class="project-sub">에브리심 · 제품개발 책임</p>
			<ul class="project-list">
				<li>C++ 드론 시뮬레이션 엔진을 WebAssembly로 컴파일하여 브라우저 실행 구현</li>
				<li>Nest.js 백엔드 API 설계 및 Next.js 프론트엔드 개발, 전 영역 주도하여 제품 출시</li>
			</ul>
			<p class="tech">C++ · WASM · Nest.js · Next.js · TypeScript</p>
		</article>

		<article class="mb-1.5">
			<div class="flex items-baseline justify-between">
				<strong class="text-gray-900" style="font-size:10px">출근노트 — 근태 및 급여 관리 SaaS</strong>
				<span class="period">2020.08 – 2025.03</span>
			</div>
			<p class="project-sub">
				씨엠유니버스 · 풀스택 개발자 ·
				<a href="https://new.gwnote.com/" class="text-blue-500 no-underline">gwnote.com</a>
			</p>
			<ul class="project-list">
				<li>B2B2C 플랫폼(5단계 권한 체계) 초기 세팅부터 주도 개발</li>
				<li>캐싱 전략 및 쿼리 구조 개선으로 대량 급여 정산 API 응답 속도 향상</li>
				<li>디자인 시스템 도입·컴포넌트화로 레거시 코드 중복 제거</li>
				<li>GitHub Actions 자체 호스팅 및 환경 캐싱으로 CI 속도 개선</li>
				<li>테스트 코드·Lint 도입으로 팀 코드 품질 표준화</li>
			</ul>
			<p class="tech">React · React Native · TypeScript · Laravel · Redis · MySQL · AWS · Docker</p>
		</article>

		<article class="mb-1.5">
			<div class="flex items-baseline justify-between">
				<strong class="text-gray-900" style="font-size:10px">GSS — 철판 결함 분석 시스템</strong>
				<span class="period">2019.12 – 2023.11</span>
			</div>
			<p class="project-sub">씨엠유니버스 · 풀스택 개발자 (MES 차공정 주도)</p>
			<ul class="project-list">
				<li>2차원 결함 좌표·크기·등급 기반 코일 품질 판정 알고리즘 설계·구현</li>
				<li>실시간 소켓 대량 데이터 필터링 + 메모이제이션 적용으로 처리 속도 개선</li>
				<li>중간 가공 데이터 저장 제거로 디스크 사용량 절감</li>
			</ul>
			<p class="tech">Electron · TypeScript · React · Next.js · Laravel · MySQL · WebSocket</p>
		</article>

		<article class="mb-1.5">
			<div class="flex items-baseline justify-between">
				<strong class="text-gray-900" style="font-size:10px">ESM / SSMT — 하드웨어·서버 모니터링</strong>
				<span class="period">2018.11 – 2020.12</span>
			</div>
			<p class="project-sub">씨엠유니버스 · 풀스택 / Windows Native 개발자</p>
			<ul class="project-list">
				<li>SNMP·ICMP·SSH 멀티 프로토콜 기반 하드웨어 상태 수집 시스템 개발</li>
				<li>C#/WPF 기반 다중 서버 모니터링 도구 및 네트워크 통신 최적화</li>
			</ul>
			<p class="tech">Electron · C# · WPF · Golang · Laravel · MySQL</p>
		</article>
	</div>

	<!-- Row: 사이드 프로젝트 -->
	<div class="sidebar-cell">
		<span class="section-label">사이드 프로젝트</span>
	</div>
	<div class="main-cell">
		<article>
			<div class="flex items-baseline justify-between">
				<strong class="text-gray-900" style="font-size:10px">슈퍼워크 바닥가 — M2E 신발 가격 트래커</strong>
				<span class="period">2022.07~</span>
			</div>
			<p class="project-sub">
				<a href="https://superwalk.vercel.app/" class="text-blue-500 no-underline">superwalk.vercel.app</a> · DAU ~50 · 인프라 비용 0원
			</p>
			<ul class="project-list">
				<li>Astro + React Zero JS 프론트엔드, TRPC + Next.js Serverless API, Supabase PostgreSQL 자동 수집</li>
			</ul>
		</article>
	</div>

	<!-- Row: 학력 -->
	<div class="sidebar-cell">
		<span class="section-label">학력</span>
	</div>
	<div class="main-cell">
		<div class="career-row">
			<span>국가평생교육진흥원 학점은행제 — <em class="not-italic text-gray-400" style="font-size:8.5px">컴퓨터공학 학사</em></span>
			<span class="period">2024~ 재학</span>
		</div>
		<div class="career-row">
			<span>세명컴퓨터고등학교 — <em class="not-italic text-gray-400" style="font-size:8.5px">스마트보안솔루션학과</em></span>
			<span class="period">2016 – 2019</span>
		</div>
	</div>

	<!-- Row: 자격·기타 -->
	<div class="sidebar-cell">
		<span class="section-label">자격·기타</span>
	</div>
	<div class="main-cell">
		<div class="flex flex-wrap gap-x-4 gap-y-0.5 text-gray-500" style="font-size:8.5px">
			<span>정보처리기사 (2022)</span>
			<span>정보기기운용기능사 (2018)</span>
			<span>Upstage AI Lab 2기 수료 (2024)</span>
			<span>산업기능요원 복무 (2020–2022)</span>
		</div>
	</div>
</div>

<style>
	@reference "tailwindcss";

	/* ── A4 page grid — print-specific dimensions must stay as custom CSS ── */
	.resume-page {
		display: grid;
		grid-template-columns: 44mm 1fr;
		width: 210mm;
		height: 297mm;
		margin: 0 auto;
		font-family: 'Toss Product Sans', sans-serif;
		font-size: 9.5px;
		line-height: 1.45;
		color: #333D4B;
		background: #fff;
		overflow: hidden;
		box-shadow: 0 2px 16px rgba(0, 0, 0, 0.12);
	}

	/* ── Sidebar column ── */
	.sidebar-cell {
		@apply flex items-start bg-gray-900 px-4 pt-3 text-white/60;
	}

	.section-label {
		@apply border-l-2 border-white/20 pl-2 font-semibold tracking-wide;
		font-size: 8.5px;
		color: #f2f4f6;
	}

	/* ── Main column ── */
	.main-cell {
		@apply px-5 pr-7 pt-3;
	}

	/* ── Shared small-text patterns ── */
	.career-row {
		@apply mb-px flex items-baseline justify-between;
		font-size: 9px;
	}

	.period {
		@apply shrink-0 whitespace-nowrap text-gray-400;
		font-size: 7.8px;
	}

	.project-sub {
		@apply m-0 text-gray-400;
		font-size: 7.8px;
	}

	.project-sub :global(a) {
		@apply text-blue-500 no-underline;
	}

	.project-list {
		@apply mt-px mb-0 pl-3;
	}

	.project-list li {
		@apply mb-0 leading-snug text-gray-500;
		font-size: 8.5px;
	}

	.tech {
		@apply mt-px mb-0 text-gray-400;
		font-size: 7.2px;
	}

	/* ── Print ── */
	@media print {
		.resume-page {
			width: 100%;
			height: auto;
			box-shadow: none;
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}
	}
</style>
