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
							{#if detail.tags.length}
								<div class="detail-tags">
									{#each detail.tags as tag}
										<span class="detail-tag">{tag}</span>
									{/each}
								</div>
							{/if}
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
		padding: 3rem 2rem;
		font-family: var(--font-family, 'Toss Product Sans', sans-serif);
		font-size: 1rem;
		line-height: 1.625;
		color: #111827;
	}

	/* ── Header ── */
	.career-header {
		margin-bottom: 2.5rem;
		padding-bottom: 1.5rem;
		border-bottom: var(--heading-border-width, 2px) solid var(--accent, #3182f6);
	}

	.career-header h1 {
		margin: 0 0 0.25rem;
		font-size: 1.875rem;
		font-weight: 700;
		line-height: 1.2;
		color: #111827;
	}

	.career-subtitle {
		margin: 0 0 0.75rem;
		font-size: 0.925rem;
		color: #6b7280;
	}

	.career-intro {
		margin: 0;
		font-size: 0.925rem;
		color: #6b7280;
	}

	/* ── Project sections ── */
	.career-project {
		padding-top: 2rem;
		padding-bottom: 2rem;
		border-top: 1px solid #e5e7eb;
	}

	.career-project:first-of-type {
		border-top: none;
	}

	.career-project h2 {
		margin: 0 0 0.75rem;
		font-size: 1.3rem;
		font-weight: 700;
		color: #111827;
		padding-bottom: 0.375rem;
		border-bottom: var(--heading-border-width, 2px) solid var(--accent, #3182f6);
	}

	/* ── Project meta ── */
	.project-meta {
		margin-bottom: 1.5rem;
		padding: 0.75rem 1rem;
		background: #f9fafb;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		line-height: 1.7;
		color: #374151;
	}

	.project-meta :global(strong) {
		color: #111827;
		font-weight: 600;
	}

	/* ── Detail block ── */
	.career-detail {
		margin-top: 1.75rem;
	}

	.career-detail h3 {
		margin: 0 0 0.5rem;
		font-size: 1.05rem;
		font-weight: 600;
		color: #1f2937;
	}

	/* ── Detail tags ── */
	.detail-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
		margin-bottom: 0.75rem;
	}

	.detail-tag {
		display: inline-block;
		padding: 0.125rem 0.5rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--accent, #3182f6);
		background: color-mix(in srgb, var(--accent, #3182f6) 8%, transparent);
		border-radius: 9999px;
	}

	/* ── Markdown rendered content ── */
	:global(.career-markdown h4) {
		margin-top: 1rem;
		margin-bottom: 0.25rem;
		font-size: 0.95rem;
		font-weight: 600;
		color: #374151;
	}

	:global(.career-markdown p) {
		margin: 0.375rem 0;
		font-size: 0.925rem;
		color: #4b5563;
	}

	:global(.career-markdown ul) {
		margin: 0.25rem 0;
		padding-left: 1.25rem;
	}

	:global(.career-markdown ol) {
		margin: 0.25rem 0;
		padding-left: 1.25rem;
	}

	:global(.career-markdown li) {
		margin: 0.125rem 0;
		font-size: 0.875rem;
		color: #4b5563;
	}

	:global(.career-markdown strong) {
		font-weight: 600;
		color: #111827;
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
		font-size: 0.875rem;
		background: #f3f4f6;
		border-radius: 0.25rem;
	}

	:global(.career-markdown blockquote) {
		margin: 0.25rem 0;
		padding: 0.25rem 0 0.25rem 0.75rem;
		border-left: 3px solid #d1d5db;
		font-size: 0.875rem;
		color: #6b7280;
	}

	:global(.career-markdown hr) {
		margin: 1.75rem 0;
		border: none;
		border-top: 1px solid #e5e7eb;
	}

	/* ── Print styles ── */
	@media print {
		.career-layout {
			max-width: none;
			padding: 0;
			margin: 0;
			font-size: 10pt;
			line-height: 1.45;
		}

		.career-header {
			margin-bottom: 12pt;
			padding-bottom: 8pt;
		}

		.career-header h1 {
			font-size: 16pt;
			margin-bottom: 4pt;
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
			margin-bottom: 4pt;
		}

		.career-detail h3 {
			font-size: 10.5pt;
			break-after: avoid;
		}

		.project-meta {
			font-size: 9pt;
			break-after: avoid;
		}

		:global(.career-markdown h4) {
			font-size: 9.5pt;
			break-after: avoid;
			margin-top: 5pt;
			margin-bottom: 2pt;
		}

		:global(.career-markdown p) {
			font-size: 9.5pt;
			orphans: 3;
			widows: 3;
		}

		:global(.career-markdown li) {
			font-size: 9.5pt;
		}

		:global(.career-markdown ul),
		:global(.career-markdown ol) {
			break-inside: avoid;
		}

		:global(.career-markdown h4 + p),
		:global(.career-markdown h4 + ul) {
			break-before: avoid;
		}

		:global(.career-markdown a) {
			color: #111;
			text-decoration: none;
		}

		.detail-tag {
			border: 1px solid #d1d5db;
			background: transparent;
			color: #374151;
		}
	}
</style>
