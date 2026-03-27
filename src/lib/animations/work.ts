import type { AnimCtx, STType } from './types';
import { duration } from '$lib/design/tokens';
import { WORK } from './config';

type STInstance = InstanceType<STType>;

/**
 * HomeWork 섹션 애니메이션 (데스크탑 전용, innerWidth > 991).
 * - 홀수/짝수 카드 스크롤 parallax (±10em)
 * - hover 시 word stagger reveal
 */
export function setupWork({ gsap, ST }: AnimCtx): void {
	const homeWork = document.querySelector<HTMLElement>('[home-work]');
	if (!homeWork) return;

	const items = homeWork.querySelectorAll<HTMLElement>('[data-work-item]');
	gsap.set(items, { y: '0em' });

	if (window.innerWidth <= WORK.desktopMinWidth) return;

	items.forEach((item, idx) => {
		const isOdd = (idx + 1) % 2 !== 0;
		ST.create({
			trigger: '[home-work]',
			start: 'top top',
			end: 'bottom bottom',
			scrub: true,
			onUpdate: (self: STInstance) => {
				gsap.to(item, {
					y: gsap.utils.interpolate(
						'0em',
						isOdd ? WORK.parallaxOdd : WORK.parallaxEven,
						self.progress
					),
					overwrite: 'auto'
				});
			}
		});
	});

	items.forEach((item) => {
		const words = item.querySelectorAll<HTMLElement>('[data-work-title] .word');

		if (words.length) {
			gsap.set(words, { y: WORK.wordOffsetY });
		}

		item.addEventListener('mouseenter', () => {
			if (words.length) {
				gsap.killTweensOf(words);
				gsap.to(words, { y: 0, stagger: WORK.enterStagger, duration: duration.fast });
			}
		});

		item.addEventListener('mouseleave', () => {
			if (words.length) {
				gsap.killTweensOf(words);
				gsap.to(words, { y: WORK.wordOffsetY, stagger: WORK.leaveStagger, duration: duration.med });
			}
		});
	});
}
