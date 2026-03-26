export interface Project {
	slug: string;
	name: string;
	tags: string[];
	description: string;
	gradient: string;
}

export const projects: Project[] = [
	{
		slug: 'everydrone',
		name: 'EveryDrone',
		tags: ['Next.js', 'C++/WASM', 'Nest.js', 'AI SDK'],
		description:
			'OpenCASCADE 3D CAD 엔진을 WASM으로 브라우저 이식. AI 챗봇으로 시뮬레이션 워크플로우 단순화.',
		gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
	},
	{
		slug: 'gwnote',
		name: '출근노트',
		tags: ['React', 'TypeScript', 'Jotai', 'Chakra UI'],
		description:
			'디자인 시스템 53개 컴포넌트. 3계층 상태관리. 수천 명 급여 정산 최적화. 4년간 1인 주도.',
		gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
	},
	{
		slug: 'superwalk',
		name: 'SuperWalk 바닥가',
		tags: ['Next.js', 'Drizzle ORM', 'Chart.js'],
		description: 'M2E 신발 가격 트래커. Vercel + Neon 서버리스로 인프라 비용 0원 운영.',
		gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
	},
	{
		slug: 'oss',
		name: 'Open Source',
		tags: ['Astro', 'SWC', 'Jotai', 'Goose'],
		description: '100+ stars 프로젝트 23개에 54 PR merged. laravel-mix 12 PR, Goose 기여.',
		gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
	}
];
