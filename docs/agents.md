# AGENTS.md — 애니메이션 시스템 가이드

AI 에이전트 및 개발자를 위한 코드베이스 문서.
원본 `itsoffbrand.com` 번들(`/tmp/ob_main.js`) 분석 기반.

---

## 1. 전역 스태킹 컨텍스트

```
z-index 체계 (낮을수록 뒤에 배치):
  .preloader        z-index: -5   (배경, 로딩 화면)
  .orb-w            z-index: -2   (orb 컨테이너, 고정)
  .orb              z-index: -1   (Three.js WebGL 구체)
  .page-w (없음)    z-index: 없음  (일반 흐름, orb 위에 렌더링)
  .hud-w            z-index: 1000 (항상 최상위 HUD)
```

**핵심**: preloader가 `-5`로 가장 뒤에 있어서, orb(`-1`)와 page content(z 없음)가
preloader 위에 보인다. → 로딩 중에도 hero 텍스트와 orb가 항상 visible.

---

## 2. Preloader 애니메이션 타임라인 (홈, 첫 방문)

`loaderDuration = 4s` (첫 방문) / `1s` (재방문, localStorage 'visited' 기준)

```
t = 0s      Preloader.svelte onMount
            ├─ SVG pathX(+자), pathC(원) 드로우인: 0→길이, 1s, power1.inOut
            ├─ [+page.svelte] orb 초기 set:
            │     autoAlpha:0, width:0, height:0
            │     x:8em, y:8.1em  ← SVG 도트 위치와 일치 (로고 20em 기준)
            ├─ orbOutline1,2: autoAlpha:0, scale:0
            ├─ orbOutline 회전 시작 (보이진 않음):
            │     outline1: rotation 360°, 100s, repeat:-1
            │     outline2: rotation -360°, 80s, repeat:-1
            └─ HUD 숨김: brand y:-101%, scroll opacity:0, menu y:101%

t = 0.5s    "build" 텍스트 chars 슬라이드인 (yPercent:101→0, 1s, power4.inOut)
            percent 카운터 0→100 시작 (loaderDuration 동안)
            fill 애니메이션 카운터 시작 (delay:1.5로 실제 시작은 t=2s)

t = 1.5s    fill(로고 채움) 시작: scaleY 0→1, loaderDuration, CustomEase

── fill 완료 (첫 방문: t ≈ 5.5s) ──────────────────────────────────────

t+0s  (= fill완료)
  orb Phase 1:  autoAlpha 0→1, width 0→4.3em, height 0→4.3em, 1s
                위치: translate(8em, 8.1em) 유지 → SVG 도트 위에서 성장
  orbOutline1:  scale 0→1, autoAlpha 0→1, 2s, power2.inOut
  "build" chars 사라짐: yPercent→-101, delay:0.5
  마스크 클립:   clipPath→inset(0%0%100%0%), delay:0.5, 0.8s
  SVG 언드로우: strokeDashoffset→길이, delay:0.5, 1s
  percent 사라짐: yPercent→100, delay:0.5
  hero chars 슬라이드인: y:-101%→0%, delay:1, 1s, power4.inOut

t+1s
  orb Phase 2:  x:8em→0, y:8.1em→0, width→80vh, height→80vh
                minH:45em, minW:45em, 1s, power2.inOut
                → orb가 dot 위치에서 화면 중앙으로 이동하며 확장
  orbOutline2:  scale 0→1, autoAlpha 0→1, delay:1, 2s

t+2s  ─── orb Phase 2 onComplete = preloader:done ──────────────────────

  ★ preloader:done 이벤트 dispatch
  preloader fade: autoAlpha→0, 0.2s
  HUD 슬라이드인 (hudUiAnimations):
    brand:  y→0%, 1s, power1.out
    scroll: opacity→1, 1s, power1.out  (delay 없음)
    menu:   y→0%, 1s, power1.out
  [hh-tb="1"]: from x:10em, delay:0, 1s
  [hh-tb="2"]: from x:-10em, delay:0.1, 1s
  [hh-tb="3"]: from x:10em, delay:0.2, 1s → onComplete: lenis.start() + setupScrollTriggers()

t+2s  (fill+2s 기준)
  orbOutline1 breathing: scale→1.3, 2s, power2.inOut, delay:2
    → onComplete: scale→1.2, 2s
  orbOutline2 breathing: scale→0.9, 2.5s, power2.inOut, delay:3
    → onComplete: orbOutline1 scale→1.2, 2s
```

---

## 3. 도트(pathC) → Orb 전환 메커니즘

**핵심 원리**: SVG의 원형 도트와 orb 요소가 동일한 화면 위치에서 시작.

```
ob-mask-wrap: 20em × 20em (중앙 정렬)
SVG viewBox: 0 0 162 162
pathC 중심: 약 (146, 146.5) in SVG coords

도트 위치 계산 (뷰포트 중심 기준):
  x = (146/162) × 20em - 10em = 18.02em - 10em = 8.02em
  y = (146.5/162) × 20em - 10em = 18.09em - 10em = 8.09em
  → ≈ translate(8em, 8.1em)  ✓

orb 초기 위치: x:8em, y:8.1em (= 뷰포트 중심에서 우하단 오프셋)
→ 도트와 시각적으로 겹침

전환 순서:
1. fill 완료 → SVG 도트는 delay:0.5s 후 사라짐 시작
2. 동시에 orb가 dot 위치(8em,8.1em)에서 0→4.3em 성장 (1s)
3. 1s 후 orb가 중앙(0,0)으로 이동하며 80vh로 확장 (1s)
→ "점이 orb로 변신해서 커지는" 효과
```

**주의**: `ob-mask-wrap`을 16em으로 줄이면 도트가 (6.4em, 6.5em)으로 이동
→ orb(8em, 8.1em)와 어긋나 전환이 부자연스러워짐.

---

## 4. 재방문 (localStorage 'visited' 있음)

페이지 새로고침 시 preloader가 다시 실행되지만 `loaderDuration = 1s` (빠름).
SPA 내비게이션 시 (`preloaderDone === 'true'`): preloader 스킵, `runHeroIntro` 직접 호출.

**`fromPreloader` 플래그**:

```
firstVisit (preloader:done 이벤트): fromPreloader = true
  → runHeroIntro에서 orb/orbOutline 애니메이션 스킵 (preloader가 이미 처리)
  → [hh-tb] tbDelay = 0

SPA nav (preloaderDone = 'true'): fromPreloader = false
  → runHeroIntro에서 orb Phase1+2 직접 실행
  → orbOutline reveal + breathing 직접 실행
  → [hh-tb] tbDelay = 1 (orb 애니메이션 기다림)
```

---

## 5. orbOutline 애니메이션

```
초기: autoAlpha:0, scale:0
회전: 항상 실행 (보이기 전부터)
  outline1: rotation +360°, 100s, repeat:-1 (시계방향)
  outline2: rotation -360°, 80s, repeat:-1 (반시계)

등장: fill complete (또는 runHeroIntro) 시
  outline1: scale 0→1, autoAlpha 0→1, 2s, power2.inOut
  outline2: scale 0→1, autoAlpha 0→1, 2s, power2.inOut, delay:1

breathing (순서대로, delay는 fill complete 기준):
  outline1 [delay:2]: scale→1.3, 2s → onComplete scale→1.2, 2s
  outline2 [delay:3]: scale→0.9, 2.5s → onComplete outline1 scale→1.2, 2s
```

**주의**: breathing onComplete에서 `orbOutline1` (outline1)을 둘 다 참조.
outline2 breathing 완료 후에도 outline1을 1.2로 맞추는 것이 원본 동작.

---

## 6. 주요 파일 역할

| 파일               | 역할                                                                         |
| ------------------ | ---------------------------------------------------------------------------- |
| `+layout.svelte`   | Preloader, HUD, Orb, Cursor 마운트. preloaderDone Svelte state 관리          |
| `+layout.css`      | orb/preloader CSS. z-index 체계. 폰트 크기(`1.0582vw`).                      |
| `Preloader.svelte` | 로딩 애니메이션 전체. fill → runOutro → orb+outline 전환                     |
| `+page.svelte`     | 홈 페이지 애니메이션 오케스트레이션. preloader:done 수신. ScrollTrigger 설정 |
| `Orb.svelte`       | Three.js WebGL 구체 렌더링                                                   |

---

## 7. CSS em 단위 체계

```css
body {
	font-size: 1.0582010582010584vw;
}
/* 1em ≈ 1vw (1920px 기준: 1em = 20.32px) */
```

모든 크기, 간격, 위치가 em 단위 → 뷰포트 비례 스케일링.

---

## 8. 절대 건드리면 안 되는 것들

1. `ob-mask-wrap` 크기: **20em × 20em** 고정 (도트-orb 정렬 근거)
2. orb 초기 transform: **x:8em, y:8.1em** (SVG pathC 위치와 계산된 값)
3. preloader z-index: **-5** (orb/page content가 preloader 위에 보여야 함)
4. `preloader:done` 이벤트 타이밍: orb Phase 2 onComplete에서만 dispatch
5. orbOutline 회전: `repeat:-1`로 무한 회전 (보이지 않아도 항상 실행)

---

## 9. 알려진 미구현 사항

| 항목                             | 원본 동작                 | 현재 상태                          |
| -------------------------------- | ------------------------- | ---------------------------------- |
| `.hcs-item-w` 초기 숨김 + reveal | fill+1s에 slide up reveal | 미구현 (이전 시도에서 섹션 사라짐) |
| `.hud-nav-w .hud-nav-flex`       | HUD 내 nav flex 숨김/등장 | 원본과 HUD 구조 다름               |
| `.hud-menu-bg` GSAP 제어         | y:101%→0% slide in        | CSS class toggle로 대체            |
| 모바일 분기 (`isTabletOrBelow`)  | 별도 애니메이션 값        | 데스크탑 기준만 구현               |

---

## 10. 개발 팁

**Preloader 빠르게 테스트**: `localStorage.removeItem('visited')` 후 새로고침 → 4s 모드.

**애니메이션 건너뛰기**: `sessionStorage.setItem('preloaderHasRun', 'true')` 후 새로고침
→ 원본에서는 preloader 건너뜀 (현재 구현에서는 loaderDuration만 1s로 줄어듦).

**orb 위치 확인**: `document.querySelector('[data-orb]').style.transform` 콘솔 확인.

**스택 순서 확인**: `.preloader`, `.orb-w`, `.page-w`의 `getComputedStyle(el).zIndex`.

---

## 11. 브라우저 테스트

프론트엔드 개발 시 세 가지 도구를 조합하여 브라우저 테스트를 수행한다.

### 도구 구성

| 도구                                                          | 역할                                             | 설치                                                                  |
| ------------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------- |
| [Agent-Browser](https://github.com/vercel-labs/agent-browser) | AI 에이전트용 브라우저 자동화 CLI                | `npm i -g agent-browser`                                              |
| [Lightpanda](https://github.com/lightpanda-io/browser)        | 초경량 헤드리스 브라우저 (Chrome 대비 11배 빠름) | [nightly 바이너리](https://github.com/lightpanda-io/browser/releases) |
| [Agentation](https://agentation.dev/)                         | UI 어노테이션 → 구조화된 피드백 (MCP 연동)       | `npm i agentation`                                                    |

### 기본 엔진: Lightpanda

Agent-Browser는 기본적으로 **Lightpanda 엔진**을 사용한다.

```bash
# 환경변수로 기본 설정 (셸 프로필에 추가)
export AGENT_BROWSER_ENGINE=lightpanda

# 사용 예시
agent-browser open https://localhost:5173
agent-browser snapshot
agent-browser click @e2
agent-browser fill @e5 "검색어"
```

### Chrome 엔진이 필요한 경우

Lightpanda는 픽셀 렌더링이 없으므로, 다음 상황에서만 Chrome으로 전환한다:

- **스크린샷 촬영** 필요 시
- **시각적 레이아웃/스타일 검증** (색상, 폰트, 간격 등)
- **브라우저 확장** 테스트
- **WebGL/Canvas** 렌더링 확인 (Orb 등 Three.js 요소)

```bash
# Chrome 엔진 명시 전환
agent-browser --engine chrome open https://localhost:5173
agent-browser --engine chrome screenshot
```

### 수동 CDP 연결 (필요 시)

```bash
# Lightpanda CDP 서버 직접 실행
lightpanda serve --host 127.0.0.1 --port 9222

# Agent-Browser에서 연결
agent-browser --cdp ws://localhost:9222 open https://localhost:5173
```

### 테스트 워크플로우

```
1. Agentation으로 UI 문제 발견 → 구조화된 피드백 (셀렉터, 컴포넌트 트리) 생성
2. Claude Code가 코드 수정
3. Agent-Browser (Lightpanda) 로 DOM/접근성/인터랙션 검증
4. 시각적 확인 필요 시 Agent-Browser (Chrome) 로 스크린샷 검증
```

### 테스트 대상 체크리스트

- [ ] Preloader 타임라인: 첫 방문(4s) / 재방문(1s) 정상 동작
- [ ] 도트 → Orb 전환: 위치(8em, 8.1em) 정렬 확인
- [ ] HUD 슬라이드인: brand, scroll, menu 순서
- [ ] ScrollTrigger: lenis.start() 후 스크롤 애니메이션 작동
- [ ] 반응형: 주요 브레이크포인트에서 레이아웃 확인 (Chrome 필요)
- [ ] Orb WebGL 렌더링 (Chrome 필요)
