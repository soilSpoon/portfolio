import type { AnimCtx, STType } from './types';

type STInstance = InstanceType<STType>;

/**
 * HomeHSC 섹션 — Logo Reveal Scroll 애니메이션.
 * - 로고 scale×29 / rotation 180°
 * - 텍스트 x:50vw→0 슬라이드인, 스크롤 끝에서 y:20vh 퇴장
 * - 단어 교차 yPercent ±101 퇴장
 * - 섹션 scale-down + boxShadow (스크롤 진행률 기반)
 */
export function setupHSC({ gsap, ST }: AnimCtx): void {
	const hscTrack = document.querySelector<HTMLElement>('[hsc-track]');
	if (!hscTrack) return;

	const hscScale = hscTrack.querySelector<HTMLElement>('[hsc-scale]');
	const hscImg = hscTrack.querySelector<HTMLElement>('[hsc-img]');
	const hscRotate = hscTrack.querySelector<HTMLElement>('[hsc-rotate]');
	const hscText = hscTrack.querySelector<HTMLElement>('[hsc-text]');
	const hscTextInner = hscTrack.querySelector<HTMLElement>('.h-c.is-anim');
	const hscWords = hscTrack.querySelectorAll<HTMLElement>('.word');

	if (hscText) gsap.set(hscText, { autoAlpha: 0, x: '50vw' });
	if (hscTextInner) gsap.set(hscTextInner, { autoAlpha: 0, y: '2em' });
	if (hscWords.length) gsap.set(hscWords, { yPercent: 0, willChange: 'transform' });

	const t = (extra?: object) => ({ trigger: '[hsc-track]', scrub: true, ...extra });

	if (hscScale) {
		gsap.to(hscScale, {
			scale: 29,
			scrollTrigger: t({ start: 'top top', end: 'bottom top' })
		});
	}

	if (hscImg) {
		gsap.to(hscImg, {
			width: '20.5em',
			height: '20.5em',
			scrollTrigger: t({ start: 'top top', end: 'bottom top' })
		});
		gsap.fromTo(
			hscImg,
			{ scale: 0, rotation: 0 },
			{ scale: 1, rotation: 45, scrollTrigger: t({ start: 'top center', end: 'top top' }) }
		);
	}

	if (hscRotate) {
		gsap.to(hscRotate, {
			rotation: 180,
			scrollTrigger: t({ start: 'top top', end: 'bottom top' })
		});
	}

	if (hscText) {
		gsap.to(hscText, {
			x: '0vw',
			autoAlpha: 1,
			scrollTrigger: t({ start: 'top top', end: 'bottom-=100 bottom' })
		});
		gsap.fromTo(
			hscText,
			{ y: '0vh' },
			{ y: '20vh', scrollTrigger: t({ start: 'bottom bottom', end: 'bottom+=100 center' }) }
		);
	}

	if (hscTextInner) {
		gsap.to(hscTextInner, {
			autoAlpha: 1,
			y: '0em',
			scrollTrigger: t({ start: 'top center', end: 'top top' })
		});
	}

	hscWords.forEach((el, idx) => {
		gsap.to(el, {
			yPercent: idx % 2 === 0 ? -101 : 101,
			scrollTrigger: t({ start: 'bottom bottom-=100', end: 'bottom center-=100' })
		});
	});

	ST.create({
		trigger: '[hsc-track]',
		scrub: true,
		start: 'bottom center',
		end: 'bottom top',
		onUpdate: (self: STInstance) => {
			gsap.to('.s.is-hsc', {
				scale: 1 - 0.1 * self.progress,
				boxShadow: `0 0 0 ${1.5 * self.progress}px var(--light-grey)`
			});
		}
	});
}
