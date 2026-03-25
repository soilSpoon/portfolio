import type { AnimCtx } from './types';

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
		gsap.set(words, { autoAlpha: 0, yPercent: -101, willChange: 'transform, opacity' });
		gsap.to(words, {
			autoAlpha: 1,
			yPercent: 0,
			duration: 2,
			ease: 'power4.inOut',
			stagger: { each: 0.05, from: 'random' },
			overwrite: 'auto',
			scrollTrigger: { trigger: el, start: '20% bottom', once: true }
		});
	});

	document.querySelectorAll<HTMLElement>('[stagger-lines]').forEach((el) => {
		const lines = el.querySelectorAll<HTMLElement>('.line');
		if (!lines.length) return;

		gsap.set(el, { autoAlpha: 1 });
		gsap.set(lines, { autoAlpha: 0, yPercent: -101, willChange: 'transform, opacity' });
		gsap.to(lines, {
			autoAlpha: 1,
			yPercent: 0,
			duration: 2,
			ease: 'power4.inOut',
			stagger: { each: 0.05, from: 'start' },
			overwrite: 'auto',
			scrollTrigger: { trigger: el, start: '20% bottom', once: true }
		});
	});

	document.querySelectorAll<HTMLElement>('[btn-reveal]').forEach((btn) => {
		const target = btn.querySelector<HTMLElement>('[reveal-target]');
		if (!target) return;

		gsap.set(target, { autoAlpha: 0, yPercent: 101, willChange: 'transform, opacity' });
		gsap.to(target, {
			yPercent: 0,
			autoAlpha: 1,
			duration: 1,
			ease: 'power1.out',
			overwrite: 'auto',
			scrollTrigger: { trigger: btn, start: '20% bottom', once: true }
		});
	});
}
