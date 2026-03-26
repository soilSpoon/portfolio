<script lang="ts">
	import { marked } from 'marked';
	import type { FilteredData, ThemeConfig } from '$lib/data/cv-schema.js';

	let { data, theme }: { data: FilteredData; theme: ThemeConfig } = $props();

	const allIssues = $derived(
		data.sections
			.filter((s): s is Extract<typeof s, { type: 'projects' }> => s.type === 'projects')
			.flatMap((s) =>
				s.data.flatMap((project) => (project.details ?? []).map((detail) => ({ detail, project })))
			)
			.sort((a, b) => (a.detail.career_order ?? 99) - (b.detail.career_order ?? 99))
	);
</script>

<article
	class="mx-auto max-w-3xl px-8 py-8 text-base leading-normal text-black
		print:m-0 print:max-w-none print:p-0 print:text-[9.5pt] print:leading-snug print:text-black
		print:[-webkit-print-color-adjust:exact] print:[print-color-adjust:exact]"
	style:--accent={theme.accent}
	style:--heading-border-width={theme.heading_border_width}
	style="font-family: var(--font-family, 'Toss Product Sans', sans-serif)"
>
	<header class="mb-3 border-b-2 border-blue-500 pb-3 print:mb-2 print:pb-1.5">
		<h1
			class="mb-1 text-4xl leading-tight font-extrabold tracking-tight text-gray-900 print:text-[17pt]"
		>
			{data.basics.name}
			<span class="font-normal text-gray-400 print:text-gray-500">|</span>
			{data.title}
		</h1>
	</header>

	{#each allIssues as { detail }, i (i)}
		<section class="cv-section border-t border-gray-500 py-3 first-of-type:border-t-0 print:py-2">
			<h2
				class="mb-2 border-b-2 border-blue-600 pb-1 text-2xl font-bold text-blue-600
					print:mb-1 print:[break-after:avoid] print:pb-0.5 print:text-[12pt]"
			>
				{i + 1}. {detail.title}
			</h2>
			<div class="career-prose">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -- 빌드타임 YAML 마크다운, @html이 유일한 수단 -->
				{@html marked(detail.content, { breaks: true })}
			</div>
		</section>
	{/each}
</article>

<style>
  :global(.career-prose h4) {
    margin-top: 1em;
    margin-bottom: 0.3em;
    font-size: 1.05em;
    font-weight: 700;
    color: #1e3a5f;
  }

  :global(.career-prose ul) {
    margin: 0.3em 0;
    padding-left: 1.3em;
  }

  :global(.career-prose li) {
    margin-bottom: 0.15em;
    line-height: 1.5;
  }

  :global(.career-prose p) {
    margin: 0.3em 0;
    line-height: 1.6;
  }

  :global(.career-prose a) {
    color: var(--accent);
    text-decoration: underline;
    text-decoration-color: color-mix(in srgb, var(--accent) 30%, transparent);
  }
</style>
