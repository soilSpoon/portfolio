import type { AnimCtx } from './types';
import { SELECTORS } from './selectors';
import { ORB_PATH } from './config';

/**
 * 페이지 전체 스크롤에 걸쳐 orb + outline ring의 이동 궤적 설정.
 * `.page-w` top→bottom 전체 구간을 scrub 타임라인으로 제어.
 */
export function setupOrbPath({ gsap }: AnimCtx): void {
	const orbObj = document.querySelector<HTMLElement>(SELECTORS.orb);
	const outline1 = document.querySelector<HTMLElement>(SELECTORS.orbOutline1);
	const outline2 = document.querySelector<HTMLElement>(SELECTORS.orbOutline2);

	if (!orbObj || !outline1 || !outline2) return;

	const st = {
		trigger: SELECTORS.pageWrapper,
		start: 'top top',
		end: 'bottom bottom',
		scrub: true,
		immediateRender: false
	};

	// ── orb 본체 궤적 ──────────────────────────────────────────────────────────
	const orbTL = gsap.timeline({ scrollTrigger: st });
	for (const step of ORB_PATH.body) {
		orbTL.to(orbObj, { ...step });
	}

	// ── outline ring 1 ─────────────────────────────────────────────────────────
	const out1TL = gsap.timeline({ scrollTrigger: st });
	for (const step of ORB_PATH.outline1) {
		out1TL.to(outline1, { ...step });
	}

	// ── outline ring 2 ─────────────────────────────────────────────────────────
	const out2TL = gsap.timeline({ scrollTrigger: st });
	for (const step of ORB_PATH.outline2) {
		out2TL.to(outline2, { ...step });
	}
}
