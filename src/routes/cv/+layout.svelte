<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="cv-root">
	{@render children()}
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		background: #fff;
	}

	.cv-root {
		font-family:
			'Noto Sans KR',
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			sans-serif;
		font-size: 16px;
		line-height: 1.7;
		color: #1a1a1a;
		max-width: 800px;
		margin: 0 auto;
		padding: 3rem 2rem;
	}

	/* ── 마크다운 렌더링 스타일 ──────────────────────────── */
	:global(.cv-root h1) {
		font-size: 2rem;
		font-weight: 700;
		margin: 0 0 0.25rem;
		padding-bottom: 0;
		border-bottom: none;
		line-height: 1.3;
	}

	:global(.cv-root h2) {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 2rem 0 0.75rem;
		padding-bottom: 0.4rem;
		border-bottom: 2px solid #e5e5e5;
		color: #111;
	}

	:global(.cv-root h3) {
		font-size: 1.05rem;
		font-weight: 600;
		margin: 1.5rem 0 0.4rem;
		color: #222;
	}

	:global(.cv-root h4) {
		font-size: 0.95rem;
		font-weight: 600;
		margin: 1rem 0 0.3rem;
		color: #333;
	}

	:global(.cv-root p) {
		margin: 0.4rem 0;
		color: #333;
		font-size: 0.925rem;
	}

	:global(.cv-root h1 + p) {
		color: #555;
		font-size: 0.9rem;
		margin-bottom: 0.75rem;
	}

	:global(.cv-root ul) {
		margin: 0.3rem 0;
		padding-left: 1.25rem;
	}

	:global(.cv-root li) {
		margin: 0.2rem 0;
		font-size: 0.9rem;
		color: #333;
	}

	:global(.cv-root hr) {
		border: none;
		border-top: 1px solid #eee;
		margin: 1.75rem 0;
	}

	:global(.cv-root blockquote) {
		margin: 0.25rem 0 0.5rem;
		padding: 0.3rem 0 0.3rem 0.75rem;
		border-left: 3px solid #ddd;
		color: #555;
		font-size: 0.875rem;
	}

	:global(.cv-root strong) {
		font-weight: 600;
		color: #111;
	}

	:global(.cv-root a) {
		color: #2563eb;
		text-decoration: none;
	}

	:global(.cv-root a:hover) {
		text-decoration: underline;
	}

	:global(.cv-root code) {
		background: #f3f4f6;
		padding: 0.1rem 0.35rem;
		border-radius: 3px;
		font-size: 0.85rem;
	}

	/* ── 프린트 스타일 ──────────────────────────────────── */
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

		:global(.cv-root p) {
			font-size: 10pt;
		}

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
