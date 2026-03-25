# Resume Management Architecture Design

**Date**: 2026-03-24
**Status**: Approved

---

## Prerequisites

### New Dependencies

```bash
pnpm add yaml zod
```

---

## Problem

Resume data is scattered across 3+ markdown files and 2 Svelte components, all with hardcoded content. Updating a single fact (e.g., a date or company name) requires editing up to 5 files. Variants (instructor, freelancer, Toss) share ~70% of content but are maintained independently. There is no programmatic way to tailor a resume for a specific job posting.

---

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Master data format | YAML | Structured, human-editable, supports multiline |
| Language | Korean only | English conversion via LLM skill when needed |
| Variant system | Tags + overrides | Tags filter items, overrides handle summaries/sections/ordering |
| Career descriptions | YAML (same master) | Also needs per-job tailoring; `details[]` field with markdown content |
| Rendering | Svelte components | Full layout control, A4 print support, CSS variable theming |
| Theme management | Separate YAML files | Reusable across variants, one theme per company |
| Tailoring approach | Claude Code skill | Runs within subscription, no API cost |
| Tailoring input | Text paste or file path | Skill auto-detects input type |
| i18n | Removed for now | Future `/translate` skill can generate English variants |

---

## Architecture

### 3-Layer Design

```
┌─────────────────────────────────────────────┐
│  Layer 1: master.yaml (single source)       │
│  All experience, projects, skills, etc.     │
│  Each item tagged for variant filtering     │
└──────────────────┬──────────────────────────┘
                   │
    ┌──────────────┼──────────────┐
    ▼              ▼              ▼
┌────────┐  ┌──────────┐  ┌──────────────┐
│ Static │  │ Static   │  │ Dynamic      │
│ variant│  │ variant  │  │ /tailor skill│
│ .yaml  │  │ .yaml    │  │ job-specific │
└───┬────┘  └────┬─────┘  └──────┬───────┘
    │            │               │
    └────────────┼───────────────┘
                 ▼
┌─────────────────────────────────────────────┐
│  Layer 3: Svelte components                 │
│  ResumeLayout.svelte + CareerLayout.svelte  │
│  Data + theme as props, CSS variable theming│
└─────────────────────────────────────────────┘
```

### File Structure

```
cv/
  master.yaml                 # Single source of truth (Korean)
  variants/
    general.yaml              # Default resume
    instructor.yaml           # Teaching focus
    freelancer.yaml           # Freelancer focus
    toss.yaml                 # Toss company variant
  themes/
    default.yaml              # Default colors/spacing
    toss.yaml                 # Toss brand theme
  jobs/                       # Job posting texts (optional)

src/lib/
  components/
    ResumeLayout.svelte       # A4 sidebar layout (replaces ResumeSidebar + ResumeSidebarToss)
    CareerLayout.svelte       # Career description layout
  data/
    cv.ts                     # Rewritten: YAML loader + tag filtering logic

src/routes/cv/
  [slug]/
    +page.server.ts           # Loads master + variant + theme, filters, returns structured data
    +page.svelte              # Routes to ResumeLayout or CareerLayout based on slug
```

---

## Master YAML Schema (`cv/master.yaml`)

```yaml
basics:
  name: string               # 이대희
  title: string               # Frontend Developer
  phone: string
  email: string
  github: string              # username only
  linkedin: string            # username only

summaries:
  default: string             # General resume summary
  instructor: string          # Teaching-focused summary
  freelancer: string          # Freelancer summary
  toss: string                # Toss-tailored summary
  # Static variants only; /tailor bypasses these maps using variant-level inline overrides (summary_text)

highlight_bullets:
  default: string[]           # Bullets shown below summary
  toss: string[]
  # Static variants only; /tailor uses variant-level inline overrides

experience:
  - company: string
    role: string
    dates: string
    duration: string?         # Optional, e.g., "5년 3개월"
    tags: string[]            # [all] | [instructor] | [freelancer] etc.

projects:
  - slug: string              # Unique identifier
    title: string
    dates: string
    org: string               # Company name
    role: string
    url: string?
    tags: string[]
    tech: string[]            # Technology stack

    bullets:                  # Resume bullets (short, achievement-focused)
      - text: string
        tags: string[]

    details:                  # Career description sections (long-form)
      - title: string
        tags: string[]
        content: string       # Markdown (rendered via marked)

skills:
  - label: string             # Category name
    items: string[]
    tags: string[]            # Which variants include this category

education:
  - name: string
    field: string
    dates: string
    tags: string[]

certifications:
  - name: string
    date: string
    tags: string[]

other:
  - text: string
    tags: string[]

oss:
  summary: string
  highlights:
    - text: string
      tags: string[]

sideProjects:
  - title: string
    dates: string
    url: string?
    tags: string[]
    bullets: string[]

teaching:                     # Instructor-only
  capabilities: string[]

services:                     # Freelancer-only
  - category: string
    items: string[]

workTerms: string[]           # Freelancer-only
```

### Tag Convention

- `all` — included in every variant
- `general` — default resume only
- `instructor` — instructor variant only
- `freelancer` — freelancer variant only
- `toss` — Toss variant only
- Tags are combinable: `[general, toss]` = included in both
- `/tailor` skill creates new tag names dynamically

### Tag Filtering Algorithm

An item is included in a section if ANY of the following is true:
1. The section has no `filter` field → include all items
2. The item's `tags` includes `all`
3. The item's `tags` intersects with the section's `filter` array

For projects, bullet-level filtering applies the same logic. If a project matches but all its bullets are filtered out, the project is skipped entirely.

Sections with zero matching items are not rendered (no empty headers).

---

## Variant Config Schema (`cv/variants/*.yaml`)

```yaml
variant: string               # Variant identifier
title: string                 # Display name for CV list page (e.g., "이력서", "이력서 (강사)")
subtitle: string?             # Optional subtitle for CV list page
summary: string               # Key in summaries (e.g., "default", "toss")
highlight_bullets: string?    # Key in highlight_bullets
theme: string                 # References themes/{name}.yaml

# Note: mode (resume vs career) is NOT stored here — it's derived from the URL slug prefix.
# /tailor skill can inline summary/bullets directly (keeps master.yaml immutable)
summary_text: string?         # Inline summary (overrides summary key lookup)
highlight_bullets_text: string[]?  # Inline bullets (overrides key lookup)

sections:                     # Ordered list of sections to render
  - type: string              # experience | projects | oss | sideProjects |
                              # teaching_capabilities | teaching_experience |
                              # services | workTerms | custom
    filter: string[]?         # Tag filter (see Tag Filtering Algorithm)
    max: number?              # Max items to show
    style: string?            # "compact" for one-line entries

# Career mode uses the same sections list.
# When mode is "career", projects automatically render details[].content instead of bullets.
```

---

## Theme Schema (`cv/themes/*.yaml`)

```yaml
# Colors
accent: string                # "#3182F6" — section headings, links, skill labels
accent_opacity: string?       # "0.4" — for heading border opacity (Toss uses border with opacity)
sidebar_bg: string            # "#191F28" — sidebar background
sidebar_border: string        # "#2B3240" — sidebar section dividers
link_color: string            # "#3182F6" — hyperlinks

# Typography
font_family: string           # Font stack

# Spacing — main content area
main_padding: string          # "22px 24px 18px" — pt pr/pl pb
main_gap: string              # "12px" — gap between main sections

# Spacing — sidebar
sidebar_padding: string       # "28px 16px 26px"
sidebar_gap: string           # "20px"

# Spacing — skill badges
badge_gap: string             # "4px" — gap between badges
badge_px: string              # "6px" — badge horizontal padding
badge_py: string              # "2px" — badge vertical padding

# Heading style
heading_border_width: string  # "2px" or "1px"
```

Applied via CSS custom properties in `ResumeLayout.svelte`:

```svelte
<div class="resume-page" style="
  --accent: {theme.accent};
  --accent-opacity: {theme.accent_opacity ?? '1'};
  --sidebar-bg: {theme.sidebar_bg};
  --sidebar-border: {theme.sidebar_border};
  --sidebar-padding: {theme.sidebar_padding};
  --sidebar-gap: {theme.sidebar_gap};
  --main-padding: {theme.main_padding};
  --main-gap: {theme.main_gap};
  --badge-gap: {theme.badge_gap};
  --badge-px: {theme.badge_px};
  --badge-py: {theme.badge_py};
  --heading-border-width: {theme.heading_border_width};
  --font-family: {theme.font_family};
">
```

---

## Runtime Validation

`src/lib/data/cv.ts` exports Zod schemas for all data types:

```typescript
// Zod schemas for parsed YAML validation
export const MasterSchema = z.object({ ... });
export const VariantSchema = z.object({ ... });
export const ThemeSchema = z.object({ ... });

// Parsed + validated types
export type MasterData = z.infer<typeof MasterSchema>;
export type VariantConfig = z.infer<typeof VariantSchema>;
export type ThemeConfig = z.infer<typeof ThemeSchema>;
```

All YAML files are validated through their schema at load time. Malformed YAML produces clear error messages at build time, not silent runtime failures.

---

## Rendering Pipeline

### Static Adapter Compatibility

The project uses `@sveltejs/adapter-static`. All pages are pre-rendered at build time — there is no server at request time.

The `entries()` function in `+page.server.ts` scans `cv/variants/` at build time to produce the slug list:

```typescript
export function entries() {
  // Scan cv/variants/ directory for all .yaml files
  // For general.yaml: generate 'resume' and 'career' (no suffix)
  // For others: generate 'resume-{name}' and 'career-{name}'
  // Returns: [{ slug: 'resume' }, { slug: 'resume-toss' }, { slug: 'career' }, ...]
}
```

**Implication for `/tailor`**: Tailored variants are not accessible until the site is rebuilt (`pnpm build`). During development, `pnpm dev` (SSR mode) provides immediate preview.

### Server-side (`+page.server.ts`)

```
Request: /cv/resume-toss

1. Map slug to variant:
   resume       → variants/general.yaml (resume mode)
   resume-toss  → variants/toss.yaml (resume mode)
   career       → variants/general.yaml (career mode)
   career-toss  → variants/toss.yaml (career mode)
   resume-instructor  → variants/instructor.yaml (resume mode)
   resume-freelancer  → variants/freelancer.yaml (resume mode)

2. Load cv/master.yaml (parsed once, module-level cache with mtime check for dev HMR)
3. Load variant config (validated via VariantSchema)
4. Resolve summary: use variant.summary_text if present, else look up master.summaries[variant.summary]
5. Resolve highlight_bullets: same pattern (inline text overrides key lookup)
6. Filter master data by variant's tag rules (see Tag Filtering Algorithm)
7. Load theme from cv/themes/{variant.theme}.yaml (fallback to themes/default.yaml if missing)
8. Return { data, theme, mode: 'resume' | 'career' }
```

### Client-side (`+page.svelte`)

```svelte
{#if data.mode === 'resume'}
  <ResumeLayout data={data} theme={data.theme} />
{:else}
  <CareerLayout data={data} theme={data.theme} />
{/if}
```

### Components

**`ResumeLayout.svelte`** — Replaces `ResumeSidebar.svelte` + `ResumeSidebarToss.svelte`:
- A4 grid: `210mm × 297mm`, `72mm sidebar + flex main`
- Sidebar: basics, skills, education, certifications, other (all from data props)
- Main: summary, highlight_bullets, sections (iterated from data)
- Theme via CSS custom properties
- Print styles preserved

**`CareerLayout.svelte`** — Replaces markdown `@html` rendering:
- Structured layout with project detail sections
- `details[].content` rendered via `{@html marked(detail.content)}`
- Same theme system as ResumeLayout
- Multi-page print support via CSS `break-before: page`

**Contact icons**: SVG icons (phone, email, GitHub, LinkedIn) are hardcoded in the component, mapped by field name from `basics`. This is a fixed set that rarely changes.

### Error Handling

- Missing variant file → 404 with message "CV variant not found"
- Missing theme file → fallback to `themes/default.yaml`
- YAML parse error → build-time Zod validation error with field path

---

## Claude Code Skill: `/tailor`

### Usage

```
# Paste job posting text directly in conversation
/tailor
(paste job posting text)

# Or reference a saved file
/tailor cv/jobs/toss-frontend.txt
```

### Behavior

1. Read `cv/master.yaml`
2. Parse input (auto-detect: file path if starts with path-like string, else treat as text)
3. Analyze job posting:
   - Extract required skills, experience, keywords
   - Identify company name and role
4. Select relevant items from master:
   - Match projects/bullets by tech stack and keyword overlap
   - Prioritize by relevance score
5. Rewrite for fit:
   - Adjust summary to emphasize relevant experience
   - Rewrite bullet points to use job posting keywords
   - Reorder sections by relevance
6. Generate output:
   - `cv/variants/tailored-{company}.yaml` — variant config
   - Optionally `cv/themes/{company}.yaml` — if company brand colors known
7. Report summary to user:
   - Which items were selected/excluded
   - What was rewritten and why
   - How to preview: URL to `/cv/resume-{company}`

### Constraints

- **No fabrication**: Only use experience/skills that exist in master.yaml
- **Rewrite only**: Adjust emphasis and keywords, don't invent achievements
- **Preserve master**: Never modify master.yaml — tailored summaries and bullets go into the variant config via `summary_text` and `highlight_bullets_text` inline fields
- **Transparency**: Show what changed and why

---

## Slug → Route Mapping

Current `cv.ts` `CV_ENTRIES` is replaced by filesystem-based resolution:

```
Slug pattern:
  resume               → variant: general,     mode: resume
  resume-instructor    → variant: instructor,  mode: resume
  resume-freelancer    → variant: freelancer,  mode: resume
  resume-toss          → variant: toss,        mode: resume
  resume-{company}     → variant: tailored-{company}, mode: resume
  career               → variant: general,     mode: career
  career-toss          → variant: toss,        mode: career
  career-{company}     → variant: tailored-{company}, mode: career
```

Slugs are derived by scanning `cv/variants/` at build time. The `entries()` function generates slugs automatically from variant filenames. No hardcoded registry.

Special mapping: `resume` and `career` (no suffix) map to `variants/general.yaml`.

### Download Route

The existing PIN-protected download route (`/cv/[slug]/download/`) is preserved. It uses the same YAML pipeline — the `+page.server.ts` in the download route imports the same loader functions. No changes to PIN logic.

---

## i18n Removal

The CV routes are decoupled from paraglide for per-variant content:

- `getLocale()` calls removed from CV `+page.server.ts`
- Variant `title` and `subtitle` fields replace paraglide message keys (`titleKey`, `subtitleKey`)
- English markdown files deleted (see Files to Delete)
- Per-variant message keys removed from `messages/*.json`: `cv_resume_title`, `cv_resume_subtitle`, `cv_resume_toss_title`, `cv_resume_instructor_title`, `cv_resume_freelancer_title`, `cv_career_title`, `cv_career_toss_title`, and their subtitle counterparts
- **Retained**: General-purpose CV UI message keys stay in paraglide: `cv_page_title`, `cv_page_heading`, `cv_page_description`, `cv_pdf_download`, `cv_enter_pin`, `cv_confirm`, `cv_pin_incorrect`, `cv_save_as_pdf`, `cv_view_web`, `cv_download_title`, `cv_detail_title`, `cv_list`
- The download route replaces `m[data.titleKey]()` with `data.title` (from variant config) but continues using paraglide for UI strings like `cv_enter_pin`, `cv_confirm`, etc.
- The portfolio's main locale toggle and paraglide setup remain untouched

## CV List Page Migration

The existing `/cv/+page.svelte` imports `CV_ENTRIES` + paraglide message keys. This is replaced:

**New `src/routes/cv/+page.server.ts`**:
```typescript
// Scan cv/variants/ at build time, parse each for title/subtitle
// Return list of { slug, title, subtitle } for the card grid
export async function load() {
  const variants = loadAllVariants(); // reads cv/variants/*.yaml
  return {
    entries: variants.map(v => ({
      resumeSlug: v.variant === 'general' ? 'resume' : `resume-${v.variant}`,
      careerSlug: v.variant === 'general' ? 'career' : `career-${v.variant}`,
      title: v.title,
      subtitle: v.subtitle
    }))
  };
}
```

**Updated `/cv/+page.svelte`**: Replaces `m[entry.titleKey]()` with `entry.title` from server data. `cv_page_title`, `cv_page_heading`, `cv_page_description` remain paraglide calls.

---

## Files to Delete

| File | Reason |
|------|--------|
| `cv/이력서.md` | Replaced by master.yaml |
| `cv/이력서_강사.md` | Replaced by master.yaml + instructor variant |
| `cv/이력서_프리랜서.md` | Replaced by master.yaml + freelancer variant |
| `cv/경력기술서.md` | Replaced by master.yaml details |
| `cv/경력기술서_toss.md` | Replaced by master.yaml + toss variant |
| `cv/resume_en.md` | English removed (future LLM translation) |
| `cv/resume-instructor_en.md` | English removed |
| `cv/career_en.md` | English removed |
| `cv/toss.css` | Replaced by themes/toss.yaml |
| `src/lib/components/ResumeSidebar.svelte` | Replaced by ResumeLayout.svelte |
| `src/lib/components/ResumeSidebarToss.svelte` | Replaced by ResumeLayout.svelte |

---

## Migration Path

1. Create `cv/master.yaml` from existing markdown + Svelte component data
2. Create variant configs and theme files
3. Build `ResumeLayout.svelte` and `CareerLayout.svelte`
4. Rewrite `+page.server.ts` to load YAML + filter
5. Update `+page.svelte` to route to new components
6. Create `/tailor` Claude Code skill
7. Verify all existing variants render identically
8. Delete old files
