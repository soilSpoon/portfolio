export interface ExperienceDetail {
	label: string;
	value: string;
}

export interface Experience {
	num: string;
	company: string;
	role: string;
	dates: string;
	details: ExperienceDetail[];
}

export const experiences: Experience[] = [
	{
		num: '01',
		company: 'Everysim',
		role: '제품개발 책임',
		dates: '2025.03 – 현재',
		details: [
			{ label: 'OpenCASCADE WASM 브라우저 이식', value: 'C++' },
			{ label: 'AI 챗봇 시뮬레이션 제어', value: 'AI SDK' },
			{ label: '통합 디자인 시스템 + Storybook', value: 'Next.js' }
		]
	},
	{
		num: '02',
		company: 'CM Universe',
		role: '개발 주임 · 5년 3개월',
		dates: '2018.09 – 2023.11',
		details: [
			{ label: '865 commits · 526+ PRs', value: '1인 주도' },
			{ label: '디자인 시스템 53개 컴포넌트', value: 'React' },
			{ label: '수천 명 급여 정산 최적화', value: 'TypeScript' }
		]
	},
	{
		num: '03',
		company: 'Goorm',
		role: '프리랜서 강사',
		dates: '2024.08 – 현재',
		details: [{ label: '웹 프론트엔드 강의', value: '실무 중심' }]
	}
];
