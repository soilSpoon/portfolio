import type { AnimCtx } from './types';

/**
 * HomeGrid 섹션 애니메이션.
 * - 3D fly-in: z:-6000~-100 에서 날아오는 그리드 아이템 (perspective:4000px)
 * - overlay words: 스크롤 진입/퇴장 시 yPercent reveal/hide
 */
export function setupGrid({ gsap }: AnimCtx): void {
	const gridWrap = document.querySelector<HTMLElement>('[grid-anim]');
	if (!gridWrap) return;

	const gridItems = gridWrap.querySelectorAll<HTMLElement>('.hg-grid-item');
	const gridItemsInner = [...gridItems].map((item) =>
		item.querySelector<HTMLElement>('.hg-grid-inner')
	);
	const gridTexts = gridWrap.querySelectorAll<HTMLElement>('.text-small');
	const overlayHeading = document.querySelector<HTMLElement>('.hg-grid-overlay [split-text]');
	const wordElems = document.querySelectorAll<HTMLElement>('.hg-grid-overlay [split-text] .word');

	gsap.set(gridTexts, { fontSize: '3em' });

	const gridTL = gsap.timeline({
		defaults: { ease: 'none' },
		scrollTrigger: {
			trigger: gridWrap,
			start: 'top bottom+=5%',
			end: 'bottom top-=5%',
			scrub: true,
			id: 'gridTimelineTrigger'
		}
	});

	gridTL
		.set(gridItems, {
			transformOrigin: '50% 0%',
			z: () => gsap.utils.random(-6000, -100),
			rotationX: () => gsap.utils.random(-65, -25),
			autoAlpha: 0.5
		})
		.to(gridWrap, { scale: 0.8 }, 0)
		.to(
			gridItems,
			{
				xPercent: () => gsap.utils.random(-150, 150),
				yPercent: () => gsap.utils.random(-300, 300),
				rotationX: 0,
				autoAlpha: 2
			},
			0
		)
		.to(gridWrap, { z: 6500 }, 0)
		.fromTo(gridItemsInner, { scale: 2 }, { scale: 1 }, 0)
		.fromTo(gridTexts, { fontSize: '1.2em' }, { fontSize: '0.7em' }, 0);

	if (!wordElems.length) return;

	if (overlayHeading) gsap.set(overlayHeading, { autoAlpha: 1 });
	gsap.set(wordElems, { autoAlpha: 0, yPercent: 101, willChange: 'transform, opacity' });

	gsap
		.timeline({
			scrollTrigger: {
				trigger: gridWrap,
				start: 'top bottom-=40%',
				end: 'center top',
				scrub: true,
				id: 'wordsTimelineTrigger'
			}
		})
		.to(wordElems, {
			autoAlpha: 1,
			yPercent: 0,
			stagger: { each: 0.05, from: 'random' as const },
			duration: 2,
			ease: 'power4.inOut',
			overwrite: 'auto'
		})
		.to(wordElems, {
			autoAlpha: 0,
			yPercent: 101,
			stagger: { each: 0.05, from: 'start' as const },
			duration: 2,
			ease: 'power4.inOut',
			overwrite: 'auto'
		});
}
