export type GridItem =
	| { type: 'stat'; label: string; value: string }
	| { type: 'tech'; label: string };

export const gridItems: GridItem[] = [
	{ type: 'stat', label: 'years', value: '7+' },
	{ type: 'tech', label: 'React' },
	{ type: 'stat', label: 'commits', value: '865' },
	{ type: 'tech', label: 'TypeScript' },
	{ type: 'tech', label: 'Next.js' },
	{ type: 'stat', label: 'PRs merged', value: '54' },
	{ type: 'tech', label: 'C++' },
	{ type: 'stat', label: 'OSS projects', value: '23' },
	{ type: 'tech', label: 'WASM' },
	{ type: 'tech', label: 'Rust' },
	{ type: 'stat', label: 'components', value: '53' },
	{ type: 'tech', label: 'Nest.js' },
	{ type: 'tech', label: 'Laravel' },
	{ type: 'stat', label: 'cost', value: '$0' },
	{ type: 'tech', label: 'Jotai' },
	{ type: 'tech', label: 'Tailwind' },
	{ type: 'tech', label: 'GSAP' },
	{ type: 'stat', label: 'PRs in mix', value: '12' },
	{ type: 'tech', label: 'Docker' },
	{ type: 'tech', label: 'PostgreSQL' },
	{ type: 'tech', label: 'Redis' },
	{ type: 'stat', label: 'products', value: '3' },
	{ type: 'tech', label: 'Svelte' },
	{ type: 'tech', label: 'Three.js' }
];
