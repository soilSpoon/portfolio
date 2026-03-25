<script lang="ts">
	import { marked } from 'marked';
	import type { FilteredData, ThemeConfig } from '$lib/data/cv-schema.js';

	let { data, theme }: { data: FilteredData; theme: ThemeConfig } = $props();
</script>

<article
	class="career-layout"
	style:--accent={theme.accent}
	style:--link-color={theme.link_color}
	style:--font-family={theme.font_family}
	style:--heading-border-width={theme.heading_border_width}
>
	<header class="career-header">
		<h1>{data.title}</h1>
		{#if data.subtitle}
			<p class="career-subtitle">{data.subtitle}</p>
		{/if}
		<p class="career-intro">
			프로젝트별로 직면한 기술적 문제와 해결 과정을 정리한 문서입니다.
		</p>
	</header>

	{#each data.sections as section}
		{#if section.type === 'projects'}
			{#each section.data as project, i}
				<section class="career-project">
					<h2>{i + 1}. {project.title}</h2>
					<div class="project-meta">
						<strong>기간</strong>: {project.dates}<br />
						<strong>소속</strong>: {project.org}{#if project.role}
							| {project.role}{/if}
						{#if project.tech && Array.isArray(project.tech) && project.tech.length > 0}
							<br /><strong>기술</strong>: {project.tech.join(', ')}
						{/if}
					</div>

					{#each project.details ?? [] as detail}
						<div class="career-detail">
							<h3>{detail.title}</h3>
							<div class="career-markdown">
								<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted YAML content rendered at build time -->
								{@html marked(detail.content, { breaks: true })}
							</div>
						</div>
					{/each}
				</section>
			{/each}
		{/if}
	{/each}
</article>

<style>
	@reference "tailwindcss";

	/* ── Layout ── */
	.career-layout {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 2rem;
		font-family: var(--font-family, 'Toss Product Sans', sans-serif);
		font-size: 1rem;
		line-height: 1.45;
		color: #191f28;
	}

	/* ── Header ── */
	.career-header {
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: var(--heading-border-width, 2px) solid var(--accent, #3182f6);
	}

	.career-header h1 {
		margin: 0 0 0.25rem;
		font-size: 2.125rem;
		font-weight: 800;
		line-height: 1.2;
		color: #191f28;
		letter-spacing: -0.02em;
	}

	.career-subtitle {
		margin: 0 0 0.5rem;
		font-size: 0.9rem;
		color: #6b7280;
	}

	.career-intro {
		margin: 0;
		font-size: 0.9rem;
		color: #6b7280;
	}

	/* ── Project sections ── */
	.career-project {
		padding-top: 1.25rem;
		padding-bottom: 1.25rem;
		border-top: 1px solid #c9ccd1;
	}

	.career-project:first-of-type {
		border-top: none;
	}

	.career-project h2 {
		margin: 0 0 0.5rem;
		font-size: 1.375rem;
		font-weight: 700;
		color: #191f28;
		padding-bottom: 0.3rem;
		border-bottom: var(--heading-border-width, 2px) solid var(--accent, #3182f6);
	}

	/* ── Project meta ── */
	.project-meta {
		margin-bottom: 1rem;
		padding: 0.5rem 0.75rem;
		background: #f9fafb;
		border-radius: 0.375rem;
		font-size: 0.8125rem;
		line-height: 1.5;
		color: #374151;
	}

	.project-meta :global(strong) {
		color: #191f28;
		font-weight: 600;
	}

	/* ── Detail block ── */
	.career-detail {
		margin-top: 1.125rem;
	}

	.career-detail h3 {
		margin: 0 0 0.3rem;
		font-size: 1.0625rem;
		font-weight: 700;
		color: #333d4b;
	}

	/* ── Markdown rendered content ── */
	:global(.career-markdown h4) {
		margin-top: 0.75rem;
		margin-bottom: 0.2rem;
		font-size: 0.9375rem;
		font-weight: 700;
		color: #333d4b;
	}

	:global(.career-markdown p) {
		margin: 0.25rem 0;
		font-size: 0.9rem;
		color: #191f28;
	}

	:global(.career-markdown ul) {
		margin: 0.2rem 0;
		padding-left: 1rem;
	}

	:global(.career-markdown ol) {
		margin: 0.2rem 0;
		padding-left: 1rem;
	}

	:global(.career-markdown li) {
		margin: 0.1rem 0;
		font-size: 0.875rem;
		color: #191f28;
	}

	:global(.career-markdown strong) {
		font-weight: 600;
		color: #191f28;
	}

	:global(.career-markdown a) {
		color: var(--link-color, var(--accent, #3182f6));
		text-decoration: none;
	}

	:global(.career-markdown a:hover) {
		text-decoration: underline;
	}

	:global(.career-markdown code) {
		padding: 0.125rem 0.375rem;
		font-size: 0.8125rem;
		background: #f3f4f6;
		border-radius: 0.25rem;
	}

	:global(.career-markdown blockquote) {
		margin: 0.2rem 0;
		padding: 0.2rem 0 0.2rem 0.625rem;
		border-left: 3px solid #c9ccd1;
		font-size: 0.875rem;
		color: #6b7280;
	}

	:global(.career-markdown hr) {
		margin: 1.25rem 0;
		border: none;
		border-top: 1px solid #c9ccd1;
	}

	/* ── Print styles ── */
	@media print {
		.career-layout {
			max-width: none;
			padding: 0;
			margin: 0;
			font-size: 9.5pt;
			line-height: 1.35;
			color: #000;
		}

		.career-header {
			margin-bottom: 8pt;
			padding-bottom: 6pt;
		}

		.career-header h1 {
			font-size: 17pt;
			font-weight: 800;
			margin-bottom: 3pt;
		}

		.career-subtitle,
		.career-intro {
			font-size: 8.5pt;
		}

		.career-project {
			padding-top: 8pt;
			padding-bottom: 8pt;
		}

		.career-project + .career-project {
			break-before: page;
			border-top: none;
			padding-top: 0;
		}

		.career-project h2 {
			font-size: 12pt;
			break-after: avoid;
			margin-top: 0;
			margin-bottom: 3pt;
			padding-bottom: 2pt;
		}

		.career-detail {
			margin-top: 6pt;
		}

		.career-detail h3 {
			font-size: 10pt;
			break-after: avoid;
			margin-bottom: 2pt;
		}

		.project-meta {
			font-size: 8.5pt;
			line-height: 1.4;
			margin-bottom: 6pt;
			padding: 4pt 6pt;
			break-after: avoid;
		}

		.detail-tags {
			margin-bottom: 3pt;
		}

		:global(.career-markdown h4) {
			font-size: 9.5pt;
			break-after: avoid;
			margin-top: 4pt;
			margin-bottom: 1pt;
		}

		:global(.career-markdown p) {
			font-size: 9pt;
			margin: 1.5pt 0;
			orphans: 3;
			widows: 3;
		}

		:global(.career-markdown li) {
			font-size: 9pt;
			margin: 0.5pt 0;
		}

		:global(.career-markdown ul),
		:global(.career-markdown ol) {
			margin: 1pt 0;
			padding-left: 12pt;
			break-inside: avoid;
		}

		:global(.career-markdown h4 + p),
		:global(.career-markdown h4 + ul) {
			break-before: avoid;
		}

		:global(.career-markdown blockquote) {
			margin: 1pt 0;
			padding: 1pt 0 1pt 6pt;
			font-size: 8.5pt;
		}

		:global(.career-markdown hr) {
			margin: 8pt 0;
		}

		:global(.career-markdown a) {
			color: #111;
			text-decoration: none;
		}

	}
</style>
