import type { AnimCtx } from './types';
import { GRID } from './config';
import { setScrollRevealHidden } from './common';

/**
 * HomeGrid 섹션 애니메이션.
 * - 3D fly-in: z:-6000~-100 에서 날아오는 그리드 아이템 (perspective:4000px)
 * - overlay words: 스크롤 진입/퇴장 시 yPercent reveal/hide
 */
export function setupGrid({ gsap }: AnimCtx): void {
	const gridWrap = document.querySelector<HTMLElement>('[grid-anim]');
	if (!gridWrap) return;

	const gridItems = gridWrap.querySelectorAll<HTMLElement>('[data-grid-item]');
	const gridItemsInner = [...gridItems].map((item) =>
		item.querySelector<HTMLElement>('[data-grid-inner]')
	);
	const gridTexts = gridWrap.querySelectorAll<HTMLElement>('[data-grid-text]');
	const overlayHeading = document.querySelector<HTMLElement>('[data-grid-overlay] [split-text]');
	const wordElems = document.querySelectorAll<HTMLElement>('[data-grid-overlay] [split-text] .word');

	gsap.set(gridTexts, { fontSize: GRID.textSizeInit });

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
			z: () => gsap.utils.random(GRID.zRange[0], GRID.zRange[1]),
			rotationX: () => gsap.utils.random(GRID.rotXRange[0], GRID.rotXRange[1]),
			autoAlpha: GRID.initAlpha
		})
		.to(gridWrap, { scale: GRID.wrapScale }, 0)
		.to(
			gridItems,
			{
				xPercent: () => gsap.utils.random(GRID.xPercentRange[0], GRID.xPercentRange[1]),
				yPercent: () => gsap.utils.random(GRID.yPercentRange[0], GRID.yPercentRange[1]),
				rotationX: 0,
				autoAlpha: GRID.finalAlpha
			},
			0
		)
		.to(gridWrap, { z: GRID.wrapZ }, 0)
		.fromTo(gridItemsInner, { scale: GRID.innerScaleFrom }, { scale: GRID.innerScaleTo }, 0)
		.fromTo(gridTexts, { fontSize: GRID.textSizeFrom }, { fontSize: GRID.textSizeTo }, 0);

	if (!wordElems.length) return;

	if (overlayHeading) gsap.set(overlayHeading, { autoAlpha: 1 });
	setScrollRevealHidden(gsap, wordElems, 'down');

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
			stagger: GRID.overlayWords.stagger,
			duration: GRID.overlayWords.duration,
			ease: GRID.overlayWords.ease,
			overwrite: 'auto'
		})
		.to(wordElems, {
			autoAlpha: 0,
			yPercent: 101,
			stagger: GRID.overlayWordsExit.stagger,
			duration: GRID.overlayWordsExit.duration,
			ease: GRID.overlayWordsExit.ease,
			overwrite: 'auto'
		});
}
