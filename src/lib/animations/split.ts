import type SplitTypeClass from 'split-type';
import type { TypesList } from 'split-type';

type SplitTypeCtor = typeof SplitTypeClass;

/**
 * 페이지 전체 텍스트 요소를 SplitType으로 분할.
 *
 * 중요한 점:
 * - 같은 요소를 두 번 split 하면 DOM nesting이 꼬이고 flicker가 커질 수 있다.
 * - 따라서 selector 우선순위를 두고 "한 요소당 한 번만" 처리한다.
 *
 * 우선순위:
 * - `[split-hero]`     → chars + words
 * - `[stagger-lines]`  → lines
 * - `[stagger-scroll]` → words
 * - 나머지 `[split-text]` → words
 */
export function splitAllText(SplitType: SplitTypeCtor): void {
	const processed = new WeakSet<HTMLElement>();

	const splitOnce = (selector: string, types: TypesList) => {
		document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
			if (processed.has(el)) return;
			new SplitType(el, { types });
			processed.add(el);
		});
	};

	splitOnce('.c.is-home-hero [split-hero]', 'chars,words');
	splitOnce('[stagger-lines]', 'lines');
	splitOnce('[stagger-scroll]', 'words');
	splitOnce('[split-text]', 'words');
}
