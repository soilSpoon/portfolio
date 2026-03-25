import gsap from 'gsap';
import Lenis from 'lenis';

export type LenisInstance = InstanceType<typeof Lenis>;

export type LenisController = {
	lenis: LenisInstance;
	start: () => void;
	stop: () => void;
	destroy: () => void;
};

export function initLenis(): LenisController {
	const lenis = new Lenis({
		autoRaf: false,
		smoothWheel: true
	});

	const tickerCallback = (time: number) => {
		lenis.raf(time * 1000);
	};

	gsap.ticker.add(tickerCallback);
	gsap.ticker.lagSmoothing(0);

	return {
		lenis,
		start() {
			lenis.start();
		},
		stop() {
			lenis.stop();
		},
		destroy() {
			gsap.ticker.remove(tickerCallback);
			lenis.destroy();
		}
	};
}
