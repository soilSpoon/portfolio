import type { AnimCtx, GsapType } from './types';
import { SELECTORS } from './selectors';
import {
	ORB,
	ORB_OUTLINE_BREATHING,
	ORB_OUTLINE_REVEAL,
	ORB_ROTATION,
	HUD_INTRO,
	HERO_CHARS,
	HERO_TEXT_BLOCK_OFFSETS,
	HERO_TEXT_BLOCK_ANIM,
	HERO_SCROLL_DRIFT
} from './config';

// ── [hh-tb] 블록 정의 (selector + config 매핑) ─────────────────────────────────
const HERO_TEXT_BLOCK_INTRO = [
	{ selector: SELECTORS.heroTextBlock1, ...HERO_TEXT_BLOCK_OFFSETS[0] },
	{ selector: SELECTORS.heroTextBlock2, ...HERO_TEXT_BLOCK_OFFSETS[1] },
	{ selector: SELECTORS.heroTextBlock3, ...HERO_TEXT_BLOCK_OFFSETS[2] }
] as const;

// ── 내부 헬퍼 ─────────────────────────────────────────────────────────────────
export function getOrbEls() {
	return {
		orb: document.querySelector<HTMLElement>(SELECTORS.orb),
		out1: document.querySelector<HTMLElement>(SELECTORS.orbOutline1),
		out2: document.querySelector<HTMLElement>(SELECTORS.orbOutline2)
	};
}

// ── 타임라인 빌더 ─────────────────────────────────────────────────────────────

/**
 * HUD 슬라이드인 타임라인.
 * brand, scroll, menu가 동시에 등장.
 */
export function buildHudIntro(gsap: GsapType) {
	const hudMenuEl = document.querySelector<HTMLElement>(SELECTORS.hudMenu);
	const tl = gsap.timeline();

	tl.to(SELECTORS.hudBrandLink, { y: '0%', opacity: 1, ...HUD_INTRO }, 0)
		.to(SELECTORS.hudScroll, { opacity: 1, ...HUD_INTRO }, 0);

	if (hudMenuEl) {
		tl.to(hudMenuEl, { y: '0%', opacity: 1, ...HUD_INTRO }, 0);
	}

	return tl;
}

/**
 * [hh-tb] 텍스트 블록 슬라이드인 타임라인.
 * 각 블록이 순차적으로 x:0으로 이동.
 */
export function buildHeroTextBlocksIntro(gsap: GsapType) {
	const tl = gsap.timeline();

	HERO_TEXT_BLOCK_INTRO.forEach(({ selector, delay }) => {
		tl.to(
			selector,
			{
				x: 0,
				duration: HERO_TEXT_BLOCK_ANIM.duration,
				ease: HERO_TEXT_BLOCK_ANIM.ease
			},
			delay
		);
	});

	return tl;
}

/**
 * Orb outline 호흡 애니메이션 타임라인.
 * onComplete 중첩 대신 타임라인으로 시퀀스 정의.
 */
export function buildOrbOutlineBreathing(
	gsap: GsapType,
	out1: HTMLElement,
	out2: HTMLElement | null
) {
	const tl = gsap.timeline();

	// out1: scale 1 → 1.3 → 1.2
	tl.to(
		out1,
		{
			scale: ORB_OUTLINE_BREATHING.out1.scale,
			duration: ORB_OUTLINE_BREATHING.out1.duration,
			ease: ORB_OUTLINE_BREATHING.out1.ease
		},
		ORB_OUTLINE_BREATHING.out1.delay
	).to(out1, {
		scale: ORB_OUTLINE_BREATHING.out1Rest.scale,
		duration: ORB_OUTLINE_BREATHING.out1Rest.duration,
		ease: ORB_OUTLINE_BREATHING.out1Rest.ease
	});

	// out2: scale 1 → 0.9
	if (out2) {
		tl.to(
			out2,
			{
				scale: ORB_OUTLINE_BREATHING.out2.scale,
				duration: ORB_OUTLINE_BREATHING.out2.duration,
				ease: ORB_OUTLINE_BREATHING.out2.ease
			},
			ORB_OUTLINE_BREATHING.out2.delay
		);
	}

	return tl;
}

/**
 * Orb + Outline + Hero chars 인트로 타임라인.
 * 도트 위치(8em, 8.1em)에서 시작하여 중앙으로 확장.
 *
 * @param fromDotPosition - true면 도트 위치에서 시작 (Preloader), false면 중앙에서 시작 (SPA nav)
 */
export function buildOrbHeroIntro(gsap: GsapType, { fromDotPosition = true } = {}) {
	const { orb, out1, out2 } = getOrbEls();
	const tl = gsap.timeline();

	if (orb) {
		if (fromDotPosition) {
			// Preloader: 도트 위치(8em, 8.1em)에서 시작
			gsap.set(orb, {
				autoAlpha: 0,
				width: '0em',
				height: '0em',
				minHeight: 'auto',
				minWidth: 'auto',
				x: ORB.INIT_X,
				y: ORB.INIT_Y
			});

			// Phase 1 (0~1s): 도트 위치 유지하며 tiny dot 등장
			tl.to(
				orb,
				{
					autoAlpha: 1,
					x: ORB.INIT_X,
					y: ORB.INIT_Y,
					width: ORB.TINY,
					height: ORB.TINY,
					duration: 1
				},
				0
			);
		} else {
			// SPA nav: 중앙에서 시작
			gsap.set(orb, {
				autoAlpha: 0,
				width: '0em',
				height: '0em',
				minHeight: 'auto',
				minWidth: 'auto',
				x: 0,
				y: 0
			});

			// Phase 1 (0~1s): 중앙에서 tiny dot 등장
			tl.to(
				orb,
				{
					autoAlpha: 1,
					width: ORB.TINY,
					height: ORB.TINY,
					duration: 1
				},
				0
			);
		}

		// Phase 2 (1~2s): 중앙으로 이동하며 full orb로 확장
		tl.to(
			orb,
			{
				x: 0,
				y: 0,
				width: ORB.FULL,
				height: ORB.FULL,
				minHeight: ORB.MIN,
				minWidth: ORB.MIN,
				duration: 1,
				ease: 'power2.inOut'
			},
			1
		);
	}

	// Outline reveal (orb Phase 1과 동시 시작)
	if (out1) {
		tl.to(out1, { autoAlpha: 1, scale: 1, ...ORB_OUTLINE_REVEAL }, 0);
	}
	if (out2) {
		tl.to(out2, { autoAlpha: 1, scale: 1, ...ORB_OUTLINE_REVEAL }, 1);
	}

	// Hero chars (orb Phase 2와 동시 시작, delay:1)
	tl.to(
		SELECTORS.heroChars,
		{
			y: HERO_CHARS.visibleY,
			duration: HERO_CHARS.duration,
			ease: HERO_CHARS.ease,
			stagger: HERO_CHARS.stagger
		},
		1
	);

	// Outline breathing (reveal 완료 후)
	if (out1) {
		tl.add(buildOrbOutlineBreathing(gsap, out1, out2), 0);
	}

	return tl;
}

// ── 공개 API ──────────────────────────────────────────────────────────────────

/**
 * 모든 hero/HUD/orb 요소를 애니메이션 시작 전 숨김 상태로 설정.
 * onMount 진입 직후 즉시 실행 (GSAP set은 동기적).
 */
export function setHeroInitialState(gsap: GsapType): void {
	const { orb, out1, out2 } = getOrbEls();
	const allChars = document.querySelectorAll<HTMLElement>(SELECTORS.heroChars);

	if (allChars.length) gsap.set(allChars, { y: HERO_CHARS.hiddenY });

	if (orb && document.documentElement.dataset.preloaderDone === 'true') {
		orb.classList.remove('is-pre');
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
	if (out1) gsap.to(out1, { ...ORB_ROTATION.out1 });
	if (out2) gsap.to(out2, { ...ORB_ROTATION.out2 });
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
 * Hero 인트로 타임라인.
 *
 * @param fromPreloader - true: Preloader가 orb/chars를 이미 처리 → [hh-tb] 슬라이드인만
 *                        false: SPA nav → orb + chars + [hh-tb] 전체 시퀀스
 * @returns GSAP Timeline (onComplete 콜백은 호출자가 설정)
 */
export function runHeroIntro(
	{ gsap }: Pick<AnimCtx, 'gsap'>,
	{ fromPreloader }: { fromPreloader: boolean }
) {
	const tl = gsap.timeline();

	// HUD는 항상 등장
	tl.add(buildHudIntro(gsap), 0);

	if (fromPreloader) {
		// Preloader가 orb + chars를 이미 처리 → [hh-tb]만 슬라이드인
		tl.add(buildHeroTextBlocksIntro(gsap), 0);
	} else {
		// SPA nav: orb + outline + chars + [hh-tb] 전체 시퀀스 (중앙에서 시작)
		tl.add(buildOrbHeroIntro(gsap, { fromDotPosition: false }), 0);
		// [hh-tb]: orb Phase 2 완료 후 (2s) 슬라이드인
		tl.add(buildHeroTextBlocksIntro(gsap), 2);
	}

	return tl;
}

/**
 * Hero 섹션 스크롤 아웃.
 * [hh-tb]가 좌측으로 드리프트, chars가 fade out.
 * Lenis.start() 이후에 호출.
 */
export function setupHeroScroll({ gsap }: AnimCtx): void {
	const homeSection = document.querySelector<HTMLElement>(SELECTORS.homeHero);
	if (!homeSection) return;

	const trigger = { trigger: homeSection, start: 'top top', end: 'bottom top', scrub: true };

	(
		[
			{ sel: SELECTORS.heroTextBlock1, ...HERO_SCROLL_DRIFT[0] },
			{ sel: SELECTORS.heroTextBlock2, ...HERO_SCROLL_DRIFT[1] },
			{ sel: SELECTORS.heroTextBlock3, ...HERO_SCROLL_DRIFT[2] }
		] as const
	).forEach(({ sel, x }) => {
		gsap.to(sel, { x, ease: 'power2.out', scrollTrigger: trigger });
	});

	const chars = homeSection.querySelectorAll<HTMLElement>('[split-hero] .char');
	if (chars.length) {
		gsap.to(chars, {
			y: HERO_CHARS.exitY,
			autoAlpha: 0,
			stagger: HERO_CHARS.stagger,
			scrollTrigger: trigger
		});
	}
}

// ── Deprecated (하위 호환) ────────────────────────────────────────────────────

/** @deprecated Use buildHudIntro instead */
export function playHudIntro(gsap: GsapType): void {
	buildHudIntro(gsap);
}

/** @deprecated Use buildOrbHeroIntro instead */
export function playOrbHeroIntro(gsap: GsapType): void {
	buildOrbHeroIntro(gsap);
}

/** @deprecated Use buildOrbOutlineBreathing instead */
export function animateOrbOutlineBreathing(
	gsap: GsapType,
	out1: HTMLElement,
	out2: HTMLElement | null
): void {
	buildOrbOutlineBreathing(gsap, out1, out2);
}
