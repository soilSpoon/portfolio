export const CV_ENTRIES = [
	{
		slug: 'resume',
		file: '이력서.md',
		title: '이력서',
		subtitle: '풀스택 개발자 이대희'
	},
	{
		slug: 'resume-instructor',
		file: '이력서_강사.md',
		title: '이력서 (강사)',
		subtitle: '웹 개발 강사 이대희'
	},
	{
		slug: 'resume-freelancer',
		file: '이력서_프리랜서.md',
		title: '이력서 (프리랜서)',
		subtitle: '풀스택 웹 개발자 이대희'
	},
	{
		slug: 'career',
		file: '경력기술서.md',
		title: '경력기술서',
		subtitle: '프로젝트별 기술적 문제 해결 과정'
	}
] as const;

export type CvEntry = (typeof CV_ENTRIES)[number];

export function getCvEntry(slug: string): CvEntry | undefined {
	return CV_ENTRIES.find((e) => e.slug === slug);
}
