import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve } from 'path';
import { parse as parseYaml } from 'yaml';
import {
	MasterSchema,
	VariantSchema,
	ThemeSchema,
	formatDates,
	computeDuration,
	resolveVariantString,
	type MasterData,
	type VariantConfig,
	type ThemeConfig,
	type FilteredData,
	type ResolvedSection,
	type ResolvedSideProject,
	type SidebarData,
	type Project,
	type SectionConfig,
	type Bullet
} from './cv-schema.js';

// ── Paths ─────────────────────────────────────────────────────────

const CV_DIR = resolve('cv');
const MASTER_PATH = resolve(CV_DIR, 'master.yaml');
const VARIANTS_DIR = resolve(CV_DIR, 'variants');
const THEMES_DIR = resolve(CV_DIR, 'themes');

// ── Slug resolution ───────────────────────────────────────────────

export type SlugInfo = {
	variantName: string;
	mode: 'resume' | 'career';
};

export function resolveSlug(slug: string): SlugInfo | null {
	let mode: 'resume' | 'career';
	let variantName: string;

	if (slug.startsWith('resume')) {
		mode = 'resume';
		variantName = slug === 'resume' ? 'general' : slug.replace(/^resume-/, '');
	} else if (slug.startsWith('career')) {
		mode = 'career';
		variantName = slug === 'career' ? 'general' : slug.replace(/^career-/, '');
	} else {
		return null;
	}

	const variantPath = resolve(VARIANTS_DIR, `${variantName}.yaml`);
	if (!existsSync(variantPath)) return null;

	return { variantName, mode };
}

// ── Module-level cache ────────────────────────────────────────────

let masterCache: MasterData | null = null;

/**
 * Parse and validate master.yaml directly against the Zod schema.
 * No transformations needed — the YAML structure matches the schema.
 */
function loadMaster(): MasterData {
	if (masterCache) return masterCache;
	const content = readFileSync(MASTER_PATH, 'utf-8');
	masterCache = MasterSchema.parse(parseYaml(content));
	return masterCache;
}

function loadVariant(name: string): VariantConfig {
	const variantPath = resolve(VARIANTS_DIR, `${name}.yaml`);
	if (!existsSync(variantPath)) {
		throw new Error(`Variant not found: ${name}`);
	}
	const content = readFileSync(variantPath, 'utf-8');
	const raw = parseYaml(content);
	return VariantSchema.parse(raw);
}

function loadTheme(name: string): ThemeConfig {
	let themePath = resolve(THEMES_DIR, `${name}.yaml`);
	if (!existsSync(themePath)) {
		themePath = resolve(THEMES_DIR, 'default.yaml');
	}
	const content = readFileSync(themePath, 'utf-8');
	const raw = parseYaml(content);
	return ThemeSchema.parse(raw);
}

// ── Tag filtering ─────────────────────────────────────────────────

function matchesTags(itemTags: string[], filter: string[] | undefined): boolean {
	if (!filter) return true;
	if (itemTags.includes('all')) return true;
	return filter.some((f) => itemTags.includes(f));
}

// ── Section resolution ────────────────────────────────────────────

function resolveSection(
	sectionCfg: SectionConfig,
	master: MasterData,
	mode: 'resume' | 'career',
	variantName: string
): ResolvedSection | null {
	const { type, filter, max, style } = sectionCfg;

	switch (type) {
		case 'experience': {
			let items = master.experience.filter((e) => matchesTags(e.tags, filter));
			if (max) items = items.slice(0, max);
			if (items.length === 0) return null;
			return { type: 'experience', style, data: items };
		}

		case 'projects': {
			let items = master.projects
				.filter((p) => matchesTags(p.tags, filter))
				.map((p): Project | null => {
					// Resolve tech: may be an object with variant keys or a plain array
					let tech: string[] | undefined;
					if (p.tech) {
						if (Array.isArray(p.tech)) {
							tech = p.tech;
						} else if (typeof p.tech === 'object') {
							tech = (p.tech as Record<string, string[]>)[variantName] ?? (p.tech as Record<string, string[]>).default ?? undefined;
						}
					}

					if (mode === 'resume') {
						// Filter bullets by tags
						const bullets: Bullet[] = (p.bullets ?? []).filter((b) =>
							matchesTags(b.tags, filter)
						);
						if (bullets.length === 0) return null;
						return {
							slug: p.slug,
							title: p.title,
							start: p.start,
							end: p.end,
							org: p.org,
							team: p.team,
							role: p.role,
							url: p.url,
							tags: p.tags,
							tech,
							bullets
						};
					} else {
						// Career mode: filter details by tags
						const details = (p.details ?? []).filter((d) =>
							matchesTags(d.tags, filter)
						);
						const bullets: Bullet[] = (p.bullets ?? []).filter((b) =>
							matchesTags(b.tags, filter)
						);
						if (details.length === 0 && bullets.length === 0) return null;
						return {
							slug: p.slug,
							title: p.title,
							start: p.start,
							end: p.end,
							org: p.org,
							team: p.team,
							role: p.role,
							url: p.url,
							contributor_info: p.contributor_info,
							tags: p.tags,
							tech,
							bullets: bullets.length > 0 ? bullets : undefined,
							details: details.length > 0 ? details : undefined
						};
					}
				})
				.filter((p): p is Project => p !== null);

			if (max) items = items.slice(0, max);
			if (items.length === 0) return null;
			return { type: 'projects', style, data: items };
		}

		case 'oss': {
			const oss = master.oss;
			const highlights = oss.highlights.filter((h) => matchesTags(h.tags, filter));
			if (highlights.length === 0) return null;
			return {
				type: 'oss',
				style,
				data: { summary: oss.summary, highlights }
			};
		}

		case 'sideProjects': {
			const items = (master.sideProjects ?? [])
				.filter((sp) => matchesTags(sp.tags, filter))
				.map((sp): ResolvedSideProject => ({
					title: sp.title,
					dates: sp.dates,
					url: sp.url,
					tags: sp.tags,
					bullets: sp.bullets
						.filter((b) => matchesTags(b.tags, filter))
						.map((b) => b.text)
				}));
			if (items.length === 0) return null;
			return { type: 'sideProjects', style, data: items };
		}

		case 'skills': {
			const items = master.skills.filter((s) => matchesTags(s.tags, filter));
			if (items.length === 0) return null;
			return { type: 'skills', style, data: items };
		}

		case 'teaching_capabilities': {
			const caps = master.teaching?.capabilities;
			if (!caps || caps.length === 0) return null;
			return { type: 'teaching_capabilities', style, data: caps };
		}

		case 'teaching_experience': {
			// Filter experience entries by the section's filter tags
			const items = master.experience.filter((e) => matchesTags(e.tags, filter));
			if (items.length === 0) return null;
			return { type: 'teaching_experience', style, data: items };
		}

		case 'services': {
			const services = master.services;
			if (!services || services.length === 0) return null;
			return { type: 'services', style, data: services };
		}

		case 'workTerms': {
			const terms = master.workTerms;
			if (!terms || terms.length === 0) return null;
			return { type: 'workTerms', style, data: terms };
		}

		default:
			return null;
	}
}

// ── Main loader ───────────────────────────────────────────────────

export function loadCvData(slug: string): { data: FilteredData; theme: ThemeConfig } {
	const slugInfo = resolveSlug(slug);
	if (!slugInfo) {
		throw new Error(`Invalid slug: ${slug}`);
	}

	const { variantName, mode } = slugInfo;
	const master = loadMaster();
	const variant = loadVariant(variantName);

	// Resolve summary: inline text overrides key lookup
	const summary = variant.summary_text ?? master.summaries[variant.summary] ?? '';

	// Resolve highlight bullets: inline overrides key lookup
	const highlightBullets =
		variant.highlight_bullets_text ??
		(variant.highlight_bullets ? (master.highlight_bullets?.[variant.highlight_bullets] ?? []) : []);

	// Build sidebar data filtered by variant tags
	// Collect all filter tags from variant sections for sidebar filtering
	const allFilterTags = variant.sections
		.flatMap((s) => s.filter ?? [])
		.filter((v, i, a) => a.indexOf(v) === i);

	const sidebar: SidebarData = {
		skills: master.skills.filter((s) => matchesTags(s.tags, allFilterTags.length > 0 ? allFilterTags : undefined)),
		education: master.education
			.filter((e) => matchesTags(e.tags, allFilterTags.length > 0 ? allFilterTags : undefined))
			.map((e) => ({
				...e,
				dates: resolveVariantString(e.dates, variantName)
			})),
		certifications: master.certifications.filter((c) =>
			matchesTags(c.tags, allFilterTags.length > 0 ? allFilterTags : undefined)
		),
		other: master.other.filter((o) =>
			matchesTags(o.tags, allFilterTags.length > 0 ? allFilterTags : undefined)
		)
	};

	// Resolve sections
	const sections: ResolvedSection[] = variant.sections
		.map((sectionCfg) => resolveSection(sectionCfg, master, mode, variantName))
		.filter((s): s is ResolvedSection => s !== null);

	// Load theme
	const theme = loadTheme(variant.theme);

	return {
		data: {
			basics: master.basics,
			summary,
			highlightBullets,
			sidebar,
			sections,
			mode,
			title: mode === 'career' ? (variant.career_title ?? variant.title) : variant.title,
			subtitle: mode === 'career' ? (variant.career_subtitle ?? variant.subtitle) : variant.subtitle,
			slug
		},
		theme
	};
}

// ── List all variants ─────────────────────────────────────────────

export function listAllVariants(): Array<{
	resumeSlug: string | null;
	careerSlug: string | null;
	title: string;
	subtitle?: string;
}> {
	const files = readdirSync(VARIANTS_DIR).filter((f) => f.endsWith('.yaml'));
	return files.map((file) => {
		const name = file.replace(/\.yaml$/, '');
		const variant = loadVariant(name);
		const modes = variant.modes;
		const suffix = name === 'general' ? '' : `-${name}`;
		return {
			resumeSlug: modes.includes('resume') ? `resume${suffix}` : null,
			careerSlug: modes.includes('career') ? `career${suffix}` : null,
			title: variant.title,
			subtitle: variant.subtitle
		};
	});
}

// ── All slugs (for static adapter entries) ────────────────────────

export function allSlugs(): string[] {
	const files = readdirSync(VARIANTS_DIR).filter((f) => f.endsWith('.yaml'));
	const slugs: string[] = [];

	for (const file of files) {
		const name = file.replace(/\.yaml$/, '');
		const variant = loadVariant(name);
		const suffix = name === 'general' ? '' : `-${name}`;

		if (variant.modes.includes('resume')) {
			slugs.push(`resume${suffix}`);
		}
		if (variant.modes.includes('career')) {
			slugs.push(`career${suffix}`);
		}
	}

	return slugs;
}
