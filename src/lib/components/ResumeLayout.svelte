<script lang="ts">
	import type { FilteredData, ThemeConfig } from '$lib/data/cv-schema.js';

	let { data, theme }: { data: FilteredData; theme: ThemeConfig } = $props();

	const SECTION_HEADINGS: Record<string, string> = {
		experience: '경력',
		projects: '프로젝트',
		oss: '오픈소스 기여',
		sideProjects: '사이드 프로젝트',
		skills: '기술 스택',
		teaching_capabilities: '강의 역량',
		teaching_experience: '강의 경력',
		services: '제공 가능 서비스',
		workTerms: '근무 조건'
	};

	function sectionHeading(type: string): string {
		return SECTION_HEADINGS[type] ?? type;
	}
</script>

<div
	class="resume-page mx-auto grid h-[297mm] w-[210mm] grid-cols-[72mm_minmax(0,1fr)] bg-white text-[10px] leading-[1.5] text-[#333D4B] shadow-[0_12px_40px_rgba(15,23,42,0.12)]"
	style="
		--accent: {theme.accent};
		--accent-opacity: {theme.accent_opacity ?? '1'};
		--sidebar-bg: {theme.sidebar_bg};
		--sidebar-border: {theme.sidebar_border};
		--link-color: {theme.link_color};
		--font-family: {theme.font_family};
		--main-padding: {theme.main_padding};
		--main-gap: {theme.main_gap};
		--sidebar-padding: {theme.sidebar_padding};
		--sidebar-gap: {theme.sidebar_gap};
		--badge-gap: {theme.badge_gap};
		--badge-px: {theme.badge_px};
		--badge-py: {theme.badge_py};
		--heading-border-width: {theme.heading_border_width};
	"
>
	<!-- ─── Sidebar ─── -->
	<aside class="sidebar flex h-full min-h-0 flex-col">
		<!-- Name + Title -->
		<div class="border-b border-white/10 pb-[12px]">
			<div class="text-center text-[24px] font-bold tracking-[0.5px] text-white">
				{data.basics.name}
			</div>
			<div class="mt-[4px] text-center text-[11px] text-[#8B95A1]">
				{data.basics.title}
			</div>
		</div>

		<!-- Contact -->
		<div>
			<div class="sidebar-heading">Contact</div>
			<div class="flex flex-col gap-[5px] text-[9.5px] text-[#B0B8C1]">
				<div class="flex min-w-0 items-center gap-[6px]">
					<svg class="h-[12px] w-[12px] shrink-0 fill-[#6B7684]" viewBox="0 0 24 24"
						><path
							d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.21 2.2z"
						/></svg
					>
					<span class="min-w-0">{data.basics.phone}</span>
				</div>
				<div class="flex min-w-0 items-center gap-[6px]">
					<svg class="h-[12px] w-[12px] shrink-0 fill-[#6B7684]" viewBox="0 0 24 24"
						><path
							d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
						/></svg
					>
					<span class="min-w-0 break-all">{data.basics.email}</span>
				</div>
				<a
					class="sidebar-link flex min-w-0 items-center gap-[6px] font-bold underline underline-offset-[2px]"
					href="https://github.com/{data.basics.github}"
				>
					<svg class="h-[12px] w-[12px] shrink-0 fill-[#6B7684]" viewBox="0 0 24 24"
						><path
							d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.806 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23A11.51 11.51 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 21.795 24 17.298 24 12c0-6.63-5.37-12-12-12z"
						/></svg
					>
					<span class="min-w-0 break-all">{data.basics.github}</span>
				</a>
				<a
					class="sidebar-link flex min-w-0 items-center gap-[6px] font-bold underline underline-offset-[2px]"
					href="https://www.linkedin.com/in/{data.basics.linkedin}"
				>
					<svg class="h-[12px] w-[12px] shrink-0 fill-[#6B7684]" viewBox="0 0 24 24"
						><path
							d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
						/></svg
					>
					<span class="min-w-0 break-all">{data.basics.linkedin}</span>
				</a>
			</div>
		</div>

		<!-- Skills -->
		{#if data.sidebar.skills.length > 0}
			<div>
				<div class="sidebar-heading">Skills</div>
				{#each data.sidebar.skills as cat}
					<div class="mb-[6px]">
						<div class="mb-[3px] text-[8px] font-bold tracking-[0.5px] text-[#6B7684] uppercase">
							{cat.label}
						</div>
						<div class="badge-wrap flex flex-wrap">
							{#each cat.items as item}
								<span class="badge rounded-full bg-[#2B3240] text-[7.8px] font-medium text-[#DDE3EA]"
									>{item}</span
								>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Education -->
		{#if data.sidebar.education.length > 0}
			<div>
				<div class="sidebar-heading">Education</div>
				{#each data.sidebar.education as edu, i}
					<div class={i < data.sidebar.education.length - 2 ? 'mb-[6px]' : (i === data.sidebar.education.length - 2 ? 'mb-[4px]' : '')}>
						<div class="text-[9.5px] font-bold text-[#D1D6DB]">{edu.name}</div>
						<div class="text-[8.5px] text-[#8B95A1]">{edu.field} | {edu.dates}</div>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Certifications -->
		{#if data.sidebar.certifications.length > 0}
			<div>
				<div class="sidebar-heading">Certifications</div>
				<div class="flex flex-col gap-[3px] text-[9.5px] text-[#B0B8C1]">
					{#each data.sidebar.certifications as cert}
						<span>{cert.name} <span class="text-[#6B7684]">{cert.date}</span></span>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Other -->
		{#if data.sidebar.other.length > 0}
			<div>
				<div class="sidebar-heading">Other</div>
				<div class="text-[9px] leading-[1.6] text-[#8B95A1]">
					{#each data.sidebar.other as item, i}{#if i > 0}<br />{/if}{item.text}{/each}
				</div>
			</div>
		{/if}
	</aside>

	<!-- ─── Main ─── -->
	<main class="main-content flex min-w-0 flex-col">
		<!-- Profile: summary + highlights -->
		<div class="min-w-0 border-b border-[#E5E8EB] pb-[8px] break-keep">
			<p class="m-0 mb-[9px] text-[11px] leading-[1.65] text-[#4E5968]">
				{@html data.summary}
			</p>
			{#if data.highlightBullets.length > 0}
				<ul class="bullet-list">
					{#each data.highlightBullets as bullet}
						<li>{bullet}</li>
					{/each}
				</ul>
			{/if}
		</div>

		<!-- Sections -->
		<div class="main-grid grid flex-1 auto-rows-max content-between">
			{#each data.sections as section}
				{#if section.type === 'experience'}
					<section class="min-w-0 space-y-[5px]">
						<h2 class="section-heading">{sectionHeading(section.type)}</h2>
						{#each section.data as exp}
							<div class="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-[8px]">
								<span class="min-w-0 text-[11.5px] font-bold text-[#333D4B]"
									>{exp.company} — <span class="font-normal text-[#6B7684]">{exp.role}</span></span
								>
								<span class="shrink-0 pl-[8px] text-right text-[9px] text-[#8B95A1]">{exp.dates}{#if exp.duration} ({exp.duration}){/if}</span>
							</div>
						{/each}
					</section>

				{:else if section.type === 'projects'}
					<section class="min-w-0 space-y-[8px]">
						<h2 class="section-heading">{sectionHeading(section.type)}</h2>
						<div class="flex flex-col gap-[12px]">
							{#each section.data as project}
								<article class="space-y-[3px]">
									<div class="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-[8px]">
										<span class="min-w-0 text-[12px] font-bold text-[#333D4B]"
											>{project.title}</span
										>
										<span class="shrink-0 pl-[8px] text-right text-[9px] text-[#8B95A1]"
											>{project.dates}</span
										>
									</div>
									<div class="text-[9px] text-[#8B95A1] [overflow-wrap:anywhere]">
										{project.org}{#if project.role} · {project.role}{/if}{#if project.url} · <a
												href={project.url}
												class="project-link"
												>{project.url.replace(/^https?:\/\//, '')}</a
											>{/if}
									</div>
									{#if project.bullets && project.bullets.length > 0}
										<ul class="bullet-list">
											{#each project.bullets as bullet}
												<li>{bullet.text}</li>
											{/each}
										</ul>
									{/if}
									{#if data.mode === 'career' && project.details && project.details.length > 0}
										{#each project.details as detail}
											<div class="mt-[4px]">
												<div class="text-[10px] font-bold text-[#333D4B]">{detail.title}</div>
												<div class="text-[9px] leading-[1.6] text-[#4E5968] [overflow-wrap:anywhere]">
													{@html detail.content}
												</div>
											</div>
										{/each}
									{/if}
									{#if project.tech && Array.isArray(project.tech) && project.tech.length > 0}
										<div class="text-[8px] text-[#8B95A1] [overflow-wrap:anywhere]">
											{project.tech.join(' · ')}
										</div>
									{/if}
								</article>
							{/each}
						</div>
					</section>

				{:else if section.type === 'oss'}
					<section class="min-w-0 space-y-[5px]">
						<h2 class="section-heading">{sectionHeading(section.type)}</h2>
						<ul class="bullet-list">
							{#each section.data.highlights as highlight}
								<li>{highlight.text}</li>
							{/each}
						</ul>
					</section>

				{:else if section.type === 'sideProjects'}
					<section class="min-w-0 space-y-[5px]">
						<h2 class="section-heading">{sectionHeading(section.type)}</h2>
						{#each section.data as sp}
							<div class="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-[8px]">
								<span class="min-w-0 text-[11.5px] font-bold text-[#333D4B]">{sp.title}</span>
								<span class="shrink-0 pl-[8px] text-right text-[9px] text-[#8B95A1]">{sp.dates}</span>
							</div>
							{#if sp.url}
								<div class="text-[9px] text-[#8B95A1] [overflow-wrap:anywhere]">
									<a href={sp.url} class="project-link"
										>{sp.url.replace(/^https?:\/\//, '')}</a
									>
								</div>
							{/if}
							{#if sp.bullets.length > 0}
								<ul class="bullet-list">
									{#each sp.bullets as bullet}
										<li>{bullet}</li>
									{/each}
								</ul>
							{/if}
						{/each}
					</section>

				{:else if section.type === 'skills'}
					<section class="min-w-0 space-y-[5px]">
						<h2 class="section-heading">{sectionHeading(section.type)}</h2>
						{#each section.data as cat}
							<div class="mb-[4px]">
								<div class="text-[9px] font-bold text-[#333D4B]">{cat.label}</div>
								<div class="text-[9px] text-[#4E5968]">{cat.items.join(', ')}</div>
							</div>
						{/each}
					</section>

				{:else if section.type === 'teaching_capabilities'}
					<section class="min-w-0 space-y-[5px]">
						<h2 class="section-heading">{sectionHeading(section.type)}</h2>
						<ul class="bullet-list">
							{#each section.data as cap}
								<li>{cap}</li>
							{/each}
						</ul>
					</section>

				{:else if section.type === 'teaching_experience'}
					<section class="min-w-0 space-y-[5px]">
						<h2 class="section-heading">{sectionHeading(section.type)}</h2>
						{#each section.data as exp}
							<div class="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-[8px]">
								<span class="min-w-0 text-[11.5px] font-bold text-[#333D4B]"
									>{exp.company} — <span class="font-normal text-[#6B7684]">{exp.role}</span></span
								>
								<span class="shrink-0 pl-[8px] text-right text-[9px] text-[#8B95A1]">{exp.dates}{#if exp.duration} ({exp.duration}){/if}</span>
							</div>
						{/each}
					</section>

				{:else if section.type === 'services'}
					<section class="min-w-0 space-y-[5px]">
						<h2 class="section-heading">{sectionHeading(section.type)}</h2>
						{#each section.data as cat}
							<div class="mb-[4px]">
								<div class="text-[9px] font-bold text-[#333D4B]">{cat.category}</div>
								<ul class="bullet-list">
									{#each cat.items as item}
										<li>{item}</li>
									{/each}
								</ul>
							</div>
						{/each}
					</section>

				{:else if section.type === 'workTerms'}
					<section class="min-w-0 space-y-[5px]">
						<h2 class="section-heading">{sectionHeading(section.type)}</h2>
						<ul class="bullet-list">
							{#each section.data as term}
								<li>{term}</li>
							{/each}
						</ul>
					</section>
				{/if}
			{/each}
		</div>
	</main>
</div>

<style>
	@reference "tailwindcss";

	.resume-page {
		font-family: var(--font-family);
		box-sizing: border-box;
	}

	/* ─── Sidebar ─── */

	.sidebar {
		background: var(--sidebar-bg);
		padding: var(--sidebar-padding);
		gap: var(--sidebar-gap);
	}

	.sidebar-heading {
		margin-bottom: 6px;
		border-bottom: 1px solid var(--sidebar-border);
		padding-bottom: 4px;
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 1.2px;
		text-transform: uppercase;
		color: var(--accent);
	}

	/* ─── Sidebar badges ─── */

	.badge-wrap {
		gap: var(--badge-gap);
	}

	.badge {
		padding: var(--badge-py) var(--badge-px);
	}

	/* ─── Sidebar links ─── */

	.sidebar-link,
	.sidebar-link:visited,
	.sidebar-link:link {
		color: #e8e8e8;
		text-decoration-color: rgba(232, 232, 232, 0.4);
	}

	/* ─── Main ─── */

	.main-content {
		padding: var(--main-padding);
		gap: var(--main-gap);
	}

	.main-grid {
		gap: var(--main-gap);
	}

	/* ─── Section headings ─── */

	.section-heading {
		margin: 0 0 6px;
		border-bottom-style: solid;
		border-bottom-width: var(--heading-border-width);
		border-bottom-color: color-mix(in srgb, var(--accent) calc(var(--accent-opacity) * 100%), transparent);
		padding-bottom: 4px;
		font-size: 14px;
		font-weight: 700;
		letter-spacing: 0.3px;
		color: #333d4b;
	}

	/* ─── Bullet list ─── */

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

	/* ─── Project / OSS links ─── */

	.project-link,
	.project-link:visited,
	.project-link:link {
		color: var(--link-color);
		text-decoration: underline;
		text-decoration-color: color-mix(in srgb, var(--link-color) 30%, transparent);
	}

	:global(.resume-page .oss-link),
	:global(.resume-page .oss-link:visited),
	:global(.resume-page .oss-link:link) {
		color: #333d4b;
		font-weight: 700;
		text-decoration: underline;
		text-decoration-color: rgba(51, 61, 75, 0.3);
		text-underline-offset: 2px;
	}

	/* ─── Print ─── */

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
