# Split layout.css into Role-Based CSS Modules

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the 524-line layout.css monolith into 4 focused CSS modules, keeping base styles + `@theme` in layout.css as the entry point — without changing any visual output.

**Architecture:** layout.css retains `@theme` (must stay in root CSS for Tailwind v4 Vite plugin) and base styles, while feature-specific CSS is extracted into `styles/` modules. Each extracted file owns one concern: preloader, orb, or animation/FOUC. A separate `theme.css` holds `:root` aliases and semantic color vars.

**Tech Stack:** CSS, Tailwind CSS v4 (`@theme`, `@layer`, `@import 'tailwindcss'`), `@tailwindcss/vite`, Playwright for UI verification.

**UI verification baseline (must match after every task):**
```
htmlBg: rgb(229, 228, 224)
bodyBg: rgba(0, 0, 0, 0)
orbOpacity: 1
orbWidth: 914.281px
hudOpacity: 1
charCount: 33
textColor: rgb(29, 29, 29)
preloader: REMOVED (after animation completes)
--text-color CSS var must resolve (not empty string)
```

---

## File Structure

| File | Responsibility | Lines (approx) |
|------|---------------|-----------------|
| `src/routes/layout.css` | Entry point: font import, `@import 'tailwindcss'`, `@theme` block, `@import` for each module, base styles (reset, body, dark/light bg, selection, cursor, layout classes, typography, buttons, `.eb-wrap`, `.mbm-diff`, `.page-w`, `.page-wipe-w`) | ~210 |
| `src/routes/styles/theme.css` | `:root` aliases + `html.dark`/`html.light` semantic vars (NOT `@theme` — that stays in layout.css) | ~55 |
| `src/routes/styles/preloader.css` | `.preloader`, `.ob-fill-mask`, `.ob-fill-fill`, `.pre-svg-path` + dark/light variants | ~50 |
| `src/routes/styles/orb.css` | `.orb-w`, `.orb`, `.orb canvas`, `.orb-outline-*`, `will-change` declarations, global `canvas` element styles | ~65 |
| `src/routes/styles/animation.css` | SplitType (`.word`, `.char`, `.line`), FOUC prevention (HUD initial hide, `[hh-tb]` offsets), `[pointer-none]`, `[pointer-auto]` | ~45 |

**Import order in layout.css:**
```css
@import url('...DM+Sans...');
@import 'tailwindcss';
/* @theme { ... } stays here — required by @tailwindcss/vite */
@import './styles/theme.css';
@import './styles/preloader.css';
@import './styles/orb.css';
@import './styles/animation.css';
/* Base styles follow inline below */
```

> **Critical:** `@theme` MUST stay in layout.css (the root CSS file containing `@import 'tailwindcss'`). Tailwind v4's Vite plugin only processes `@theme` directives in the root file. Moving it to an imported file would break all Tailwind utility classes.

> **Note:** Line numbers in tasks refer to the file state at the START of that task, not the original file. Match by section comment markers, not line numbers.

---

### Task 1: Create theme.css — extract :root aliases and semantic vars

**Files:**
- Create: `src/routes/styles/theme.css`
- Modify: `src/routes/layout.css` (remove `:root` block and semantic var blocks; add `@import`)

**`@theme` stays in layout.css.** Only `:root` aliases and semantic color vars move.

- [ ] **Step 1: Create `src/routes/styles/theme.css`**

Move from layout.css:
- `:root { ... }` block (aliases + grey values + animation tokens + z-index + perspective)
- `html.dark { --text-color, --bg-color, --border-color }` + `html.light { ... }` semantic vars

```css
/* =============================================
   CSS Variables — :root aliases & semantic tokens
   @theme is in layout.css (required by Tailwind v4 Vite plugin)
   ============================================= */

:root {
	/* ── 색상 aliases (@theme → legacy name) ── */
	--main-dark: var(--color-main-dark);
	--main-dark-alt: var(--color-main-dark-alt);
	--main-light: var(--color-main-light);
	--main-light-alt: var(--color-main-light-alt);
	--primary-color: var(--color-primary);

	/* 회색 (투명도 기반 — @theme에 없음) */
	--dark-grey: rgba(218, 218, 218, 0.2);
	--dark-grey60: rgba(218, 218, 218, 0.6);
	--light-grey: rgba(111, 111, 111, 0.2);
	--light-grey60: rgba(111, 111, 111, 0.6);
	--grey-rotate: #bfbebe;

	/* ── Border Radius aliases ── */
	--large-radius: var(--radius-lg);
	--med-radius: var(--radius-md);
	--small-radius: var(--radius-sm);

	/* ── 타이포그래피 aliases ── */
	--fs-h-a: var(--font-size-h-a);
	--fs-h-b: var(--font-size-h-b);
	--fs-h-c: var(--font-size-h-c);
	--fs-eyebrow: var(--font-size-eyebrow);
	--fs-small: var(--font-size-sm);
	--fs-mini: var(--font-size-mini);

	/* 애니메이션 토큰 */
	--ease-smooth: cubic-bezier(0.38, 0.005, 0.215, 1);
	--dur-fast: 0.3s;
	--dur-med: 0.6s;

	/* z-index 스케일 */
	--z-preloader: 5000;
	--z-orb-wrapper: -2;
	--z-orb-canvas: -1;
	--z-orb-outline: -2;
	--z-hud: 1000;
	--z-cursor: 2000;
	--z-page-wipe: 9000;

	/* 3D */
	--perspective: 4000px;
}

/* ── Semantic color vars (dark/light mode) ── */
html.dark {
	--text-color: var(--main-light);
	--bg-color: var(--main-dark);
	--border-color: rgba(218, 218, 218, 0.2);
}
html.light {
	--text-color: var(--main-dark);
	--bg-color: var(--main-light);
	--border-color: rgba(111, 111, 111, 0.2);
}
```

- [ ] **Step 2: Update layout.css — remove extracted content, add import**

Add `@import './styles/theme.css';` after `@theme` block. Remove `:root { ... }` and `html.dark/html.light` semantic var blocks.

- [ ] **Step 3: Verify UI with Playwright**

Navigate to `http://localhost:5174/`, wait 8s, evaluate:
- All baseline computed values match
- `getComputedStyle(document.documentElement).getPropertyValue('--text-color')` resolves (not empty)

- [ ] **Step 4: Commit**

```bash
git add src/routes/styles/theme.css src/routes/layout.css
git commit -m "refactor: extract theme.css — :root aliases, semantic vars"
```

---

### Task 2: Create preloader.css — extract preloader styles

**Files:**
- Create: `src/routes/styles/preloader.css`
- Modify: `src/routes/layout.css` (remove Preloader section; add `@import`)

- [ ] **Step 1: Create `src/routes/styles/preloader.css`**

Move the entire "Preloader" section: `.preloader`, `html.dark .preloader`, `.ob-fill-mask`, `html.dark/light .ob-fill-fill`, `.pre-svg-path`, `html.dark/light .pre-svg-path`.

- [ ] **Step 2: Update layout.css — remove extracted content, add import**

- [ ] **Step 3: Verify UI with Playwright**

- [ ] **Step 4: Commit**

```bash
git add src/routes/styles/preloader.css src/routes/layout.css
git commit -m "refactor: extract preloader.css — preloader, fill mask, SVG paths"
```

---

### Task 3: Create orb.css — extract orb and outline styles

**Files:**
- Create: `src/routes/styles/orb.css`
- Modify: `src/routes/layout.css` (remove orb section + global canvas; add `@import`)

- [ ] **Step 1: Create `src/routes/styles/orb.css`**

Move:
- `will-change` declarations (`[data-orb]`, `[orb-out-w]`, `[orb-outline]`, `[data-cursor]`)
- `.orb-w`, `.orb`, `.orb canvas`
- `.orb-outline-w`, `.orb-outline-w.is-2`, `.orb-outline-r`, `.orb-outline`
- Global `canvas { display: block; border-radius: 50%; ... }`

- [ ] **Step 2: Update layout.css — remove extracted content, add import**

- [ ] **Step 3: Verify UI with Playwright**

Orb opacity=1 and orbWidth=914px are the critical checks.

- [ ] **Step 4: Commit**

```bash
git add src/routes/styles/orb.css src/routes/layout.css
git commit -m "refactor: extract orb.css — orb, outlines, canvas, will-change"
```

---

### Task 4: Create animation.css — extract animation/FOUC styles

**Files:**
- Create: `src/routes/styles/animation.css`
- Modify: `src/routes/layout.css` (remove SplitType, FOUC, pointer sections; add `@import`)

- [ ] **Step 1: Create `src/routes/styles/animation.css`**

Move:
- `[pointer-none]`, `[pointer-auto]`
- SplitType styles (`.word`, `.char`, `.line`)
- FOUC prevention: HUD initial hide (`.hud-brand-w [data-hud-brand]`, `[data-hud-scroll]`, `.hud-menu-o [data-hud-menu]`)
- Hero text block offsets (`[hh-tb='1']`, `[hh-tb='3']` → translateX(10em), `[hh-tb='2']` → translateX(-10em))

- [ ] **Step 2: Update layout.css — remove extracted content, add import**

- [ ] **Step 3: Verify UI with Playwright**

charCount=33 and hudOpacity=1 are the critical checks.

- [ ] **Step 4: Commit**

```bash
git add src/routes/styles/animation.css src/routes/layout.css
git commit -m "refactor: extract animation.css — SplitType, FOUC prevention, pointer utils"
```

---

### Task 5: Clean up layout.css — finalize as entry point + base styles

**Files:**
- Modify: `src/routes/layout.css`

- [ ] **Step 1: Verify remaining layout.css contents**

After Tasks 1–4, layout.css should contain only:
1. Font import (`@import url(...)`)
2. `@import 'tailwindcss'`
3. `@theme { ... }` block
4. 4x `@import './styles/...'` statements
5. Remaining base styles:
   - Reset (`html`, `*`, `body`, `a`)
   - Dark/light mode body background/color
   - `::selection` + `html.light ::selection`
   - Cursor: `a, button, [data-cursor-hover] { cursor: none }`
   - Layout (`.s`, `.c`, `.grid-main`, `.spacer-*`)
   - Typography (`@layer components { .h-a ... }`, `@layer utilities { .caps, .op-60 }`)
   - `.mbm-diff` (strip `:global()` wrapper — plain CSS files are global by default)
   - `.eb-wrap`, `.eb-wrap.is-sticky`
   - Buttons (`.btn-w`, `.btn-w:hover`, `.btn-inner`, `.btn-txt`, `.btn-icon-w`)
   - `.h-eyebrow.is--outline`
   - `.page-w`, `.page-wipe-w`

- [ ] **Step 2: Strip `:global()` from `.mbm-diff`**

Change `:global(.mbm-diff) { ... }` to `.mbm-diff { ... }` — `:global()` is Svelte-only syntax, unnecessary in plain CSS imports.

- [ ] **Step 3: Add clear section comments to remaining base styles**

- [ ] **Step 4: Full UI verification with Playwright**

Navigate fresh, wait for preloader complete, check ALL baseline values.

- [ ] **Step 5: Commit**

```bash
git add src/routes/layout.css
git commit -m "refactor: finalize layout.css as entry point + base styles"
```
