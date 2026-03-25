import type { AnimCtx, GsapType, LenisInstance } from './types';
import { SELECTORS } from './selectors';

// ── Orb 애니메이션 상수 ────────────────────────────────────────────────────────
// 프리로더 로고 레이아웃 기준: 도트 중심 ≈ (8em, 8.1em) from viewport center
const ORB = {
	INIT_X: '8em',
	INIT_Y: '8.1em',
	TINY: '4.3em',
	FULL: '80vh',
	MIN: '45em'
} as const;

const HUD_INTRO = {
	duration: 1,
	ease: 'power1.out'
} as const;

const HERO_TEXT_BLOCK_INTRO = [
	{ selector: SELECTORS.heroTextBlock1, delay: 0, x: '10em' },
	{ selector: SELECTORS.heroTextBlock2, delay: 0.1, x: '-10em' },
	{ selector: SELECTORS.heroTextBlock3, delay: 0.2, x: '10em' }
] as const;

// ── 인터페이스 ─────────────────────────────────────────────────────────────────
export interface HeroIntroOptions extends AnimCtx {
	lenis: LenisInstance;
	fromPreloader: boolean;
	/** [hh-tb] 슬라이드인 완료 시 호출 — setupScrollTriggers 트리거 */
	onComplete: () => void;
}

// ── 내부 헬퍼 ─────────────────────────────────────────────────────────────────
function getOrbEls() {
	return {
		orb: document.querySelector<HTMLElement>(SELECTORS.orb),
		out1: document.querySelector<HTMLElement>(SELECTORS.orbOutline1),
		out2: document.querySelector<HTMLElement>(SELECTORS.orbOutline2)
	};
}

function animateHeroTextBlocks(
	gsap: GsapType,
	onComplete: () => void,
	baseDelay = 0
): void {
	HERO_TEXT_BLOCK_INTRO.forEach(({ selector, delay }, index) => {
		gsap.to(selector, {
			x: 0,
			delay: baseDelay + delay,
			duration: 1,
			ease: 'power2.inOut',
			onComplete: index === HERO_TEXT_BLOCK_INTRO.length - 1 ? onComplete : undefined
		});
	});
}

/**
 * outline ring 호흡 애니메이션.
 * Preloader.svelte(첫 방문)와 runHeroIntro(SPA nav) 양쪽에서 공유.
 * delay는 fill complete / SPA intro 시점 기준.
 */
export function animateOrbOutlineBreathing(
	gsap: GsapType,
	out1: HTMLElement,
	out2: HTMLElement | null,
): void {
	gsap.to(out1, {
		scale: 1.3, duration: 2, ease: 'power2.inOut', delay: 2,
		onComplete: () => { gsap.to(out1, { scale: 1.2, duration: 2, ease: 'power2.inOut' }); },
	});
	if (out2) {
		gsap.to(out2, {
			scale: 0.9, duration: 2.5, ease: 'power2.inOut', delay: 3,
			onComplete: () => { gsap.to(out1, { scale: 1.2, duration: 2, ease: 'power2.inOut' }); },
		});
	}
}

// ── 공개 API ──────────────────────────────────────────────────────────────────

/**
 * 모든 hero/HUD/orb 요소를 애니메이션 시작 전 숨김 상태로 설정.
 * onMount 진입 직후 즉시 실행 (GSAP set은 동기적).
 */
export function setHeroInitialState(gsap: GsapType): void {
	const { orb, out1, out2 } = getOrbEls();
	const allChars = document.querySelectorAll<HTMLElement>(SELECTORS.heroChars);

	if (allChars.length) gsap.set(allChars, { y: '-101%' });

	if (orb && document.documentElement.dataset.preloaderDone === 'true') {
		orb.classList.remove('is-pre');
		gsap.set(orb, {
			autoAlpha: 0,
			width: '0em', height: '0em',
			minHeight: 'auto', minWidth: 'auto',
			x: ORB.INIT_X, y: ORB.INIT_Y,
		});
	}
	if (out1) gsap.set(out1, { autoAlpha: 0, scale: 0 });
	if (out2) gsap.set(out2, { autoAlpha: 0, scale: 0 });

	// HUD — 프리로더 완료 시 GSAP이 slide-in
	gsap.set(SELECTORS.hudBrandLink, { y: '-101%', opacity: 0 });
	gsap.set(SELECTORS.hudScroll, { opacity: 0 });
	const hudMenuEl = document.querySelector<HTMLElement>(SELECTORS.hudMenu);
	if (hudMenuEl) gsap.set(hudMenuEl, { y: '101%', opacity: 0 });
}

/**
 * orb outline ring 상시 회전 시작.
 * autoAlpha:0 상태에서도 회전 중 → reveal 시 이미 회전하고 있음.
 */
export function startOrbRotation(gsap: GsapType): void {
	const { out1, out2 } = getOrbEls();
	if (out1) gsap.to(out1, { rotation:  360, duration: 100, repeat: -1, ease: 'none' });
	if (out2) gsap.to(out2, { rotation: -360, duration: 80,  repeat: -1, ease: 'none' });
}

/**
 * SPA 내비게이션(두 번째+ 방문) 시 [hh-tb] 블록을 오프스크린으로 설정.
 * 첫 방문은 Preloader.svelte > runOutro()에서 처리.
 */
export function setSpaInitialState(gsap: GsapType): void {
	HERO_TEXT_BLOCK_INTRO.forEach(({ selector, x }) => {
		gsap.set(selector, { x });
	});
}

/**
 * Hero 인트로 애니메이션.
 *
 * fromPreloader=true  (첫 방문): Preloader가 chars를 이미 y:0으로 올렸으므로
 *   [hh-tb] 슬라이드인만 실행.
 *
 * fromPreloader=false (SPA nav): orb 성장 → chars 등장 → [hh-tb] 슬라이드인
 *   전체 시퀀스를 직접 실행.
 */
export function runHeroIntro({ gsap, lenis, fromPreloader, onComplete }: HeroIntroOptions): void {
	// HUD 슬라이드인 (항상)
	const hudMenuEl = document.querySelector<HTMLElement>(SELECTORS.hudMenu);
	gsap.to(SELECTORS.hudBrandLink, { y: '0%', opacity: 1, ...HUD_INTRO });
	gsap.to(SELECTORS.hudScroll, { opacity: 1, ...HUD_INTRO });
	if (hudMenuEl) gsap.to(hudMenuEl, { y: '0%', opacity: 1, ...HUD_INTRO });

	if (fromPreloader) {
		// chars는 화면 밖(x:10em)에서 이미 y:-101%→0% 완료.
		// [hh-tb]를 x:10em→0으로 슬라이드인하여 텍스트 등장.
		animateHeroTextBlocks(gsap, () => {
			lenis.start();
			onComplete();
		});
		return;
	}

	// ── SPA nav: 전체 시퀀스 ────────────────────────────────────────────────
	const { orb, out1, out2 } = getOrbEls();

	if (orb) {
		// 초기 상태 확인 (orb가 이전 페이지에서 scroll path로 이동해 있을 수 있음)
		gsap.set(orb, {
			autoAlpha: 0, width: '0em', height: '0em', minHeight: 'auto', minWidth: 'auto',
		});
		// Phase 1 (0~1s): 프리로더 도트 위치(8em, 8.1em)에서 tiny dot 등장
		gsap.to(orb, { autoAlpha: 1, width: ORB.TINY, height: ORB.TINY, duration: 1 });
		// Phase 2 (delay:1, 1s): 중앙(0,0)으로 이동하며 full orb로 성장
		gsap.to(orb, {
			x: 0, y: 0,
			width: ORB.FULL, height: ORB.FULL, minHeight: ORB.MIN, minWidth: ORB.MIN,
			duration: 1, ease: 'power2.inOut', delay: 1,
		});
	}

	if (out1) {
		gsap.to(out1, { autoAlpha: 1, scale: 1, duration: 2, ease: 'power2.inOut' });
		animateOrbOutlineBreathing(gsap, out1, out2);
	}
	if (out2) {
		gsap.to(out2, { delay: 1, autoAlpha: 1, scale: 1, duration: 2, ease: 'power2.inOut' });
	}

	// chars: orb Phase2와 동시 (delay:1)
	gsap.to(SELECTORS.heroChars, {
		y: '0%', delay: 1, duration: 1, ease: 'power4.inOut',
		stagger: { each: 0.03, from: 'random' },
	});

	// [hh-tb]: chars 완료 후 순차 슬라이드인 (delay:2 / 2.1 / 2.2)
	animateHeroTextBlocks(gsap, () => {
		lenis.start();
		onComplete();
	}, 2);
}

/**
 * Hero 섹션 스크롤 아웃.
 * [hh-tb]가 좌측으로 드리프트, chars가 fade out.
 * Lenis.start() 이후에 호출.
 */
// ST는 이 함수에서 사용하지 않음 — AnimCtx 시그니처 일관성 유지를 위해 _ST로 명시
export function setupHeroScroll({ gsap, ST: _ST }: AnimCtx): void {
	const homeSection = document.querySelector<HTMLElement>(SELECTORS.homeHero);
	if (!homeSection) return;

	const trigger = { trigger: homeSection, start: 'top top', end: 'bottom top', scrub: true };

	([
		{ sel: SELECTORS.heroTextBlock1, x: '-20em' },
		{ sel: SELECTORS.heroTextBlock2, x: '-10em' },
		{ sel: SELECTORS.heroTextBlock3, x: '-5em' }
	] as const).forEach(({ sel, x }) => {
		gsap.to(sel, { x, ease: 'power2.out', scrollTrigger: trigger });
	});

	const chars = homeSection.querySelectorAll<HTMLElement>('[split-hero] .char');
	if (chars.length) {
		gsap.to(chars, {
			y: '101%', autoAlpha: 0,
			stagger: { each: 0.03, from: 'random' },
			scrollTrigger: trigger,
		});
	}
}