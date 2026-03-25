import { z } from 'zod';

// ── Sub-schemas ──────────────────────────────────────────────

const BasicsSchema = z.object({
	name: z.string(),
	title: z.string(),
	phone: z.string(),
	email: z.string(),
	github: z.string(),
	linkedin: z.string()
});

const BulletSchema = z.object({
	text: z.string(),
	tags: z.array(z.string())
});

const DetailSchema = z.object({
	title: z.string(),
	tags: z.array(z.string()),
	content: z.string()
});

const ExperienceSchema = z.object({
	company: z.string(),
	role: z.string(),
	dates: z.string(),
	duration: z.string().optional(),
	tags: z.array(z.string())
});

const ProjectSchema = z.object({
	slug: z.string(),
	title: z.string(),
	dates: z.string(),
	org: z.string(),
	role: z.string().optional(),
	url: z.string().optional(),
	tags: z.array(z.string()),
	tech: z.union([z.array(z.string()), z.record(z.string(), z.array(z.string()))]).optional(),
	bullets: z.array(BulletSchema).optional(),
	details: z.array(DetailSchema).optional()
});

const SkillCategorySchema = z.object({
	label: z.string(),
	items: z.array(z.string()),
	tags: z.array(z.string())
});

const EducationSchema = z.object({
	name: z.string(),
	field: z.string(),
	dates: z.string(),
	tags: z.array(z.string())
});

const CertificationSchema = z.object({
	name: z.string(),
	date: z.string(),
	tags: z.array(z.string())
});

const OtherItemSchema = z.object({
	text: z.string(),
	tags: z.array(z.string())
});

const OssSchema = z.object({
	summary: z.string(),
	highlights: z.array(BulletSchema)
});

const SideProjectSchema = z.object({
	title: z.string(),
	dates: z.string(),
	url: z.string().optional(),
	tags: z.array(z.string()),
	bullets: z.array(BulletSchema)
});

const TeachingSchema = z.object({
	capabilities: z.array(z.string())
});

const ServiceCategorySchema = z.object({
	category: z.string(),
	items: z.array(z.string())
});

// ── Master schema ────────────────────────────────────────────

export const MasterSchema = z.object({
	basics: BasicsSchema,
	summaries: z.record(z.string(), z.string()),
	highlight_bullets: z.record(z.string(), z.array(z.string())).optional(),
	experience: z.array(ExperienceSchema),
	projects: z.array(ProjectSchema),
	skills: z.array(SkillCategorySchema),
	education: z.array(EducationSchema),
	certifications: z.array(CertificationSchema),
	other: z.array(OtherItemSchema),
	oss: OssSchema,
	sideProjects: z.array(SideProjectSchema).optional(),
	teaching: TeachingSchema.optional(),
	services: z.array(ServiceCategorySchema).optional(),
	workTerms: z.array(z.string()).optional()
});

// ── Section config ───────────────────────────────────────────

const SectionConfigSchema = z.object({
	type: z.string(),
	filter: z.array(z.string()).optional(),
	max: z.number().optional(),
	style: z.string().optional()
});

// ── Variant schema ───────────────────────────────────────────

export const VariantSchema = z.object({
	variant: z.string(),
	title: z.string(),
	subtitle: z.string().optional(),
	summary: z.string(),
	highlight_bullets: z.string().optional(),
	theme: z.string(),
	modes: z.array(z.enum(['resume', 'career'])).default(['resume', 'career']),
	summary_text: z.string().optional(),
	highlight_bullets_text: z.array(z.string()).optional(),
	sections: z.array(SectionConfigSchema)
});

// ── Theme schema ─────────────────────────────────────────────

export const ThemeSchema = z.object({
	accent: z.string(),
	accent_opacity: z.string().optional(),
	sidebar_bg: z.string(),
	sidebar_border: z.string(),
	link_color: z.string(),
	font_family: z.string(),
	main_padding: z.string(),
	main_gap: z.string(),
	sidebar_padding: z.string(),
	sidebar_gap: z.string(),
	badge_gap: z.string(),
	badge_px: z.string(),
	badge_py: z.string(),
	heading_border_width: z.string()
});

// ── Inferred types ───────────────────────────────────────────

export type MasterData = z.infer<typeof MasterSchema>;
export type VariantConfig = z.infer<typeof VariantSchema>;
export type ThemeConfig = z.infer<typeof ThemeSchema>;

export type Experience = z.infer<typeof ExperienceSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Bullet = z.infer<typeof BulletSchema>;
export type Detail = z.infer<typeof DetailSchema>;
export type SectionConfig = z.infer<typeof SectionConfigSchema>;
export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type OtherItem = z.infer<typeof OtherItemSchema>;
export type SideProject = z.infer<typeof SideProjectSchema>;
export type ServiceCategory = z.infer<typeof ServiceCategorySchema>;

export type ResolvedSideProject = Omit<SideProject, 'bullets'> & { bullets: string[] };

// ── Resolved section (discriminated union) ───────────────────

export type ResolvedSection =
	| { type: 'experience'; style?: string; data: Experience[] }
	| { type: 'projects'; style?: string; data: Project[] }
	| {
			type: 'oss';
			style?: string;
			data: { summary: string; highlights: { text: string; tags: string[] }[] };
	  }
	| { type: 'sideProjects'; style?: string; data: ResolvedSideProject[] }
	| { type: 'skills'; style?: string; data: SkillCategory[] }
	| { type: 'teaching_capabilities'; style?: string; data: string[] }
	| { type: 'teaching_experience'; style?: string; data: Experience[] }
	| { type: 'services'; style?: string; data: ServiceCategory[] }
	| { type: 'workTerms'; style?: string; data: string[] };

// ── Sidebar data ─────────────────────────────────────────────

export type SidebarData = {
	skills: SkillCategory[];
	education: Education[];
	certifications: Certification[];
	other: OtherItem[];
};

// ── Filtered data (fully resolved for rendering) ─────────────

export type FilteredData = {
	basics: MasterData['basics'];
	summary: string;
	highlightBullets: string[];
	sidebar: SidebarData;
	sections: ResolvedSection[];
	mode: 'resume' | 'career';
	title: string;
	subtitle?: string;
	slug: string;
};
