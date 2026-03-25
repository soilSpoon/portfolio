import { error } from '@sveltejs/kit';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { marked } from 'marked';
import { CV_ENTRIES, getCvEntry } from '$lib/data/cv';

export function entries() {
	return CV_ENTRIES.map((e) => ({ slug: e.slug }));
}

export async function load({ params }) {
	const entry = getCvEntry(params.slug);
	if (!entry) error(404, '이력서를 찾을 수 없습니다');

	const filePath = resolve('cv', entry.file);
	const markdown = readFileSync(filePath, 'utf-8');
	const html = await marked(markdown);

	return {
		title: entry.title,
		subtitle: entry.subtitle,
		slug: entry.slug,
		html
	};
}
