# Resume Management Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace scattered markdown files and hardcoded Svelte components with a single YAML master resume, variant configs, theme files, and data-driven Svelte components.

**Architecture:** Single `master.yaml` contains all resume data tagged for filtering. Variant YAML configs define which items to include and how to present them. Theme YAML files control visual styling. Two Svelte components (`ResumeLayout.svelte` for resumes, `CareerLayout.svelte` for career descriptions) render from structured data + theme props. A `cv-loader.ts` module handles YAML parsing, Zod validation, and tag-based filtering.

**Tech Stack:** SvelteKit, YAML (npm `yaml`), Zod, Tailwind CSS, `marked` (for career detail markdown)

**Spec:** `docs/superpowers/specs/2026-03-24-resume-architecture-design.md`

---

## File Map

### Create

| File | Responsibility |
|------|---------------|
| `cv/master.yaml` | Single source of truth — all experience, projects, skills, education, certifications, OSS, side projects, teaching, services |
| `cv/variants/general.yaml` | Default resume variant config |
| `cv/variants/instructor.yaml` | Instructor variant config |
| `cv/variants/freelancer.yaml` | Freelancer variant config |
| `cv/variants/toss.yaml` | Toss company variant config |
| `cv/themes/default.yaml` | Default theme (colors, spacing) |
| `cv/themes/toss.yaml` | Toss brand theme |
| `src/lib/data/cv-schema.ts` | Zod schemas for MasterData, VariantConfig, ThemeConfig + TypeScript types |
| `src/lib/data/cv-loader.ts` | YAML loading, Zod validation, tag filtering, slug resolution |
| `src/lib/components/ResumeLayout.svelte` | Data-driven A4 resume layout (replaces ResumeSidebar + ResumeSidebarToss) |
| `src/lib/components/CareerLayout.svelte` | Data-driven career description layout |
| `src/routes/cv/+page.server.ts` | CV list page server loader (scans variants/) |

### Modify

| File | Change |
|------|--------|
| `src/routes/cv/[slug]/+page.server.ts` | Replace markdown loading with YAML loader pipeline |
| `src/routes/cv/[slug]/+page.svelte` | Route to ResumeLayout or CareerLayout based on mode |
| `src/routes/cv/+page.svelte` | Use server data instead of CV_ENTRIES + paraglide |
| `src/routes/cv/[slug]/download/+page.server.ts` | Use new YAML loader |
| `src/routes/cv/[slug]/download/+page.svelte` | Replace `m[data.titleKey]()` with `data.title` |
| `src/routes/cv/+layout.svelte` | Remove padding/max-width for resume mode; conditionally hide locale toggle; update print `@page` conflict |
| `messages/ko-kr.json` | Remove per-variant keys (cv_resume_title, etc.) |
| `messages/en.json` | Remove per-variant keys |

### Delete

| File | Reason |
|------|--------|
| `cv/이력서.md` | Replaced by master.yaml |
| `cv/이력서_강사.md` | Replaced by master.yaml + instructor variant |
| `cv/이력서_프리랜서.md` | Replaced by master.yaml + freelancer variant |
| `cv/경력기술서.md` | Replaced by master.yaml details |
| `cv/경력기술서_toss.md` | Replaced by master.yaml + toss variant |
| `cv/resume_en.md` | English removed |
| `cv/resume-instructor_en.md` | English removed |
| `cv/resume-freelancer_en.md` | English removed |
| `cv/career_en.md` | English removed |
| `cv/toss.css` | Replaced by themes/toss.yaml |
| `src/lib/components/ResumeSidebar.svelte` | Replaced by ResumeLayout.svelte |
| `src/lib/components/ResumeSidebarToss.svelte` | Replaced by ResumeLayout.svelte |
| `src/lib/data/cv.ts` | Replaced by cv-schema.ts + cv-loader.ts |

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install yaml and zod**

```bash
cd /Users/dh/dev/portfolio
pnpm add yaml zod
```

- [ ] **Step 2: Verify installation**

```bash
pnpm check
```

Expected: No new errors (existing check should still pass).

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add yaml and zod dependencies"
```

---

## Task 2: Create Zod Schemas

**Files:**
- Create: `src/lib/data/cv-schema.ts`

- [ ] **Step 1: Create the schema file**

```typescript
// src/lib/data/cv-schema.ts
import { z } from 'zod';

// ── Master YAML schema ──

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

const ProjectSchema = z.object({
  slug: z.string(),
  title: z.string(),
  dates: z.string(),
  org: z.string(),
  role: z.string().optional(),
  url: z.string().optional(),
  tags: z.array(z.string()),
  tech: z.array(z.string()).optional(),
  bullets: z.array(BulletSchema).optional(),
  details: z.array(DetailSchema).optional()
});

const ExperienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  dates: z.string(),
  duration: z.string().optional(),
  tags: z.array(z.string())
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
  highlights: z.array(z.object({
    text: z.string(),
    tags: z.array(z.string())
  }))
});

const SideProjectSchema = z.object({
  title: z.string(),
  dates: z.string(),
  url: z.string().optional(),
  tags: z.array(z.string()),
  bullets: z.array(z.string())
});

const ServiceCategorySchema = z.object({
  category: z.string(),
  items: z.array(z.string())
});

export const MasterSchema = z.object({
  basics: BasicsSchema,
  summaries: z.record(z.string()),
  highlight_bullets: z.record(z.array(z.string())).optional(),
  experience: z.array(ExperienceSchema),
  projects: z.array(ProjectSchema),
  skills: z.array(SkillCategorySchema),
  education: z.array(EducationSchema),
  certifications: z.array(CertificationSchema),
  other: z.array(OtherItemSchema),
  oss: OssSchema,
  sideProjects: z.array(SideProjectSchema).optional(),
  teaching: z.object({ capabilities: z.array(z.string()) }).optional(),
  services: z.array(ServiceCategorySchema).optional(),
  workTerms: z.array(z.string()).optional()
});

// ── Variant config schema ──

const SectionSchema = z.object({
  type: z.string(),
  filter: z.array(z.string()).optional(),
  max: z.number().optional(),
  style: z.string().optional()
});

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
  sections: z.array(SectionSchema)
});

// ── Theme schema ──

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

// ── Exported types ──

export type MasterData = z.infer<typeof MasterSchema>;
export type VariantConfig = z.infer<typeof VariantSchema>;
export type ThemeConfig = z.infer<typeof ThemeSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Bullet = z.infer<typeof BulletSchema>;
export type Detail = z.infer<typeof DetailSchema>;
export type SectionConfig = z.infer<typeof SectionSchema>;

// ── Section discriminated union (type-safe rendering) ──

export type ResolvedSection =
  | { type: 'experience'; style?: string; data: z.infer<typeof ExperienceSchema>[] }
  | { type: 'projects'; style?: string; data: z.infer<typeof ProjectSchema>[] }
  | { type: 'oss'; style?: string; data: { summary: string; highlights: { text: string; tags: string[] }[] } }
  | { type: 'sideProjects'; style?: string; data: z.infer<typeof SideProjectSchema>[] }
  | { type: 'skills'; style?: string; data: z.infer<typeof SkillCategorySchema>[] }
  | { type: 'teaching_capabilities'; style?: string; data: string[] }
  | { type: 'teaching_experience'; style?: string; data: z.infer<typeof ExperienceSchema>[] }
  | { type: 'services'; style?: string; data: z.infer<typeof ServiceCategorySchema>[] }
  | { type: 'workTerms'; style?: string; data: string[] };

// ── Sidebar data (always rendered, filtered by variant tag) ──

export type SidebarData = {
  skills: z.infer<typeof SkillCategorySchema>[];
  education: z.infer<typeof EducationSchema>[];
  certifications: z.infer<typeof CertificationSchema>[];
  other: z.infer<typeof OtherItemSchema>[];
};

// ── Filtered data (output of cv-loader) ──

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
```

- [ ] **Step 2: Type check**

```bash
pnpm check
```

Expected: PASS — no errors in new file.

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/cv-schema.ts
git commit -m "feat: add Zod schemas for master, variant, and theme YAML"
```

---

## Task 3: Create Master YAML

**Files:**
- Create: `cv/master.yaml`

This is the data migration step. Extract all content from the existing sources into a single structured YAML file.

**Data sources to merge:**
- `src/lib/components/ResumeSidebar.svelte` — basics, skills, education, certifications, other, projects, OSS, summary, highlight_bullets (default variant)
- `src/lib/components/ResumeSidebarToss.svelte` — toss variant summary, highlight_bullets, project bullet differences
- `cv/이력서.md` — projects, experience, OSS, side projects
- `cv/이력서_강사.md` — teaching capabilities, teaching experience, instructor summary
- `cv/이력서_프리랜서.md` — services, workTerms, freelancer summary, project descriptions in delivery format
- `cv/경력기술서.md` — project details (이슈 사항, 문제점, 개선 사항, 적용 결과)
- `cv/경력기술서_toss.md` — toss-specific career details

- [ ] **Step 1: Create cv/master.yaml**

Write the complete YAML file. Structure:

```yaml
basics:
  name: 이대희
  title: Frontend Developer
  phone: "010-9382-0872"
  email: lee111dae11@proton.me
  github: soilSpoon
  linkedin: mlz37

summaries:
  default: >-
    React·TypeScript 기반 7년차 프론트엔드 엔지니어. B2B SaaS
    아키텍처 설계부터 성능 최적화, 반응형·접근성까지 주도해왔으며,
    AI 에이전트를 활용한 효율적 개발 워크플로우를 구축합니다.
  instructor: >-
    7년간 실무 풀스택 개발 경험을 기반으로 웹 프론트엔드 강의를
    진행하고 있습니다. ...
  freelancer: >-
    7년간 B2B/SaaS 서비스를 설계부터 운영까지 주도해온 풀스택
    개발자입니다. ...
  toss: >-
    React·TypeScript 기반 7년차 프론트엔드 엔지니어.
    Jotai·Emotion·React Query 등 상태관리 아키텍처 설계, ...

highlight_bullets:
  default:
    - "B2B SaaS 프론트엔드 설계·운영 — 디자인 시스템, 상태관리 아키텍처, 대량 데이터 렌더링 최적화"
    - "OpenCASCADE 3D CAD 엔진의 WASM 브라우저 이식 — 데스크탑 설치 없이 브라우저에서 CAD 모델링 실현"
    - "Astro·SWC·Jotai 등 오픈소스에 직접 기여 — 필요한 기능이나 버그를 소스 분석 후 PR로 해결"
    - "Claude Code·Codex·ampcode 등 AI 코딩 도구를 적극 활용한 개발 워크플로우 구축"
  toss:
    - "B2B SaaS 프론트엔드 — Chakra UI 디자인 시스템, React Query/Jotai/Zustand 3계층 상태관리, 수천 행 가상화 최적화"
    - "webpack 내부 수정으로 React Fast Refresh 구현 — laravel-mix에 12개 PR merged, SWC·Jotai·Valtio 등 오픈소스 기여"
    - "OpenCASCADE WASM 브라우저 이식 + Next.js SSR 호환 — AI 챗봇 UI로 복잡한 워크플로우 단순화"

experience:
  - company: 주식회사 에브리심
    role: 제품개발 책임
    dates: "2025.03 – 재직중"
    tags: [all]
  - company: 구름
    role: 프리랜서 강사 및 퍼실리테이터
    dates: "2024.08 – 재직중"
    tags: [instructor]
  - company: 씨엠유니버스(주)
    role: 개발 주임
    dates: "2018.09 – 2023.11"
    duration: 5년 3개월
    tags: [all]

# ... (complete data from all sources)
# projects, skills, education, certifications, other, oss, sideProjects,
# teaching, services, workTerms — all with proper tags
```

**Key rules for data migration:**
- Copy ALL text verbatim from existing sources — do not rewrite
- Every item gets `tags` field. Use `[all]` for items in every variant
- Projects that appear differently across variants get multiple entries with different slugs (e.g., `everydrone` for full, `everydrone-short` for instructor/freelancer condensed)
- Merge `ResumeSidebar.svelte` bullets (lines 139-153, 200-211, 230-253, etc.) into `projects[].bullets`
- Merge `ResumeSidebarToss.svelte` bullets (lines 139-149, 196-210, 226-248, etc.) into same project entries with appropriate tags
- Merge `경력기술서.md` and `경력기술서_toss.md` into `projects[].details`

- [ ] **Step 2: Validate YAML syntax**

```bash
node --input-type=module -e "import {parse} from 'yaml'; import {readFileSync} from 'fs'; parse(readFileSync('cv/master.yaml','utf8')); console.log('Valid YAML')"
```

Expected: "Valid YAML"

- [ ] **Step 3: Commit**

```bash
git add cv/master.yaml
git commit -m "feat: create master.yaml — single source of truth for all resume data"
```

---

## Task 4: Create Variant Configs

**Files:**
- Create: `cv/variants/general.yaml`
- Create: `cv/variants/instructor.yaml`
- Create: `cv/variants/freelancer.yaml`
- Create: `cv/variants/toss.yaml`

- [ ] **Step 1: Create cv/variants/ directory and all four variant files**

```yaml
# cv/variants/general.yaml
variant: general
title: 이력서
subtitle: 풀스택 개발자 이대희
summary: default
highlight_bullets: default
theme: default

sections:
  - type: experience
    filter: [all]
  - type: projects
    filter: [general, all]
    max: 4
  - type: oss
  - type: sideProjects
    filter: [general, all]
```

```yaml
# cv/variants/instructor.yaml
variant: instructor
title: "이력서 (강사)"
subtitle: 웹 개발 강사 이대희
summary: instructor
theme: default
modes: [resume]  # resume only, no career description

sections:
  - type: teaching_capabilities
  - type: teaching_experience
    filter: [instructor]
  - type: experience
    filter: [all]
    style: compact
  - type: skills
    filter: [instructor]
```

```yaml
# cv/variants/freelancer.yaml
variant: freelancer
title: "이력서 (프리랜서)"
subtitle: 풀스택 웹 개발자 이대희
summary: freelancer
theme: default
modes: [resume]  # resume only, no career description

sections:
  - type: services
  - type: projects
    filter: [freelancer, all]
  - type: skills
    filter: [all]
  - type: workTerms
```

```yaml
# cv/variants/toss.yaml
variant: toss
title: "이력서 (토스)"
subtitle: "Frontend Developer (Desktop) 지원용"
summary: toss
highlight_bullets: toss
theme: toss

sections:
  - type: experience
    filter: [all]
  - type: projects
    filter: [toss, all]
    max: 4
  - type: oss
  - type: sideProjects
    filter: [toss, all]
```

- [ ] **Step 2: Commit**

```bash
git add cv/variants/
git commit -m "feat: add variant configs for general, instructor, freelancer, toss"
```

---

## Task 5: Create Theme Files

**Files:**
- Create: `cv/themes/default.yaml`
- Create: `cv/themes/toss.yaml`

- [ ] **Step 1: Create cv/themes/ directory and both theme files**

Extract exact values from existing `ResumeSidebar.svelte` and `ResumeSidebarToss.svelte`:

```yaml
# cv/themes/default.yaml
accent: "#3182F6"
accent_opacity: "1"
sidebar_bg: "#191F28"
sidebar_border: "#2B3240"
link_color: "#3182F6"
font_family: "'Toss Product Sans', -apple-system, BlinkMacSystemFont, sans-serif"
main_padding: "22px 24px 18px"
main_gap: "12px"
sidebar_padding: "28px 16px 26px"
sidebar_gap: "20px"
badge_gap: "4px"
badge_px: "6px"
badge_py: "2px"
heading_border_width: "2px"
```

```yaml
# cv/themes/toss.yaml
accent: "#0064FF"
accent_opacity: "0.4"
sidebar_bg: "#202632"
sidebar_border: "#2B3240"
link_color: "#0064FF"
font_family: "'Toss Product Sans', -apple-system, BlinkMacSystemFont, sans-serif"
main_padding: "28px 28px 24px"
main_gap: "14px"
sidebar_padding: "28px 16px 26px"
sidebar_gap: "20px"
badge_gap: "5px"
badge_px: "7px"
badge_py: "2.5px"
heading_border_width: "1px"
```

- [ ] **Step 2: Commit**

```bash
git add cv/themes/
git commit -m "feat: add theme configs for default and toss"
```

---

## Task 6: Create CV Loader

**Files:**
- Create: `src/lib/data/cv-loader.ts`

This is the core logic module: YAML loading, Zod validation, tag-based filtering, slug resolution.

- [ ] **Step 1: Create the loader module**

```typescript
// src/lib/data/cv-loader.ts
import { readFileSync, readdirSync } from 'fs';
import { resolve, basename } from 'path';
import { parse } from 'yaml';
import {
  MasterSchema, VariantSchema, ThemeSchema,
  type MasterData, type VariantConfig, type ThemeConfig,
  type FilteredData, type ResolvedSection, type SidebarData
} from './cv-schema';

// ── Cache (module-level, valid for one build or until dev server restarts) ──

let masterCache: MasterData | null = null;

function getMaster(): MasterData {
  if (masterCache) return masterCache;
  const filePath = resolve('cv', 'master.yaml');
  const raw = readFileSync(filePath, 'utf-8');
  masterCache = MasterSchema.parse(parse(raw));
  return masterCache;
}

function loadVariant(name: string): VariantConfig {
  const filePath = resolve('cv', 'variants', `${name}.yaml`);
  const raw = readFileSync(filePath, 'utf-8');
  return VariantSchema.parse(parse(raw));
}

function loadTheme(name: string): ThemeConfig {
  try {
    const filePath = resolve('cv', 'themes', `${name}.yaml`);
    const raw = readFileSync(filePath, 'utf-8');
    return ThemeSchema.parse(parse(raw));
  } catch {
    // Fallback to default theme
    const filePath = resolve('cv', 'themes', 'default.yaml');
    const raw = readFileSync(filePath, 'utf-8');
    return ThemeSchema.parse(parse(raw));
  }
}

// ── Tag filtering ──

function matchesTags(itemTags: string[], filter?: string[]): boolean {
  if (!filter) return true;
  if (itemTags.includes('all')) return true;
  return itemTags.some(t => filter.includes(t));
}

// ── Slug resolution ──

type SlugInfo = { variantName: string; mode: 'resume' | 'career' };

export function resolveSlug(slug: string): SlugInfo | null {
  let mode: 'resume' | 'career';
  let variantSuffix: string;

  if (slug === 'resume') {
    return { variantName: 'general', mode: 'resume' };
  }
  if (slug === 'career') {
    return { variantName: 'general', mode: 'career' };
  }
  if (slug.startsWith('resume-')) {
    mode = 'resume';
    variantSuffix = slug.slice('resume-'.length);
  } else if (slug.startsWith('career-')) {
    mode = 'career';
    variantSuffix = slug.slice('career-'.length);
  } else {
    return null;
  }

  // Check if variant file exists
  const variantName = variantSuffix;
  // Try direct name first, then tailored- prefix
  const candidates = [variantName, `tailored-${variantName}`];
  for (const name of candidates) {
    try {
      readFileSync(resolve('cv', 'variants', `${name}.yaml`), 'utf-8');
      return { variantName: name, mode };
    } catch { /* not found, try next */ }
  }
  return null;
}

// ── Section resolution ──

function resolveSection(
  section: { type: string; filter?: string[]; max?: number; style?: string },
  master: MasterData,
  mode: 'resume' | 'career'
): ResolvedSection | null {
  const { type, filter, max, style } = section;

  switch (type) {
    case 'experience': {
      let items = master.experience.filter(e => matchesTags(e.tags, filter));
      if (max) items = items.slice(0, max);
      if (items.length === 0) return null;
      return { type, style, data: items };
    }
    case 'projects': {
      let items = master.projects
        .filter(p => matchesTags(p.tags, filter))
        .map(p => {
          if (mode === 'career') {
            // Career mode: filter details instead of bullets
            const details = (p.details ?? []).filter(d => matchesTags(d.tags, filter));
            return details.length > 0 ? { ...p, details, bullets: undefined } : null;
          }
          // Resume mode: filter bullets
          const bullets = (p.bullets ?? []).filter(b => matchesTags(b.tags, filter));
          return bullets.length > 0 ? { ...p, bullets, details: undefined } : null;
        })
        .filter((p): p is NonNullable<typeof p> => p !== null);
      if (max) items = items.slice(0, max);
      if (items.length === 0) return null;
      return { type, style, data: items };
    }
    case 'oss': {
      const highlights = master.oss.highlights.filter(h => matchesTags(h.tags, filter));
      if (highlights.length === 0 && !master.oss.summary) return null;
      return { type, data: { summary: master.oss.summary, highlights } };
    }
    case 'sideProjects': {
      let items = (master.sideProjects ?? []).filter(s => matchesTags(s.tags, filter));
      if (max) items = items.slice(0, max);
      if (items.length === 0) return null;
      return { type, data: items };
    }
    case 'skills': {
      let items = master.skills.filter(s => matchesTags(s.tags, filter));
      if (items.length === 0) return null;
      return { type, data: items };
    }
    case 'teaching_capabilities': {
      if (!master.teaching?.capabilities?.length) return null;
      return { type, data: master.teaching.capabilities };
    }
    case 'teaching_experience': {
      // Experience entries matching filter (typically [instructor])
      const items = master.experience.filter(e => matchesTags(e.tags, filter));
      if (items.length === 0) return null;
      return { type, data: items };
    }
    case 'services': {
      if (!master.services?.length) return null;
      return { type, data: master.services };
    }
    case 'workTerms': {
      if (!master.workTerms?.length) return null;
      return { type, data: master.workTerms };
    }
    default:
      return null;
  }
}

// ── Main loader ──

export function loadCvData(slug: string): {
  data: FilteredData;
  theme: ThemeConfig;
} {
  const slugInfo = resolveSlug(slug);
  if (!slugInfo) throw new Error(`CV variant not found: ${slug}`);

  const master = getMaster();
  const variant = loadVariant(slugInfo.variantName);
  const theme = loadTheme(variant.theme);

  // Resolve summary
  const summary = variant.summary_text ?? master.summaries[variant.summary] ?? '';

  // Resolve highlight bullets
  const highlightBullets = variant.highlight_bullets_text
    ?? (variant.highlight_bullets ? master.highlight_bullets?.[variant.highlight_bullets] : undefined)
    ?? [];

  // Resolve sections
  const sections = variant.sections
    .map(s => resolveSection(s, master, slugInfo.mode))
    .filter((s): s is ResolvedSection => s !== null);

  // Resolve sidebar data (filtered by variant name or 'all')
  const variantTag = variant.variant;
  const sidebarFilter = [variantTag];
  const sidebar: SidebarData = {
    skills: master.skills.filter(s => matchesTags(s.tags, sidebarFilter)),
    education: master.education.filter(e => matchesTags(e.tags, sidebarFilter)),
    certifications: master.certifications.filter(c => matchesTags(c.tags, sidebarFilter)),
    other: master.other.filter(o => matchesTags(o.tags, sidebarFilter))
  };

  return {
    data: {
      basics: master.basics,
      summary,
      highlightBullets,
      sidebar,
      sections,
      mode: slugInfo.mode,
      title: variant.title,
      subtitle: variant.subtitle,
      slug
    },
    theme
  };
}

// ── List all variants (for CV list page + entries()) ──

export function listAllVariants(): Array<{
  variant: string;
  resumeSlug: string;
  careerSlug: string | null;  // null if variant has no career mode
  title: string;
  subtitle?: string;
}> {
  const dir = resolve('cv', 'variants');
  const files = readdirSync(dir).filter(f => f.endsWith('.yaml'));
  return files.map(f => {
    const name = basename(f, '.yaml');
    const variant = loadVariant(name);
    const hasCareer = variant.modes.includes('career');
    return {
      variant: name,
      resumeSlug: name === 'general' ? 'resume' : `resume-${name}`,
      careerSlug: hasCareer ? (name === 'general' ? 'career' : `career-${name}`) : null,
      title: variant.title,
      subtitle: variant.subtitle
    };
  });
}

// ── All slugs (for static adapter entries()) ──
// Respects variant `modes` field: instructor/freelancer are resume-only

export function allSlugs(): Array<{ slug: string }> {
  const dir = resolve('cv', 'variants');
  const files = readdirSync(dir).filter(f => f.endsWith('.yaml'));
  const slugs: Array<{ slug: string }> = [];

  for (const f of files) {
    const name = basename(f, '.yaml');
    const variant = loadVariant(name);
    const modes = variant.modes; // defaults to ['resume', 'career'] via Zod

    if (modes.includes('resume')) {
      slugs.push({ slug: name === 'general' ? 'resume' : `resume-${name}` });
    }
    if (modes.includes('career')) {
      slugs.push({ slug: name === 'general' ? 'career' : `career-${name}` });
    }
  }

  return slugs;
}
```

- [ ] **Step 2: Type check**

```bash
pnpm check
```

Expected: PASS — all types resolve correctly.

- [ ] **Step 3: Commit**

```bash
git add src/lib/data/cv-loader.ts
git commit -m "feat: add cv-loader — YAML loading, validation, tag filtering"
```

---

## Task 7: Create ResumeLayout Component

**Files:**
- Create: `src/lib/components/ResumeLayout.svelte`

This replaces both `ResumeSidebar.svelte` (426 lines) and `ResumeSidebarToss.svelte` (396 lines) with a single data-driven component.

- [ ] **Step 1: Create the component**

The component receives `data: FilteredData` and `theme: ThemeConfig` as props.

Key structural requirements (preserve exact A4 dimensions and print behavior):
- Root: `210mm × 297mm` grid with `72mm sidebar + flex main`
- Sidebar: basics (contact), skills, education, certifications, other
- Main: summary, highlight_bullets, sections (iterated)
- All colors/spacing from CSS custom properties bound to theme
- Print styles: `@page { size: A4; margin: 0; }`, `print-color-adjust: exact`
- SVG icons for phone, email, GitHub, LinkedIn (hardcoded in component, same as current)

Section rendering logic in main area:

```svelte
{#each data.sections as section}
  {#if section.type === 'experience'}
    <!-- Render experience entries -->
  {:else if section.type === 'projects'}
    <!-- Render project articles with bullets + tech -->
  {:else if section.type === 'oss'}
    <!-- Render OSS summary + highlights -->
  {:else if section.type === 'sideProjects'}
    <!-- Render side projects -->
  {:else if section.type === 'teaching_capabilities'}
    <!-- Render teaching capabilities list -->
  {:else if section.type === 'teaching_experience'}
    <!-- Render teaching experience (compact) -->
  {:else if section.type === 'services'}
    <!-- Render service categories -->
  {:else if section.type === 'workTerms'}
    <!-- Render work terms -->
  {:else if section.type === 'skills'}
    <!-- Render skill categories (for instructor variant that puts skills in main) -->
  {/if}
{/each}
```

Sidebar always renders from `data.basics` + sections filtered by the sidebar-specific types (skills, education, certifications, other). These are always shown in the sidebar for resume mode, regardless of variant sections config. The sidebar skills/education/certifications/other come directly from master data, filtered by the variant's overall tag (matching the variant name or `all`).

**Important**: Copy the exact Tailwind classes, pixel sizes, SVG paths, and `<style>` block from the existing `ResumeSidebar.svelte` but replace hardcoded data with `{data.field}` bindings and hardcoded colors with `var(--accent)` etc.

Reference files for exact styles:
- `src/lib/components/ResumeSidebar.svelte` (default variant styles)
- `src/lib/components/ResumeSidebarToss.svelte` (toss variant styles)

- [ ] **Step 2: Type check**

```bash
pnpm check
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/ResumeLayout.svelte
git commit -m "feat: add ResumeLayout — unified data-driven A4 resume component"
```

---

## Task 8: Create CareerLayout Component

**Files:**
- Create: `src/lib/components/CareerLayout.svelte`

- [ ] **Step 1: Create the component**

Career layout renders project `details[].content` (markdown) instead of `bullets`. Structure:

```svelte
<script lang="ts">
  import { marked } from 'marked';
  import type { FilteredData, ThemeConfig } from '$lib/data/cv-schema';

  let { data, theme }: { data: FilteredData; theme: ThemeConfig } = $props();
</script>

<!-- For each project section, render details with markdown content -->
<!-- Use {#each} over data.sections, find projects type -->
<!-- For each project's details: -->
<!--   {@html marked(detail.content)} -->
```

Key requirements:
- Same theme CSS variables as ResumeLayout
- Multi-page print support: `break-before: page` between project sections
- The existing `cv/cv.css` markdown styles should be preserved or recreated for `details[].content`
- Header with title, company, dates for each project
- Each detail section has its own `#### title` heading

- [ ] **Step 2: Type check**

```bash
pnpm check
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/components/CareerLayout.svelte
git commit -m "feat: add CareerLayout — data-driven career description component"
```

---

## Task 9: Update All CV Routes (Server + Page Components)

Server loaders and page components must be updated together — intermediate state would break type checking.

**Files:**
- Modify: `src/routes/cv/[slug]/+page.server.ts`
- Modify: `src/routes/cv/[slug]/+page.svelte`
- Create: `src/routes/cv/+page.server.ts`
- Modify: `src/routes/cv/+page.svelte`
- Modify: `src/routes/cv/[slug]/download/+page.server.ts`
- Modify: `src/routes/cv/[slug]/download/+page.svelte`
- Modify: `src/routes/cv/+layout.svelte`

- [ ] **Step 1: Rewrite `src/routes/cv/[slug]/+page.server.ts`**

Replace the entire file:

```typescript
import { error } from '@sveltejs/kit';
import { loadCvData, allSlugs } from '$lib/data/cv-loader';

export function entries() {
  return allSlugs();
}

export async function load({ params }) {
  try {
    const { data, theme } = loadCvData(params.slug);
    return { ...data, theme };
  } catch {
    error(404, 'CV not found');
  }
}
```

- [ ] **Step 2: Create `src/routes/cv/+page.server.ts`**

```typescript
import { listAllVariants } from '$lib/data/cv-loader';

export async function load() {
  return { entries: listAllVariants() };
}
```

- [ ] **Step 3: Rewrite `src/routes/cv/[slug]/download/+page.server.ts`**

Replace the entire file — same logic as the main route:

```typescript
import { error } from '@sveltejs/kit';
import { loadCvData, allSlugs } from '$lib/data/cv-loader';

export function entries() {
  return allSlugs();
}

export async function load({ params }) {
  try {
    const { data, theme } = loadCvData(params.slug);
    return { ...data, theme };
  } catch {
    error(404, 'CV not found');
  }
}
```

- [ ] **Step 4: Rewrite `src/routes/cv/[slug]/+page.svelte`**

Replace the entire file. Key changes:
- Remove `ResumeSidebar` and `ResumeSidebarToss` imports
- Import `ResumeLayout` and `CareerLayout`
- Route based on `data.mode` instead of slug string matching
- Replace `m[data.titleKey]()` with `data.title`
- Print styles applied for all resume-mode slugs (not just hardcoded two)

```svelte
<script lang="ts">
  import { browser } from '$app/environment';
  import { resolve } from '$app/paths';
  import * as m from '$lib/paraglide/messages';
  import ResumeLayout from '$lib/components/ResumeLayout.svelte';
  import CareerLayout from '$lib/components/CareerLayout.svelte';
  let { data } = $props();

  function handlePrint() {
    if (browser) window.print();
  }
</script>

<svelte:head>
  <title>{m.cv_detail_title({ title: data.title })}</title>
  <meta name="robots" content="noindex" />
  {#if data.mode === 'resume'}
    {@html `<style>
      @media print {
        @page { size: A4; margin: 0; }
        html, body { margin: 0; padding: 0; width: 210mm; height: 297mm; }
        .cv-root:has(.resume-page) {
          padding: 0 !important;
          margin: 0 !important;
          max-width: none !important;
        }
      }
    </style>`}
  {/if}
</svelte:head>

<div class="no-print mb-6 flex items-center justify-between">
  <nav class="flex items-center gap-2 text-sm text-gray-400">
    <a href={resolve('/cv')} class="text-blue-600 no-underline hover:underline">{m.cv_list()}</a>
    <span>/</span>
    <span>{data.title}</span>
  </nav>
  <button
    onclick={handlePrint}
    class="cursor-pointer rounded-md border-none bg-gray-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-gray-700"
  >
    PDF 저장
  </button>
</div>

{#if data.mode === 'resume'}
  <ResumeLayout {data} theme={data.theme} />
{:else}
  <CareerLayout {data} theme={data.theme} />
{/if}
```

- [ ] **Step 5: Rewrite `src/routes/cv/+page.svelte`**

Replace the entire file. Show both resume and career links for each variant:

```svelte
<script lang="ts">
  import { resolve } from '$app/paths';
  import * as m from '$lib/paraglide/messages';
  let { data } = $props();
</script>

<svelte:head>
  <title>{m.cv_page_title()}</title>
</svelte:head>

<h1>{m.cv_page_heading()}</h1>
<p>{m.cv_page_description()}</p>

<hr />

<nav class="mt-6 grid gap-4">
  {#each data.entries as entry (entry.resumeSlug)}
    <div class="flex flex-col gap-2 rounded-lg border border-gray-200 px-6 py-5 transition-all hover:border-gray-400 hover:shadow-md">
      <strong class="text-[1.05rem] text-gray-900">{entry.title}</strong>
      {#if entry.subtitle}
        <span class="text-sm text-gray-500">{entry.subtitle}</span>
      {/if}
      <div class="flex gap-3 text-sm">
        <a href={resolve(`/cv/${entry.resumeSlug}`)} class="text-blue-600 no-underline hover:underline">이력서</a>
        {#if entry.careerSlug}
          <a href={resolve(`/cv/${entry.careerSlug}`)} class="text-blue-600 no-underline hover:underline">경력기술서</a>
        {/if}
      </div>
    </div>
  {/each}
</nav>
```

- [ ] **Step 3: Update `src/routes/cv/[slug]/download/+page.svelte`**

Replace `m[data.titleKey]()` with `data.title` in three places:
- Line 33: `<title>{m.cv_download_title({ title: data.title })}</title>`
- Line 41: `<p class="mb-6 text-sm text-gray-400">{data.title}</p>`
- Preserve all paraglide calls for UI strings (`cv_pdf_download`, `cv_enter_pin`, `cv_confirm`, etc.)
- In the authorized section, replace `{@html data.html}` with the appropriate layout component (or keep markdown rendering if download route should use the same component rendering)

For the download route's authorized content:

```svelte
{:else}
  <div class="no-print mb-6 flex items-center justify-between border-b border-gray-100 py-3">
    <a href={resolve(`/cv/${data.slug}`)} class="text-sm text-blue-600 no-underline hover:underline"
      >&larr; {m.cv_view_web()}</a
    >
    <button onclick={handlePrint} class="font-inherit cursor-pointer rounded-md border-none bg-gray-900 px-5 py-2 text-sm text-white hover:bg-gray-700">
      {m.cv_save_as_pdf()}
    </button>
  </div>

  {#if data.mode === 'resume'}
    <ResumeLayout {data} theme={data.theme} />
  {:else}
    <CareerLayout {data} theme={data.theme} />
  {/if}
{/if}
```

- [ ] **Step 7: Update `src/routes/cv/+layout.svelte`**

The `.cv-root` wrapper applies `max-width: 800px` and `padding: 3rem 2rem` which conflicts with the `210mm` resume page. Fix by removing padding/max-width when a resume-mode page is rendered, and hide the locale toggle on CV pages (content is Korean-only now).

Key changes:
- The layout receives the page's data via `$page.data` or the child snippet. Since layout can't easily know the mode, add a CSS approach: the existing `has(.resume-page)` selector already works for print. Add a screen equivalent:

```css
/* In +layout.svelte <style> */
.cv-root:has(.resume-page) {
  max-width: none;
  padding: 0;
  margin: 0;
  background: #f0f1f3;
}
```

- Remove or conditionally hide the locale toggle button (CV content is Korean-only; the toggle is misleading)
- The print `@page` in `+layout.svelte`'s `<svelte:head>` sets `margin: 18mm 20mm`. The `+page.svelte` injects `@page { margin: 0; }` for resume mode. The page-level injection appears later in the DOM, so it overrides the layout's `@page`. This is correct — no change needed for print.
- `cv.css` `.cv-markdown` styles: keep for now (CareerLayout may use `.cv-markdown` class for its `{@html marked()}` content). Can be cleaned up later.

- [ ] **Step 8: Type check**

```bash
pnpm check
```

- [ ] **Step 9: Commit**

```bash
git add src/routes/cv/+page.server.ts src/routes/cv/+page.svelte \
  src/routes/cv/[slug]/+page.server.ts src/routes/cv/[slug]/+page.svelte \
  src/routes/cv/[slug]/download/+page.server.ts src/routes/cv/[slug]/download/+page.svelte \
  src/routes/cv/+layout.svelte
git commit -m "feat: rewire all CV routes to YAML pipeline + data-driven components"
```

---

## Task 10: Clean Up i18n Keys

**Files:**
- Modify: `messages/ko-kr.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Remove per-variant message keys from `messages/ko-kr.json`**

Remove these keys:
- `cv_resume_title`
- `cv_resume_subtitle`
- `cv_resume_instructor_title`
- `cv_resume_instructor_subtitle`
- `cv_resume_freelancer_title`
- `cv_resume_freelancer_subtitle`
- `cv_career_title`
- `cv_career_subtitle`
- `cv_resume_toss_title`
- `cv_resume_toss_subtitle`
- `cv_career_toss_title`
- `cv_career_toss_subtitle`

Keep all general UI keys: `cv_page_title`, `cv_page_heading`, `cv_page_description`, `cv_list`, `cv_save_as_pdf`, `cv_enter_pin`, `cv_confirm`, `cv_pin_incorrect`, `cv_pdf_download`, `cv_view_web`, `cv_download_title`, `cv_detail_title`.

- [ ] **Step 2: Do the same for `messages/en.json`**

- [ ] **Step 3: Regenerate paraglide runtime**

```bash
pnpm prepare
```

- [ ] **Step 4: Type check to ensure no broken references**

```bash
pnpm check
```

Expected: PASS — no references to deleted message keys remain (we replaced all `m[data.titleKey]()` calls with `data.title`).

- [ ] **Step 5: Commit**

```bash
git add messages/ko-kr.json messages/en.json src/lib/paraglide/
git commit -m "chore: remove per-variant i18n keys — titles now in variant YAML"
```

---

## Task 11: Build Verification

- [ ] **Step 1: Run full build**

```bash
pnpm build
```

Expected: PASS — all CV pages pre-rendered from YAML data.

- [ ] **Step 2: Preview and verify**

```bash
pnpm preview
```

Open in browser and verify:
- `/cv` — list page shows all variants
- `/cv/resume` — default resume renders with sidebar layout
- `/cv/resume-toss` — toss resume renders with blue accent theme
- `/cv/resume-instructor` — instructor variant with teaching sections
- `/cv/resume-freelancer` — freelancer variant with services section
- `/cv/career` — career description with markdown details
- `/cv/career-toss` — toss career description
- Print (Cmd+P) on resume pages produces correct A4 PDF

- [ ] **Step 3: Commit any fixes found during verification**

---

## Task 12: Delete Old Files

**Only after build verification passes.**

**Files to delete:**

```
cv/이력서.md
cv/이력서_강사.md
cv/이력서_프리랜서.md
cv/경력기술서.md
cv/경력기술서_toss.md
cv/resume_en.md
cv/resume-instructor_en.md
cv/resume-freelancer_en.md
cv/career_en.md
cv/toss.css
src/lib/components/ResumeSidebar.svelte
src/lib/components/ResumeSidebarToss.svelte
src/lib/data/cv.ts
```

- [ ] **Step 1: Delete old files**

```bash
git rm cv/이력서.md cv/이력서_강사.md cv/이력서_프리랜서.md cv/경력기술서.md cv/경력기술서_toss.md
git rm cv/resume_en.md cv/resume-instructor_en.md cv/resume-freelancer_en.md cv/career_en.md
git rm cv/toss.css
git rm src/lib/components/ResumeSidebar.svelte src/lib/components/ResumeSidebarToss.svelte
git rm src/lib/data/cv.ts
```

- [ ] **Step 2: Verify build still passes**

```bash
pnpm build
```

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: remove old markdown files and hardcoded Svelte components"
```

---

## Task 13: Create /tailor Claude Code Skill

**Files:**
- Create: `.claude/skills/tailor.md` (or appropriate skills path)

- [ ] **Step 1: Create the skill file**

The skill should instruct Claude Code to:
1. Read `cv/master.yaml`
2. Accept job posting text (pasted or file path)
3. Analyze job requirements
4. Select relevant items from master
5. Rewrite summary and bullets for fit
6. Generate `cv/variants/tailored-{company}.yaml`
7. Optionally generate `cv/themes/{company}.yaml`

Key constraints to encode in the skill:
- Never modify master.yaml
- Never fabricate experience/skills
- Use `summary_text` and `highlight_bullets_text` inline fields
- Show what changed and why

- [ ] **Step 2: Test the skill**

```
/tailor
(paste a sample job posting)
```

Verify it generates a valid variant YAML.

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/tailor.md
git commit -m "feat: add /tailor Claude Code skill for job-specific resume tailoring"
```
