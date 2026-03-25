# CSS Architecture Redesign

포트폴리오와 CV 경로의 CSS를 구조적으로 분리하고, 중복 변수/print 스타일/!important 사용을 정리한다.

## 배경

현재 `layout.css`(549줄)가 포트폴리오 전용 스타일(em 스케일링, Orb, HUD, 다크/라이트 모드)과
공유 기반(Tailwind, 토큰)을 모두 포함. CV 경로가 이 CSS를 상속받아 `!important`로 덮어쓰고 있음.

### 핵심 문제

1. 루트 layout.css가 포트폴리오 전용인데 CV에도 적용됨
2. CV가 `!important`로 루트 스타일을 억제 (대증요법)
3. CSS 변수 이중 정의 (`@theme` vs `:root` 다른 이름으로 동일 값)
4. z-index 하드코딩 혼재 (일부 CSS 변수, 일부 매직 넘버)
5. print 스타일 4곳에 산재

## 설계

### 1. 레이아웃 구조 재편

**현재:**
```
+layout.svelte (루트)     → layout.css, HUD/Orb/Preloader/Cursor 마운트
(portfolio)/+layout.svelte → 빈 래퍼, layout.css 중복 import
cv/+layout.svelte          → cv.css + !important로 루트 스타일 덮어쓰기
```

**변경 후:**
```
+layout.svelte (루트)       → 최소: {@render children()} + Agentation(dev)
(portfolio)/+layout.svelte  → portfolio.css import, HUD/Orb/Preloader/Cursor 마운트
cv/+layout.svelte           → cv.css만 import, !important 없음
```

루트 레이아웃에서 (portfolio) 레이아웃으로 이동하는 것:
- Preloader, HUD, Orb, 오브 아웃라인 링, Cursor
- .page-wipe-w, .pagew-grid
- preloaderDone 상태 관리, preloader:done 이벤트
- 다크/라이트 모드 토글 로직

루트에 남는 것:
- `{@render children()}`
- Agentation (dev only)
- `+layout.ts`의 `prerender = true`

### 2. CSS 파일 분리

```
layout.css (549줄)
    ↓ 분해
base.css (~30줄)
├── @import 'tailwindcss'
├── @theme { --radius-*, --color-* }  (양쪽 공유 토큰, spacing 제외)
├── 폰트 import (Google Fonts DM Sans)
└── 최소 리셋 (a { color: inherit; text-decoration: none; })
    ⚠ body { cursor: none }, body { overflow: clip }은 포트폴리오 전용 — 여기 포함 금지

portfolio.css (~520줄, layout.css에서 rename)
├── @import './base.css'
├── @theme { --spacing: 0.25em; --font-size-* }  (em 기반, 포트폴리오 전용)
├── body { font-size: 1.0582vw; cursor: none; overflow: clip; }
├── :root { 포트폴리오 전용 변수 }
├── html.dark / html.light 모드
├── Preloader, Orb, HUD, page-wipe, cursor 스타일
├── 타이포그래피 클래스 (.h-a, .h-b, .h-eyebrow 등)
└── 유틸리티 ([pointer-none], .btn-w 등)

cv/cv.css (확장)
├── @import '../../routes/base.css'
├── 기존 @import 'tailwindcss' 제거 (base.css에서 가져옴)
├── body { background: #f0f1f3 }  (직접 선언, 충돌 없음)
├── .cv-root 기본 스타일 (cv/+layout.svelte <style>에서 이동)
├── .cv-markdown 화면용 타이포그래피 (cv/+layout.svelte <style>에서 이동)
└── @media print { 모든 print 스타일 통합 }
    ├── 공통: body 리셋, .no-print
    ├── .cv-markdown: career 모드 타이포
    └── .resume-page: shadow 제거, color-adjust 등
```

`@page` 분기(resume: margin:0, career: margin:18mm 20mm)는 CSS에서 조건부 적용이
불가능하므로, 각 모드의 `svelte:head` 인라인 `<style>`에 `@page`만 남긴다.

### 3. CSS 변수 통일

**이중 정의 제거:**
- `--fs-h-a` (`:root`) → `--font-size-h-a` (`@theme`)로 통일
- `--fs-h-b` → `--font-size-h-b`
- `--fs-h-c` → `--font-size-h-c`
- `--fs-eyebrow` → `--font-size-eyebrow`
- `--fs-small` → `--font-size-sm`
- `--fs-mini` → `--font-size-mini`
- `--main-dark` → `--color-main-dark`
- `--main-light` → `--color-main-light`
- `--large-radius` → `--radius-lg`
- `--med-radius` → `--radius-md`
- `--small-radius` → `--radius-sm`

**포트폴리오 전용 (portfolio.css `:root`에 유지):**
- `--dur-fast`, `--dur-med` (애니메이션 duration)
- `--ease-smooth` (커스텀 easing)
- `--z-*` (z-index 체계)
- `--perspective`
- `--text-color`, `--bg-color` (다크/라이트 모드 파생)

**참조 업데이트 대상:**
- HUD.svelte: `var(--fs-h-b)` → `var(--font-size-h-b)`, `var(--fs-small)` → `var(--font-size-sm)`
- HomeClients.svelte: `var(--fs-eyebrow)` → `var(--font-size-eyebrow)`
- HomeAwards.svelte: `var(--fs-h-c)`, `var(--fs-mini)` → @theme 이름
- HomeFooter.svelte: `var(--fs-eyebrow)` → `var(--font-size-eyebrow)`
- HomeHSC.svelte: `var(--main-dark)` → `var(--color-main-dark)` (2곳)
- portfolio.css 내부 참조 (~20곳+): `var(--main-dark)`, `var(--main-light)`, `var(--large-radius)`, `var(--fs-eyebrow)`, `var(--dur-fast)` 등
- portfolio.css `.btn-w`: `var(--large-radius)` → `var(--radius-lg)`, `var(--fs-eyebrow)` → `var(--font-size-eyebrow)`

### 4. z-index 정리

HUD 메뉴의 하드코딩 값을 CSS 변수로:
- `.hud-menu-o { z-index: 999 }` → `z-index: calc(var(--z-hud) - 1)`
- `.hud-menu-w { z-index: 1001 }` → `z-index: calc(var(--z-hud) + 1)`

### 5. print 스타일 통합

4곳 → cv.css 1곳 + svelte:head @page 분기:

**cv.css로 통합:**
- cv/+layout.svelte `{@html}` 중 body 리셋, .no-print, .cv-root print 오버라이드
- cv/cv.css 기존 .cv-markdown print 타이포
- ResumeLayout.svelte scoped print (shadow 제거, color-adjust)
- CareerLayout.svelte scoped print (break-before, orphans/widows)

**svelte:head에 남기는 것 (모드별 @page만):**
- resume: `@page { size: A4; margin: 0; }`
- career: `@page { size: A4; margin: 18mm 20mm; }`

## 변경 파일 목록

| 파일 | 변경 유형 |
|------|-----------|
| `src/routes/+layout.svelte` | 대폭 축소 (컴포넌트/로직 → portfolio 레이아웃으로 이동) |
| `src/routes/(portfolio)/+layout.svelte` | 대폭 확장 (포트폴리오 셸 역할 수용) |
| `src/routes/base.css` | 신규 (~30줄, 공유 Tailwind + 토큰) |
| `src/routes/layout.css` → `portfolio.css` | rename + base.css import 추가 |
| `src/routes/cv/+layout.svelte` | 축소 (`<style>` → cv.css, `!important` 제거) |
| `src/routes/cv/cv.css` | 확장 (print + 화면 스타일 통합) |
| `src/routes/cv/[slug]/+page.svelte` | `{@html}` 축소 (@page 분기만, 나머지 print → cv.css) |
| `src/routes/cv/[slug]/download/+page.svelte` | 동일 처리 (print 스타일 정리) |
| `src/lib/components/HUD.svelte` | z-index 하드코딩 → CSS 변수 |
| `src/lib/components/HomeClients.svelte` | CSS 변수 이름 통일 |
| `src/lib/components/HomeAwards.svelte` | CSS 변수 이름 통일 |
| `src/lib/components/HomeFooter.svelte` | CSS 변수 이름 통일 |
| `src/lib/components/HomeHSC.svelte` | `var(--main-dark)` → `var(--color-main-dark)` |
| `src/lib/components/ResumeLayout.svelte` | scoped print → cv.css 이동 |
| `src/lib/components/CareerLayout.svelte` | scoped print → cv.css 이동 |

## 건드리지 않는 것

- Orb.svelte 내부 (Three.js)
- Preloader.svelte 내부 (타임라인)
- Home* 컴포넌트 레이아웃/애니메이션 로직
- tokens.ts (JS 토큰 값 유지, 주석만 업데이트)
- GSAP 애니메이션 코드
- ob-mask-wrap 크기 (20em x 20em)
- orb 초기 transform (x:8em, y:8.1em)

## @theme 분리 상세

**base.css @theme** (양쪽 공유):
```css
@theme {
  --radius-lg: 6.25em;
  --radius-md: 1.375em;
  --radius-sm: 0.625em;
  --color-main-dark: #1d1d1d;
  --color-main-dark-alt: #252525;
  --color-main-light: #e5e4e0;
  --color-main-light-alt: #f1f0ec;
  --color-primary: #ff642f;
}
```

**portfolio.css @theme** (포트폴리오 전용):
```css
@theme {
  --spacing: 0.25em;
  --font-size-h-a: 6.75em;
  --font-size-h-b: 3.5em;
  --font-size-h-c: 1.8em;
  --font-size-eyebrow: 0.85em;
  --font-size-sm: 0.8em;
  --font-size-mini: 0.65em;
}
```

`--spacing: 0.25em`은 반드시 portfolio.css에만 위치해야 함.
CV는 Tailwind 기본 spacing(0.25rem)을 사용하므로 base.css에 spacing을 넣으면
CV의 모든 Tailwind spacing 유틸리티(px-8, py-12 등)가 em 기반으로 바뀌어 레이아웃이 깨짐.

## svelte:head에 남기는 것 (명확화)

cv/[slug]/+page.svelte와 cv/[slug]/download/+page.svelte의 `{@html}` 블록에서:

**남기는 것 (@page 분기만):**
- resume 모드: `@page { size: A4; margin: 0; }`
- career 모드: `@page { size: A4; margin: 18mm 20mm; }`

**cv.css로 이동하는 것:**
- `html, body { margin: 0; padding: 0; width: 210mm; height: 297mm; }` (resume print)
- `.cv-root:has(.resume-page) { padding: 0; margin: 0; max-width: none; }` (resume print)
- `body { background: #fff; margin: 0; }` (공통 print)
- `.no-print { display: none; }` (공통 print)

cv/+layout.svelte의 `{@html}` 블록도 동일하게 @page만 남기고 나머지는 cv.css로.

## 위험 요소

1. **preloader:done 이벤트**: `window.dispatchEvent`를 사용하므로 DOM 계층과 무관. 레이아웃 이동에 영향 없음 (위험도 낮음). 단, `orb.class.ts`가 `'preloader:done'` 문자열을 직접 사용 — INTRO_DONE_EVENT 상수로 통일 권장.
2. **Tailwind @import 체인**: base.css를 양쪽에서 import할 때 각 경로는 독립 진입점이므로 사용자가 동시에 두 경로를 방문하지 않는 한 문제 없음. cv.css의 기존 `@import 'tailwindcss'`는 반드시 제거.
3. **CSS 변수 rename**: portfolio.css 내부 ~20곳+, 컴포넌트 6개 파일. 일괄 변경 시 누락된 참조는 CSS가 조용히 실패하므로 빌드 후 시각적 검증 필수.
4. **print 스타일 이동**: scoped → global 이동 시 셀렉터 특이도가 낮아질 수 있음. cv.css에서 동일 셀렉터로 작성하되 특이도 테스트 필요.
5. **cv/+layout.svelte @reference**: 현재 `<style>` 블록에 `@reference "tailwindcss"` 사용 중. 스타일을 cv.css로 이동하면 이 directive도 정리 필요.
