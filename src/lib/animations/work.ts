import type { AnimCtx, STType } from './types';
import { duration } from '$lib/design/tokens';
import { WORK } from './config';

type STInstance = InstanceType<STType>;
type GSAPWithOptionalMorph = AnimCtx['gsap'] & {
	plugins?: {
		morphSVG?: unknown;
	};
};

// MorphSVG: 크로스(+) → 화살표(→) 변형 경로 (원본 bundle에서 추출)
const MORPH_ARROW_PATH =
	'M69.4 148.3 125 90.7H4.8c-1 0-1.8-.8-1.8-2V73.8c0-1.2.8-2 1.8-2h120.5' +
	'L69.4 13.7c-1.3-1.5-.5-2.5 1-2.5H90c1 0 1.8.3 2.5 1L158 80.6v1' +
	'l-65.4 67.9c-.8.7-1.5 1.3-2.5 1.3H70.4c-1.5 0-2.2-1.2-1-2.5z';

/**
 * HomeWork 섹션 애니메이션 (데스크탑 전용, innerWidth > 991).
 * - 홀수/짝수 카드 스크롤 parallax (±10em)
 * - MorphSVGPlugin hover: 크로스(+) ↔ 화살표(→) 변형
 *   (MorphSVGPlugin은 유료 GSAP 플러그인 — 없으면 morph 효과만 스킵)
 */
export function setupWork({ gsap, ST }: AnimCtx): void {
	const homeWork = document.querySelector<HTMLElement>('[home-work]');
	if (!homeWork) return;

	const items = homeWork.querySelectorAll<HTMLElement>('.hcs-item-w');
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

	const morphSVG = (gsap as GSAPWithOptionalMorph).plugins?.morphSVG ?? null;

	items.forEach((item) => {
		const svgPath = item.querySelector<SVGPathElement>('.hcs-cross-svg');
		const words = item.querySelectorAll<HTMLElement>('.hcs-title-w .word');

		gsap.set(words, { y: WORK.wordOffsetY });

		item.addEventListener('mouseenter', () => {
			if (svgPath && morphSVG) {
				gsap.to(svgPath, { morphSVG: MORPH_ARROW_PATH, duration: duration.med });
			}
			gsap.killTweensOf(words);
			gsap.to(words, { y: 0, stagger: WORK.enterStagger, duration: duration.fast });
		});

		item.addEventListener('mouseleave', () => {
			if (svgPath && morphSVG) {
				gsap.to(svgPath, { morphSVG: svgPath, duration: duration.med });
			}
			gsap.killTweensOf(words);
			gsap.to(words, { y: WORK.wordOffsetY, stagger: WORK.leaveStagger, duration: duration.med });
		});
	});
}
