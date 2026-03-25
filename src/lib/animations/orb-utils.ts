import { SELECTORS } from './selectors';

/**
 * Orb canvas가 DOM에 마운트될 때까지 대기.
 * Three.js WebGL 렌더러가 준비되어야 orb 애니메이션이 정상 작동.
 *
 * @param timeout - 최대 대기 시간 (ms). 기본값 2000ms
 * @returns canvas 준비 완료 시 resolve
 */
export function waitForOrbCanvas(timeout = 2000): Promise<void> {
	return new Promise((resolve) => {
		const orbEl = document.querySelector<HTMLElement>(SELECTORS.orb);

		if (!orbEl) {
			resolve();
			return;
		}

		if (orbEl.querySelector('canvas')) {
			resolve();
			return;
		}

		const observer = new MutationObserver(() => {
			if (orbEl.querySelector('canvas')) {
				observer.disconnect();
				clearTimeout(timer);
				resolve();
			}
		});

		const timer = window.setTimeout(() => {
			observer.disconnect();
			resolve();
		}, timeout);

		observer.observe(orbEl, { childList: true });
	});
}
