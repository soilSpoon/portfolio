export const CV_ENTRIES = [
	{
		slug: 'resume',
		file: '이력서.md',
		file_en: 'resume_en.md',
		titleKey: 'cv_resume_title',
		subtitleKey: 'cv_resume_subtitle'
	},
	{
		slug: 'resume-instructor',
		file: '이력서_강사.md',
		file_en: 'resume-instructor_en.md',
		titleKey: 'cv_resume_instructor_title',
		subtitleKey: 'cv_resume_instructor_subtitle'
	},
	{
		slug: 'resume-freelancer',
		file: '이력서_프리랜서.md',
		file_en: 'resume-freelancer_en.md',
		titleKey: 'cv_resume_freelancer_title',
		subtitleKey: 'cv_resume_freelancer_subtitle'
	},
	{
		slug: 'career',
		file: '경력기술서.md',
		file_en: 'career_en.md',
		titleKey: 'cv_career_title',
		subtitleKey: 'cv_career_subtitle'
	},
	{
		slug: 'resume-toss',
		file: '이력서.md',
		file_en: 'resume_en.md',
		titleKey: 'cv_resume_toss_title',
		subtitleKey: 'cv_resume_toss_subtitle'
	},
	{
		slug: 'career-toss',
		file: '경력기술서_toss.md',
		file_en: '경력기술서_toss.md',
		titleKey: 'cv_career_toss_title',
		subtitleKey: 'cv_career_toss_subtitle'
	}
] as const;

export type CvEntry = (typeof CV_ENTRIES)[number];

export function getCvEntry(slug: string): CvEntry | undefined {
	return CV_ENTRIES.find((e) => e.slug === slug);
}

export function getCvFile(entry: CvEntry, locale: string): string {
	return locale === 'en' ? entry.file_en : entry.file;
}
