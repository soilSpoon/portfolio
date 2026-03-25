import { listAllVariants } from '$lib/data/cv-loader';

export async function load() {
	return { entries: listAllVariants() };
}
