import { error } from '@sveltejs/kit';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { marked } from 'marked';
import { CV_ENTRIES, getCvEntry, getCvFile } from '$lib/data/cv';
import { getLocale } from '$lib/paraglide/runtime';

export function entries() {
	return CV_ENTRIES.map((e) => ({ slug: e.slug }));
}

export async function load({ params }) {
	const entry = getCvEntry(params.slug);
	if (!entry) error(404, 'CV not found');

	const locale = getLocale();
	const file = getCvFile(entry, locale);
	const filePath = resolve('cv', file);
	const markdown = readFileSync(filePath, 'utf-8');
	const rawHtml = await marked(markdown, { breaks: true });

	// hr 기준으로 섹션을 나눠 각 프로젝트를 <section>으로 감싸기 (PDF 페이지 넘김용)
	const sections = rawHtml.split('<hr>');
	const html = sections
		.map((s) => `<section class="cv-section">${s}</section>`)
		.join('\n');

	return {
		titleKey: entry.titleKey,
		subtitleKey: entry.subtitleKey,
		slug: entry.slug,
		html,
		locale
	};
}
