export interface OSSProject {
	name: string;
	stars: string;
	prs: number;
}

export const ossProjects: OSSProject[] = [
	{ name: 'Astro', stars: '57k', prs: 1 },
	{ name: 'Laravel', stars: '34k', prs: 2 },
	{ name: 'Goose', stars: '33k', prs: 2 },
	{ name: 'SWC', stars: '33k', prs: 1 },
	{ name: 'Jotai', stars: '21k', prs: 1 },
	{ name: 'CLIProxyAPI', stars: '20k', prs: 5 },
	{ name: 'Snowpack', stars: '19k', prs: 1 },
	{ name: 'Tremor', stars: '16k', prs: 1 },
	{ name: 'Valtio', stars: '10k', prs: 2 },
	{ name: 'laravel-mix', stars: '5.2k', prs: 12 }
];
