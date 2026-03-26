<script lang="ts">
	import './cv.css';
	import { getLocale, setLocale } from '$lib/paraglide/runtime';
	let { children } = $props();

	function toggleLocale() {
		const current = getLocale();
		const next = current === 'en' ? 'ko-kr' : 'en';
		setLocale(next);
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://static.toss.im" crossorigin="anonymous" />
	<link href="https://static.toss.im/tps/main.css" rel="stylesheet" />
</svelte:head>

<div
	class="cv-root mx-auto max-w-[800px] px-8 py-12 font-['Toss_Product_Sans',sans-serif] text-base leading-relaxed text-gray-900"
>
	<div class="no-print mb-4 flex justify-end">
		<button
			onclick={toggleLocale}
			class="cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
		>
			{getLocale() === 'en' ? '한국어' : 'English'}
		</button>
	</div>
	{@render children()}
</div>

<style>
	@reference "tailwindcss";

	/* --spacing 오버라이드: portfolio의 @theme { --spacing: 0.25em }이
	   :root에 전파되므로, CV에서는 표준 rem 기반으로 복원 */
	.cv-root {
		--spacing: 0.25rem;
		max-width: 800px;
		margin-left: auto;
		margin-right: auto;
		padding: 3rem 2rem;
		font-family: 'Toss Product Sans', sans-serif;
		font-size: 1rem;
		line-height: 1.625;
		color: #111827;
	}

	/* ── 마크다운 렌더링 스타일 (Tailwind @apply 불가 — :global 필요) ── */
	:global(.cv-markdown h1) {
		@apply mb-1 text-3xl leading-tight font-bold;
	}

	:global(.cv-markdown h2) {
		@apply mt-8 mb-3 border-b-2 border-gray-200 pb-1.5 text-xl font-semibold text-gray-900;
	}

	:global(.cv-markdown h3) {
		@apply mt-6 mb-1.5 text-[1.05rem] font-semibold text-gray-800;
	}

	:global(.cv-markdown h4) {
		@apply mt-4 mb-1 text-[0.95rem] font-semibold text-gray-700;
	}

	:global(.cv-markdown p) {
		@apply my-1.5 text-[0.925rem] text-gray-700;
	}

	:global(.cv-markdown h1 + p) {
		@apply mb-3 text-sm text-gray-500;
	}

	:global(.cv-markdown ul) {
		@apply my-1 pl-5;
	}

	:global(.cv-markdown li) {
		@apply my-0.5 text-sm text-gray-700;
	}

	:global(.cv-markdown hr) {
		@apply my-7 border-t border-gray-100;
	}

	/* hr → section 분할 후 섹션 간 시각적 구분 (화면용) */
	:global(.cv-markdown .cv-section + .cv-section) {
		@apply mt-7 border-t border-gray-100 pt-7;
	}

	:global(.cv-markdown blockquote) {
		@apply my-1 border-l-3 border-gray-300 py-1 pl-3 text-sm text-gray-500;
	}

	:global(.cv-markdown strong) {
		@apply font-semibold text-gray-900;
	}

	:global(.cv-markdown a) {
		@apply text-blue-600 no-underline hover:underline;
	}

	:global(.cv-markdown code) {
		@apply rounded bg-gray-100 px-1.5 py-0.5 text-sm;
	}

	/* resume-page가 있으면 cv-root 패딩/최대폭 제거 (화면+프린트 공통) */
	.cv-root:has(:global(.resume-page)) {
		max-width: none;
		padding: 0;
		margin: 0;
		background: #f0f1f3;
	}

	/* 프린트 스타일은 cv.css (글로벌)로 이동 — @page는 scoped에서 무시됨 */
</style>
