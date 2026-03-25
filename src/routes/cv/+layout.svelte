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
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div
	class="cv-root mx-auto max-w-[800px] px-8 py-12 font-[Noto_Sans_KR,sans-serif] text-base leading-relaxed text-gray-900"
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

	:global(body) {
		margin: 0;
		padding: 0;
		background: #fff;
	}

	/* ── 마크다운 렌더링 스타일 (Tailwind @apply 불가 — :global 필요) ── */
	:global(.cv-root h1) {
		@apply mb-1 text-3xl leading-tight font-bold;
	}

	:global(.cv-root h2) {
		@apply mt-8 mb-3 border-b-2 border-gray-200 pb-1.5 text-xl font-semibold text-gray-900;
	}

	:global(.cv-root h3) {
		@apply mt-6 mb-1.5 text-[1.05rem] font-semibold text-gray-800;
	}

	:global(.cv-root h4) {
		@apply mt-4 mb-1 text-[0.95rem] font-semibold text-gray-700;
	}

	:global(.cv-root p) {
		@apply my-1.5 text-[0.925rem] text-gray-700;
	}

	:global(.cv-root h1 + p) {
		@apply mb-3 text-sm text-gray-500;
	}

	:global(.cv-root ul) {
		@apply my-1 pl-5;
	}

	:global(.cv-root li) {
		@apply my-0.5 text-sm text-gray-700;
	}

	:global(.cv-root hr) {
		@apply my-7 border-t border-gray-100;
	}

	:global(.cv-root blockquote) {
		@apply my-1 border-l-3 border-gray-300 py-1 pl-3 text-sm text-gray-500;
	}

	:global(.cv-root strong) {
		@apply font-semibold text-gray-900;
	}

	:global(.cv-root a) {
		@apply text-blue-600 no-underline hover:underline;
	}

	:global(.cv-root code) {
		@apply rounded bg-gray-100 px-1.5 py-0.5 text-sm;
	}

	/* ── 프린트 스타일 ── */
	@media print {
		.cv-root {
			max-width: none;
			padding: 0;
			font-size: 10.5pt;
			line-height: 1.5;
		}

		:global(.cv-root h1) {
			font-size: 18pt;
		}

		:global(.cv-root h2) {
			font-size: 13pt;
			page-break-after: avoid;
			margin-top: 14pt;
		}

		:global(.cv-root h3) {
			font-size: 11pt;
			page-break-after: avoid;
		}

		:global(.cv-root p),
		:global(.cv-root li) {
			font-size: 10pt;
		}

		:global(.cv-root ul, .cv-root ol) {
			page-break-inside: avoid;
		}

		:global(.cv-root hr) {
			margin: 10pt 0;
		}

		:global(.cv-root a) {
			color: #111;
			text-decoration: none;
		}

		:global(.no-print) {
			display: none !important;
		}
	}
</style>
