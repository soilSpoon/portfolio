/**
 * 애니메이션 설정 상수.
 *
 * 각 파일에 흩어진 매직 넘버를 한 곳에 모아 유지보수성을 높인다.
 * 값 변경 시 이 파일만 수정하면 전체 애니메이션에 반영된다.
 */

// ── Orb ────────────────────────────────────────────────────────────────────────
/** 프리로더 로고 도트 기준 orb 초기 위치 및 크기 */
export const ORB = {
	/** 도트 중심 X offset (뷰포트 중심 기준) */
	INIT_X: '8em',
	/** 도트 중심 Y offset (뷰포트 중심 기준) */
	INIT_Y: '8.1em',
	/** Phase 1 작은 구체 크기 */
	TINY: '4.3em',
	/** Phase 2 풀사이즈 */
	FULL: '80vh',
	/** 풀사이즈 최소값 */
	MIN: '45em'
} as const;

// ── Orb Outline Breathing ──────────────────────────────────────────────────────
export const ORB_OUTLINE_BREATHING = {
	out1: { scale: 1.3, duration: 2, ease: 'power2.inOut', delay: 2 },
	out1Rest: { scale: 1.2, duration: 2, ease: 'power2.inOut' },
	out2: { scale: 0.9, duration: 2.5, ease: 'power2.inOut', delay: 3 }
} as const;

// ── Orb Outline Rotation ───────────────────────────────────────────────────────
export const ORB_ROTATION = {
	out1: { rotation: 360, duration: 100, repeat: -1, ease: 'none' as const },
	out2: { rotation: -360, duration: 80, repeat: -1, ease: 'none' as const }
} as const;

// ── Orb Outline Reveal ─────────────────────────────────────────────────────────
export const ORB_OUTLINE_REVEAL = {
	duration: 2,
	ease: 'power2.inOut'
} as const;

// ── HUD Intro ──────────────────────────────────────────────────────────────────
export const HUD_INTRO = {
	duration: 1,
	ease: 'power1.out'
} as const;

// ── Hero Text ──────────────────────────────────────────────────────────────────
export const HERO_CHARS = {
	/** 초기 숨김 위치 */
	hiddenY: '-101%',
	/** 등장 위치 */
	visibleY: '0%',
	/** 스크롤 퇴장 위치 */
	exitY: '101%',
	duration: 1,
	ease: 'power4.inOut',
	stagger: { each: 0.03, from: 'random' as const }
} as const;

/** [hh-tb] 블록 인트로 오프셋 및 딜레이 */
export const HERO_TEXT_BLOCK_OFFSETS = [
	{ delay: 0, x: '10em' },
	{ delay: 0.1, x: '-10em' },
	{ delay: 0.2, x: '10em' }
] as const;

export const HERO_TEXT_BLOCK_ANIM = {
	duration: 1,
	ease: 'power2.inOut'
} as const;

/** Hero 섹션 스크롤-아웃 시 [hh-tb] 드리프트 거리 */
export const HERO_SCROLL_DRIFT = [{ x: '-20em' }, { x: '-10em' }, { x: '-5em' }] as const;

// ── Preloader ──────────────────────────────────────────────────────────────────
export const PRELOADER = {
	/** 첫 방문 로딩 시간 */
	firstVisitDuration: 4,
	/** 재방문 로딩 시간 */
	returnVisitDuration: 1,
	/** fill 시작 딜레이 */
	fillDelay: 1.5,
	/** chars / percent 등장 딜레이 */
	charsDelay: 0.5,
	/** outro 요소 딜레이 */
	outroDelay: 0.5,
	/** 마스크 클립 duration */
	maskDuration: 0.8,
	/** preloader fade-out duration */
	fadeDuration: 0.2,
	/** SVG 드로우 duration */
	svgDrawDuration: 1,
	svgDrawEase: 'power1.inOut',
	/** CustomEase path */
	loadEasePath:
		'M0,0,C0,0,0.13,0.34,0.238,0.442,0.305,0.506,0.322,0.514,0.396,0.54,' +
		'0.478,0.568,0.468,0.56,0.522,0.584,0.572,0.606,0.61,0.719,0.714,0.826,' +
		'0.798,0.912,1,1,1,1'
} as const;

// ── Common Reveal ──────────────────────────────────────────────────────────────
export const COMMON_REVEAL = {
	words: {
		duration: 2,
		ease: 'power4.inOut',
		stagger: { each: 0.05, from: 'random' as const },
		scrollStart: '20% bottom'
	},
	lines: {
		duration: 2,
		ease: 'power4.inOut',
		stagger: { each: 0.05, from: 'start' as const },
		scrollStart: '20% bottom'
	},
	button: {
		duration: 1,
		ease: 'power1.out',
		scrollStart: '20% bottom'
	}
} as const;

// ── Grid ───────────────────────────────────────────────────────────────────────
export const GRID = {
	/** 3D fly-in z 범위 */
	zRange: [-6000, -100] as const,
	/** rotationX 범위 */
	rotXRange: [-65, -25] as const,
	/** scatter xPercent 범위 */
	xPercentRange: [-150, 150] as const,
	/** scatter yPercent 범위 */
	yPercentRange: [-300, 300] as const,
	/** 래퍼 축소 scale */
	wrapScale: 0.8,
	/** 래퍼 z 이동 */
	wrapZ: 6500,
	/** inner scale */
	innerScaleFrom: 2,
	innerScaleTo: 1,
	/** text font-size */
	textSizeInit: '3em',
	textSizeFrom: '1.2em',
	textSizeTo: '0.7em',
	/** grid item 초기 autoAlpha */
	initAlpha: 0.5,
	/** grid item 최종 autoAlpha (GSAP autoAlpha 범위: 0~1) */
	finalAlpha: 1,
	/** overlay words reveal */
	overlayWords: {
		duration: 2,
		ease: 'power4.inOut',
		stagger: { each: 0.05, from: 'random' as const }
	},
	/** overlay words exit */
	overlayWordsExit: {
		duration: 2,
		ease: 'power4.inOut',
		stagger: { each: 0.05, from: 'start' as const }
	}
} as const;

// ── Work (HomeWork) ────────────────────────────────────────────────────────────
export const WORK = {
	/** 홀수/짝수 카드 parallax 거리 */
	parallaxOdd: '-10em',
	parallaxEven: '10em',
	/** 데스크탑 최소 너비 */
	desktopMinWidth: 991,
	/** hover 시 word y offset */
	wordOffsetY: '0.75em',
	/** hover word stagger */
	enterStagger: 0.1,
	leaveStagger: 0.05
} as const;

// ── Orb Scroll Path ────────────────────────────────────────────────────────────
export const ORB_PATH = {
	body: [
		{ x: '50vw', scale: 2, duration: 0.15, ease: 'power2.out' },
		{ x: '-50vw', y: '-20vh', scale: 1.5, duration: 0.15, ease: 'power2.inOut' },
		{ x: '0vw', y: '50vh', scale: 0, duration: 0.05 },
		{ x: '0vw', scale: 0, duration: 0.025 },
		{ x: '0vw', y: '0vh', scale: 1, duration: 0.125 },
		{ x: '-25vw', y: '20vh', scale: 1.5, duration: 0.1 },
		{ x: '-60vw', y: '-75vh', scale: 0, ease: 'power1.out', duration: 0.05 },
		{ x: '0vw', y: '0vh', scale: 0, duration: 0.3 }
	],
	outline1: [
		{ x: '10vw', y: '0vh', scale: 1.2, duration: 0.15, overwrite: 'auto' as const },
		{ x: '-30vw', y: '0vh', scale: 1.3, duration: 0.15 },
		{ x: '0vw', y: '50vh', scale: 1, duration: 0.05 },
		{ x: '0vw', y: '50vh', scale: 0.8, duration: 0.025 },
		{ x: '0vw', y: '0vh', scale: 1, duration: 0.125 },
		{ x: '30vw', y: '-20vh', scale: 0.7, duration: 0.15 },
		{ x: '0vw', y: '0vh', scale: 1, duration: 0.05 },
		{ x: '0vw', y: '0vh', scale: 0, duration: 0.25 },
		{ x: '49vw', y: '0vh', scale: 1, duration: 0.05 }
	],
	outline2: [
		{ x: '25vw', y: '0vh', scale: 1.3, duration: 0.15, overwrite: 'auto' as const },
		{ x: '-9vw', y: '32vh', scale: 0.6, duration: 0.15 },
		{ x: '0vw', y: '50vh', scale: 1, duration: 0.05 },
		{ x: '0vw', y: '50vh', scale: 0.8, duration: 0.025 },
		{ x: '0vw', y: '0vh', scale: 1, duration: 0.125 },
		{ x: '0vw', y: '14vh', scale: 1.2, duration: 0.15 },
		{ x: '0vw', y: '0vh', scale: 0.6, duration: 0.05 },
		{ x: '0vw', y: '0vh', scale: 0, duration: 0.25 },
		{ x: '29vw', y: '0vh', scale: 1.5, duration: 0.05 }
	]
} as const;
