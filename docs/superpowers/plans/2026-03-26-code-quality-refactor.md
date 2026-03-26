# 포트폴리오 코드 품질 리팩토링 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 애니메이션 타이밍 커플링 해소, 네이밍 정렬, dead code 제거, Tailwind 반복 패턴 정리

**Architecture:** 애니메이션 phase 타이밍을 config.ts에 명시적 상수로 올려 single source of truth 확보. CSS FOUC 방지값과 GSAP set의 이중 초기화를 정리. 컴포넌트/데이터 파일명을 실제 용도에 맞게 리네이밍. `@utility` 디렉티브로 반복 패턴 추출.

**Tech Stack:** SvelteKit, GSAP, Tailwind CSS v4, TypeScript

**Verification:** 각 Task 완료 후 `pnpm build` 성공 확인. 브라우저에서 preloader→orb→HUD→hero 시퀀스 동작 확인.

---

## File Map

### 수정 파일
| 파일 | 변경 내용 |
|------|-----------|
| `src/lib/animations/config.ts` | phase duration 상수 추가, HSC 상수 제거 |
| `src/lib/animations/hero.ts` | 하드코딩 타이밍→상수 교체, deprecated 함수 제거, console.log 제거 |
| `src/lib/components/Preloader.svelte` | 하드코딩 `2`→`ORB_INTRO_TOTAL` 교체, console.log 제거 |
| `src/lib/components/HomeHero.svelte` | FOUC 값에 config 참조 주석 |
| `src/lib/components/HUD.svelte` | FOUC 값에 config 참조 주석 |
| `src/routes/(portfolio)/+page.svelte` | import 경로 업데이트 (리네이밍 반영) |
| `src/lib/data/clients.ts` → `src/lib/data/oss.ts` | 파일명 변경 |
| `src/lib/data/awards.ts` → `src/lib/data/experience.ts` | 파일명 변경 |
| `src/lib/components/HomeClients.svelte` → `src/lib/components/HomeOSS.svelte` | 파일명 변경 |
| `src/lib/components/HomeAwards.svelte` → `src/lib/components/HomeExperience.svelte` | 파일명 변경 |
| `src/app.d.ts` | HSC 관련 속성 선언 제거 |
| `src/routes/layout.css` | `@utility overlay-text` 추가 |

### 삭제 파일
| 파일 | 이유 |
|------|------|
| `src/lib/animations/hsc.ts` | +page.svelte에서 이미 제거됨, dead code |
| `src/lib/components/HomeHSC.svelte` | +page.svelte에서 이미 제거됨, dead code |

---

## Task 1: Dead code 제거

**Files:**
- Delete: `src/lib/animations/hsc.ts`
- Delete: `src/lib/components/HomeHSC.svelte`
- Modify: `src/lib/animations/config.ts` — `HSC` 상수 제거
- Modify: `src/app.d.ts` — `hsc-*` 속성 선언 제거
- Modify: `src/lib/animations/hero.ts` — deprecated 함수 3개 제거, console.log 제거
- Modify: `src/lib/components/Preloader.svelte` — console.log 제거

- [ ] **Step 1: hsc.ts, HomeHSC.svelte 삭제**

```bash
rm src/lib/animations/hsc.ts src/lib/components/HomeHSC.svelte
```

- [ ] **Step 2: config.ts에서 HSC 상수 블록 제거**

`config.ts`에서 아래 블록 삭제 (lines 162–175):
```ts
// ── HSC (Logo Reveal Scroll) ───────────────────────────────────────────────────
export const HSC = { ... } as const;
```

- [ ] **Step 3: app.d.ts에서 HSC 속성 선언 제거**

`app.d.ts`에서 아래 줄 삭제:
```ts
// SVGAttributes 내부:
'hsc-scale'?: boolean | string;

// HTMLAttributes 내부:
'hsc-track'?: boolean | string;
'hsc-scale'?: boolean | string;
'hsc-img'?: boolean | string;
'hsc-rotate'?: boolean | string;
'hsc-text'?: boolean | string;
```

원본 사이트에서 유래했으나 현재 사용하지 않는 속성도 같이 제거:
```ts
'work-hero'?: boolean | string;
'home-vid'?: boolean | string;
'gradient-evolve'?: boolean | string;
'scale-up-feature'?: string;
'about-line'?: boolean | string;
'about-line-section'?: boolean | string;
'ent-vid'?: string;
'ent-video-showreel'?: boolean | string;
'data-start'?: string;
```

- [ ] **Step 4: hero.ts에서 deprecated 함수 제거**

`hero.ts` 맨 아래 삭제 (lines 343–363):
```ts
// ── Deprecated (하위 호환) ────────────────────────────────────────────────────
/** @deprecated Use buildHudIntro instead */
export function playHudIntro(...) { ... }
/** @deprecated Use buildOrbHeroIntro instead */
export function playOrbHeroIntro(...) { ... }
/** @deprecated Use buildOrbOutlineBreathing instead */
export function animateOrbOutlineBreathing(...) { ... }
```

- [ ] **Step 5: hero.ts에서 console.log 전부 제거**

삭제할 줄:
- `console.log('[buildOrbHeroIntro] called, ...')`  (line 124)
- `console.log('[buildOrbHeroIntro] Setting orb initial state...')` (line 129)
- `onStart: () => console.log('[orb Phase1] started')` (line 151)
- `onComplete: () => console.log('[orb Phase1] complete')` (line 152)
- `onStart: () => console.log('[orb Phase2] started')` (line 192)
- `onComplete: () => console.log('[orb Phase2] complete, ...')` (line 193)
- `console.log('[setHeroInitialState] preloaderDone:', ...)` (line 237)

`onStart`/`onComplete` 콜백이 console.log만 하는 경우 → 프로퍼티 자체를 삭제.

또한 `setHeroInitialState` 내 `orb.classList.remove('is-pre')` 도 삭제 — `is-pre` 클래스는 CSS/템플릿 어디에서도 적용되지 않는 dead code.

- [ ] **Step 6: Preloader.svelte에서 console.log 제거**

삭제할 줄:
- `console.log('[Preloader runOutro] starting')` (line 109)

- [ ] **Step 6b: +page.svelte에서 console.log 제거**

삭제할 줄:
- `console.log('[+page.svelte] runIntroAndStartScroll, fromPreloader:', fromPreloader)` (line 74)

- [ ] **Step 7: 빌드 확인**

```bash
pnpm build
```

Expected: 성공

- [ ] **Step 8: 커밋**

```bash
git add -A
git commit -m "refactor: remove dead code (HSC, deprecated fns, debug logs)"
```

---

## Task 2: 애니메이션 phase 타이밍 중앙화

**핵심 문제:** Phase 1 duration(1s), Phase 2 duration(1s), total(2s)이 hero.ts, Preloader.svelte, +page.svelte에 하드코딩되어 있음. 하나를 바꾸면 다른 곳이 깨짐.

**Files:**
- Modify: `src/lib/animations/config.ts` — `ORB_PHASES` 상수 추가
- Modify: `src/lib/animations/hero.ts` — 하드코딩 `1`, `2` → 상수 참조
- Modify: `src/lib/components/Preloader.svelte` — 하드코딩 `2` → 상수 참조

- [ ] **Step 1: config.ts에 phase 타이밍 상수 추가**

`ORB` 상수 바로 아래에 추가:

```ts
/** Orb 인트로 phase 타이밍 — hero.ts, Preloader.svelte 모두 이 값 참조 */
export const ORB_PHASES = {
	/** Phase 1: 도트 위치에서 tiny orb 성장 */
	phase1: 1,
	/** Phase 2: 중앙 이동 + full size 확장 */
	phase2: 1,
	phase2Ease: 'power2.inOut',
} as const;

/** Phase 1 + Phase 2 합산 — Preloader와 hero에서 "orb 인트로 완료" 시점으로 사용 */
export const ORB_INTRO_TOTAL = ORB_PHASES.phase1 + ORB_PHASES.phase2;
```

**Note:** 아래 코드 스니펫은 Task 1 (dead code 제거) 완료 후 상태 기준. console.log/onStart/onComplete 콜백은 이미 제거된 상태.

- [ ] **Step 2: hero.ts — buildOrbHeroIntro 내 하드코딩 교체**

import에 추가:
```ts
import { ORB_PHASES, ORB_INTRO_TOTAL } from './config';
```

`buildOrbHeroIntro` 함수 내부:

Phase 1 → `duration: 1` 을 `duration: ORB_PHASES.phase1` 으로 (2곳: fromDotPosition true/false)

Phase 2 timeline position → `, 1)` 을 `, ORB_PHASES.phase1)` 으로:
```ts
// Phase 2 (phase1 완료 후)
tl.to(orb, {
    ...,
    duration: ORB_PHASES.phase2,
    ease: ORB_PHASES.phase2Ease,
}, ORB_PHASES.phase1);
```

outline2 reveal position → `, 1)` 을 `, ORB_PHASES.phase1)` 으로

hero chars position → `, 1)` 을 `, ORB_PHASES.phase1)` 으로

- [ ] **Step 3: hero.ts — runHeroIntro 내 하드코딩 교체**

SPA nav 분기에서 text blocks 시작 위치:
```ts
// 변경 전: tl.add(buildHeroTextBlocksIntro(gsap), 2);
tl.add(buildHeroTextBlocksIntro(gsap), ORB_INTRO_TOTAL);
```

- [ ] **Step 4: Preloader.svelte — 하드코딩 2 교체**

import에 추가:
```ts
import { ORB_INTRO_TOTAL } from '$lib/animations/config';
```

`runOutro` 함수 내부:
```ts
// 변경 전: orbIntroTl.call(() => { ... }, [], 2);
orbIntroTl.call(() => { ... }, [], ORB_INTRO_TOTAL);
```

- [ ] **Step 5: 빌드 확인**

```bash
pnpm build
```

- [ ] **Step 6: 커밋**

```bash
git add src/lib/animations/config.ts src/lib/animations/hero.ts src/lib/components/Preloader.svelte
git commit -m "refactor: centralize orb phase timing — single source of truth in config.ts"
```

---

## Task 3: FOUC 이중 초기화 정리

**핵심 문제:** HUD, HomeHero의 FOUC 방지 Tailwind 클래스와 `setHeroInitialState`의 `gsap.set()`이 같은 값을 이중으로 설정. 값이 어긋나면 깜빡임 발생.

**해결:** `setHeroInitialState`에서 CSS가 이미 처리한 프로퍼티는 gsap.set에서 제거. GSAP은 "animate from current state" 방식이므로 CSS 초기값을 그대로 읽으면 됨. 단, `autoAlpha`는 GSAP 전용이므로 유지.

**Files:**
- Modify: `src/lib/animations/hero.ts` — `setHeroInitialState`에서 중복 set 제거 + 주석 정리
- Modify: `src/lib/components/HomeHero.svelte` — config 참조 주석 추가
- Modify: `src/lib/components/HUD.svelte` — config 참조 주석 추가

- [ ] **Step 1: hero.ts — setHeroInitialState 정리**

HUD 초기 상태: CSS에서 `opacity-0 -translate-y-full` / `translate-y-full` 이미 적용됨.
GSAP은 `y`, `opacity`를 set할 필요 없이 현재 CSS 값을 읽음.

변경:
```ts
export function setHeroInitialState(gsap: GsapType): void {
	const { orb, out1, out2 } = getOrbEls();
	const allChars = document.querySelectorAll<HTMLElement>(SELECTORS.heroChars);

	if (allChars.length) gsap.set(allChars, { y: HERO_CHARS.hiddenY });

	if (orb && document.documentElement.dataset.preloaderDone === 'true') {
		gsap.set(orb, {
			autoAlpha: 0,
			width: '0em',
			height: '0em',
			minHeight: 'auto',
			minWidth: 'auto',
			x: ORB.INIT_X,
			y: ORB.INIT_Y
		});
	}
	if (out1) gsap.set(out1, { autoAlpha: 0, scale: 0 });
	if (out2) gsap.set(out2, { autoAlpha: 0, scale: 0 });

	// HUD — CSS 클래스가 FOUC 방지 초기상태를 처리함 (HUD.svelte 참조)
	// GSAP은 여기서 등록만 하면 animate시 현재 CSS 값에서 시작
}
```

HUD gsap.set 3줄 삭제:
```ts
// 삭제:
gsap.set(SELECTORS.hudBrandLink, { y: '-101%', opacity: 0 });
gsap.set(SELECTORS.hudScroll, { opacity: 0 });
if (hudMenuEl) gsap.set(hudMenuEl, { y: '101%', opacity: 0 });
```

- [ ] **Step 2: HomeHero.svelte — config 참조 주석 추가**

```svelte
<!-- FOUC 초기값: config.ts HERO_TEXT_BLOCK_OFFSETS[0].x 과 동기화 필수 -->
<div hh-tb="1" class="hh-transform will-change-transform translate-x-[10em]">
...
<!-- FOUC 초기값: config.ts HERO_TEXT_BLOCK_OFFSETS[1].x 과 동기화 필수 -->
<div hh-tb="2" class="hh-transform will-change-transform -translate-x-[10em]">
...
<!-- FOUC 초기값: config.ts HERO_TEXT_BLOCK_OFFSETS[2].x 과 동기화 필수 -->
<div hh-tb="3" class="hh-transform will-change-transform translate-x-[10em]">
```

- [ ] **Step 3: HUD.svelte — config 참조 주석 추가**

```svelte
<!-- FOUC: GSAP buildHudIntro가 y:0%, opacity:1 로 애니메이션 -->
<a ... class="... opacity-0 -translate-y-full">
...
<!-- FOUC: GSAP buildHudIntro가 opacity:1 로 애니메이션 -->
<div data-hud-scroll class="... opacity-0">
...
<!-- FOUC: GSAP buildHudIntro가 y:0%, opacity:1 로 애니메이션 -->
<button ... class="... opacity-0 translate-y-full">
```

- [ ] **Step 4: 빌드 확인**

```bash
pnpm build
```

- [ ] **Step 5: 커밋**

```bash
git add src/lib/animations/hero.ts src/lib/components/HomeHero.svelte src/lib/components/HUD.svelte
git commit -m "refactor: remove HUD double-init — CSS handles FOUC, GSAP reads current state"
```

---

## Task 4: 파일/컴포넌트 리네이밍

**핵심 문제:** OFF+BRAND 에이전시 시절 이름이 그대로 남아 있음.
- `awards.ts` (실제 경력 데이터) → `experience.ts`
- `clients.ts` (실제 OSS 프로젝트) → `oss.ts`
- `HomeAwards.svelte` → `HomeExperience.svelte`
- `HomeClients.svelte` → `HomeOSS.svelte`

**Files:**
- Rename: `src/lib/data/awards.ts` → `src/lib/data/experience.ts`
- Rename: `src/lib/data/clients.ts` → `src/lib/data/oss.ts`
- Rename: `src/lib/components/HomeAwards.svelte` → `src/lib/components/HomeExperience.svelte`
- Rename: `src/lib/components/HomeClients.svelte` → `src/lib/components/HomeOSS.svelte`
- Modify: `src/routes/(portfolio)/+page.svelte` — import 경로 업데이트

- [ ] **Step 1: 데이터 파일 리네이밍**

```bash
git mv src/lib/data/awards.ts src/lib/data/experience.ts
git mv src/lib/data/clients.ts src/lib/data/oss.ts
```

- [ ] **Step 2: 컴포넌트 파일 리네이밍**

```bash
git mv src/lib/components/HomeAwards.svelte src/lib/components/HomeExperience.svelte
git mv src/lib/components/HomeClients.svelte src/lib/components/HomeOSS.svelte
```

- [ ] **Step 3: import 경로 업데이트 — HomeExperience.svelte**

```svelte
// 변경 전: import { experiences } from '$lib/data/awards';
import { experiences } from '$lib/data/experience';
```

- [ ] **Step 4: import 경로 업데이트 — HomeOSS.svelte**

```svelte
// 변경 전: import { ossProjects } from '$lib/data/clients';
import { ossProjects } from '$lib/data/oss';
```

- [ ] **Step 5: import 경로 업데이트 — +page.svelte**

```ts
// 변경 전:
import HomeClients from '$lib/components/HomeClients.svelte';
import HomeAwards from '$lib/components/HomeAwards.svelte';
// 변경 후:
import HomeOSS from '$lib/components/HomeOSS.svelte';
import HomeExperience from '$lib/components/HomeExperience.svelte';
```

마크업:
```svelte
// 변경 전: <HomeClients /> ... <HomeAwards />
// 변경 후: <HomeOSS /> ... <HomeExperience />
```

- [ ] **Step 6: 빌드 확인**

```bash
pnpm build
```

- [ ] **Step 7: 커밋**

```bash
git add -A
git commit -m "refactor: rename components to match actual purpose — Awards→Experience, Clients→OSS"
```

---

## Task 5: Tailwind 반복 패턴 추출

**핵심 문제:** `mix-blend-difference text-main-light select-none` 조합이 3개 컴포넌트에서 10회 반복됨. 이 조합은 "orb 위에서 텍스트가 보이는" 디자인 패턴.

**Files:**
- Modify: `src/routes/layout.css` — `@utility overlay-text` 추가
- Modify: `src/lib/components/HomeMission.svelte` — 클래스 교체 (3곳)
- Modify: `src/lib/components/HomeGrid.svelte` — 클래스 교체 (1곳)
- Modify: `src/lib/components/HomeFooter.svelte` — 클래스 교체 (6곳)

- [ ] **Step 1: layout.css에 @utility 추가**

`SplitType 런타임 클래스` 섹션 바로 위에 추가:

```css
/* =============================================
   컴포넌트 유틸리티 — 반복 패턴 축약
   ============================================= */
@utility overlay-text {
	mix-blend-mode: difference;
	color: var(--color-main-light);
	user-select: none;
}
```

- [ ] **Step 2: HomeMission.svelte 교체**

3곳 모두:
```
mix-blend-difference text-main-light select-none → overlay-text
```

- [ ] **Step 3: HomeGrid.svelte 교체**

1곳:
```
mix-blend-difference text-main-light select-none → overlay-text
```

- [ ] **Step 4: HomeFooter.svelte 교체**

6곳 모두:
```
mix-blend-difference text-main-light select-none → overlay-text
```

- [ ] **Step 5: 빌드 확인**

```bash
pnpm build
```

- [ ] **Step 6: 커밋**

```bash
git add src/routes/layout.css src/lib/components/HomeMission.svelte src/lib/components/HomeGrid.svelte src/lib/components/HomeFooter.svelte
git commit -m "refactor: extract overlay-text @utility — replaces 10 instances of mix-blend-difference pattern"
```

---

## Task 6: app.d.ts 정리 — 미사용 커스텀 속성 제거

**Files:**
- Modify: `src/app.d.ts`

이 작업은 Task 1의 HSC 속성 제거에서 이미 일부 처리됨. 추가로 현재 코드베이스에서 사용하지 않는 원본 사이트 속성을 제거.

- [ ] **Step 1: 현재 사용 중인 속성만 남기기**

사용 중 (grep으로 확인된 것):
```
pointer-none, pointer-auto, home-hero, hh-tb, split-hero, split-text,
grid-anim, home-work, orb-out-w, orb-out-r, orb-outline,
data-orb, data-orb-wrap, stagger-scroll, stagger-lines, stagger-el,
stagger-text, btn-reveal, reveal-target, link-reveal, hover-anim,
mode-toggle, data-lenis-prevent, data-cursor-wrap, data-cursor,
data-cursor-hover, data-hide
```

미사용 (제거 대상):
```
work-hero, home-vid, gradient-evolve, scale-up-feature,
about-line, about-line-section, ent-vid, ent-video-showreel,
data-start, pre-text, pre-percent
```

SVGAttributes에서 `hsc-scale` 속성도 제거 (빈 인터페이스만 남으면 블록 자체 삭제).

- [ ] **Step 2: 빌드 확인**

```bash
pnpm build
```

- [ ] **Step 3: 커밋**

```bash
git add src/app.d.ts
git commit -m "refactor: clean up app.d.ts — remove unused custom attribute declarations"
```
