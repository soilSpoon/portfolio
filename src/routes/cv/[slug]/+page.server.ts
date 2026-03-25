import { error } from '@sveltejs/kit';
import { loadCvData, allSlugs } from '$lib/data/cv-loader';

export function entries() {
	return allSlugs().map((slug) => ({ slug }));
}

export async function load({ params }) {
	try {
		const { data, theme } = loadCvData(params.slug);
		return { ...data, theme };
	} catch {
		error(404, 'CV not found');
	}
}
