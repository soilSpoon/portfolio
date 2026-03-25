import type { AnimCtx } from './types';
import { SELECTORS } from './selectors';

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
		immediateRender: false,
	};


	// ── orb 본체 궤적 ──────────────────────────────────────────────────────────
	gsap.timeline({ scrollTrigger: st })
		.to(orbObj, { x: '50vw',  scale: 2,               duration: 0.15,  ease: 'power2.out'   })
		.to(orbObj, { x: '-50vw', y: '-20vh', scale: 1.5,  duration: 0.15,  ease: 'power2.inOut' })
		.to(orbObj, { x: '0vw',  y: '50vh',  scale: 0,     duration: 0.05                       })
		.to(orbObj, { x: '0vw',              scale: 0,     duration: 0.025                      })
		.to(orbObj, { x: '0vw',  y: '0vh',   scale: 1,     duration: 0.125                      })
		.to(orbObj, { x: '-25vw', y: '20vh',  scale: 1.5,  duration: 0.1                        })
		.to(orbObj, { x: '-60vw', y: '-75vh', scale: 0, ease: 'power1.out', duration: 0.05      })
		.to(orbObj, { x: '0vw',  y: '0vh',   scale: 0,     duration: 0.3                        });

	// ── outline ring 1 ─────────────────────────────────────────────────────────
	gsap.timeline({ scrollTrigger: st })
		.to(outline1, { x: '10vw',  y: '0vh',  scale: 1.2, duration: 0.15,  overwrite: 'auto' })
		.to(outline1, { x: '-30vw', y: '0vh',  scale: 1.3, duration: 0.15                    })
		.to(outline1, { x: '0vw',  y: '50vh', scale: 1,   duration: 0.05                    })
		.to(outline1, { x: '0vw',  y: '50vh', scale: 0.8, duration: 0.025                   })
		.to(outline1, { x: '0vw',  y: '0vh',  scale: 1,   duration: 0.125                   })
		.to(outline1, { x: '30vw', y: '-20vh', scale: 0.7, duration: 0.15                   })
		.to(outline1, { x: '0vw',  y: '0vh',  scale: 1,   duration: 0.05                    })
		.to(outline1, { x: '0vw',  y: '0vh',  scale: 0,   duration: 0.25                    })
		.to(outline1, { x: '49vw', y: '0vh',  scale: 1,   duration: 0.05                    });

	// ── outline ring 2 ─────────────────────────────────────────────────────────
	gsap.timeline({ scrollTrigger: st })
		.to(outline2, { x: '25vw', y: '0vh',  scale: 1.3, duration: 0.15,  overwrite: 'auto' })
		.to(outline2, { x: '-9vw', y: '32vh', scale: 0.6, duration: 0.15                    })
		.to(outline2, { x: '0vw', y: '50vh',  scale: 1,   duration: 0.05                    })
		.to(outline2, { x: '0vw', y: '50vh',  scale: 0.8, duration: 0.025                   })
		.to(outline2, { x: '0vw', y: '0vh',   scale: 1,   duration: 0.125                   })
		.to(outline2, { x: '0vw', y: '14vh',  scale: 1.2, duration: 0.15                    })
		.to(outline2, { x: '0vw', y: '0vh',   scale: 0.6, duration: 0.05                    })
		.to(outline2, { x: '0vw', y: '0vh',   scale: 0,   duration: 0.25                    })
		.to(outline2, { x: '29vw', y: '0vh',  scale: 1.5, duration: 0.05                    });
}