import type { AnimCtx, GsapType } from './types';
import { COMMON_REVEAL } from './config';

/** Direction for the hidden yPercent offset. */
type RevealDirection = 'up' | 'down';

interface ScrollRevealOpts {
	elements: Element[] | NodeListOf<Element>;
	trigger: Element;
	duration: number;
	ease: string;
	stagger?: gsap.StaggerVars;
	triggerStart: string;
	yDirection?: RevealDirection;
}

const HIDDEN_Y: Record<RevealDirection, number> = { up: -101, down: 101 };

/**
 * 스크롤 진입 시 요소를 reveal하는 공통 패턴.
 *
 * 1. `gsap.set()`으로 초기 숨김 (autoAlpha:0, yPercent)
 * 2. `gsap.to()`로 scrollTrigger once:true reveal
 *
 * 깜빡임 방지를 위해 set→to 순서를 사용한다 (from 미사용).
 */
export function createScrollReveal(gsap: GsapType, opts: ScrollRevealOpts): void {
	const { elements, trigger, duration, ease, stagger, triggerStart, yDirection = 'up' } = opts;
	const yPercent = HIDDEN_Y[yDirection];

	gsap.set(elements, { autoAlpha: 0, yPercent, willChange: 'transform, opacity' });
	gsap.to(elements, {
		autoAlpha: 1,
		yPercent: 0,
		duration,
		ease,
		...(stagger ? { stagger } : {}),
		overwrite: 'auto',
		scrollTrigger: { trigger, start: triggerStart, once: true }
	});
}

/**
 * 스크롤 reveal의 초기 숨김 상태만 설정한다.
 * 타임라인 기반 reveal(grid 등)에서 set 부분만 재사용할 때 사용.
 */
export function setScrollRevealHidden(
	gsap: GsapType,
	elements: Element[] | NodeListOf<Element>,
	yDirection: RevealDirection = 'down'
): void {
	gsap.set(elements, {
		autoAlpha: 0,
		yPercent: HIDDEN_Y[yDirection],
		willChange: 'transform, opacity'
	});
}

/**
 * 페이지 전체 공통 reveal 애니메이션.
 *
 * 깜빡임 방지 원칙:
 * - split 이후 즉시 gsap.set()으로 초기 숨김 상태를 명시한다.
 * - 이후 scrollTrigger에서 gsap.to()로 reveal 한다.
 * - `from()`에 의존하지 않아 초기 렌더 → 숨김 점프 현상을 줄인다.
 */
export function setupCommonReveal({ gsap }: AnimCtx): void {
	document.querySelectorAll<HTMLElement>('[stagger-scroll]').forEach((el) => {
		const words = el.querySelectorAll<HTMLElement>('.word');
		if (!words.length) return;

		gsap.set(el, { autoAlpha: 1 });
		createScrollReveal(gsap, {
			elements: words,
			trigger: el,
			duration: COMMON_REVEAL.words.duration,
			ease: COMMON_REVEAL.words.ease,
			stagger: COMMON_REVEAL.words.stagger,
			triggerStart: COMMON_REVEAL.words.scrollStart
		});
	});

	document.querySelectorAll<HTMLElement>('[stagger-lines]').forEach((el) => {
		const lines = el.querySelectorAll<HTMLElement>('.line');
		if (!lines.length) return;

		gsap.set(el, { autoAlpha: 1 });
		createScrollReveal(gsap, {
			elements: lines,
			trigger: el,
			duration: COMMON_REVEAL.lines.duration,
			ease: COMMON_REVEAL.lines.ease,
			stagger: COMMON_REVEAL.lines.stagger,
			triggerStart: COMMON_REVEAL.lines.scrollStart
		});
	});

	document.querySelectorAll<HTMLElement>('[btn-reveal]').forEach((btn) => {
		const target = btn.querySelector<HTMLElement>('[reveal-target]');
		if (!target) return;

		createScrollReveal(gsap, {
			elements: [target],
			trigger: btn,
			duration: COMMON_REVEAL.button.duration,
			ease: COMMON_REVEAL.button.ease,
			triggerStart: COMMON_REVEAL.button.scrollStart,
			yDirection: 'down'
		});
	});
}
