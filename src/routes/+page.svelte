<script lang="ts">
	import { onMount } from 'svelte';
	import HomeHero from '$lib/components/HomeHero.svelte';
	import HomeMission from '$lib/components/HomeMission.svelte';
	import HomeClients from '$lib/components/HomeClients.svelte';
	import HomeWork from '$lib/components/HomeWork.svelte';
	import HomeGrid from '$lib/components/HomeGrid.svelte';
	import HomeAwards from '$lib/components/HomeAwards.svelte';
	import HomeHSC from '$lib/components/HomeHSC.svelte';
	import HomeFooter from '$lib/components/HomeFooter.svelte';

	onMount(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let lenis: any = null;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let ScrollTriggerModule: any = null;

		(async () => {
		// ── 라이브러리 동적 import (SSR 안전) ────────────────────────────────
		const [{ gsap }, { ScrollTrigger }, LenisClass, SplitType] = await Promise.all([
			import('gsap'),
			import('gsap/ScrollTrigger'),
			import('lenis').then((m) => m.default),
			import('split-type').then((m) => m.default),
		]);

		gsap.registerPlugin(ScrollTrigger);
		ScrollTriggerModule = ScrollTrigger;

		// ── 1. Lenis 스무스 스크롤 ────────────────────────────────────────────
		// 스크롤 초기화: refresh 시 브라우저가 복원한 scroll position 리셋
		// orbHomePath ScrollTrigger가 잘못된 위치에서 초기화되는 것을 방지
		window.scrollTo(0, 0);

		lenis = new LenisClass({
			duration: 1.2,
			easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true,
		});

		// Lenis ↔ ScrollTrigger 연동
		lenis.on('scroll', ScrollTrigger.update);
		gsap.ticker.add((time) => {
			lenis.raf(time * 1000);
		});
		gsap.ticker.lagSmoothing(0);

		// window.SScroll = lenis (글로벌 접근용)
		(window as any).SScroll = lenis;

		// ── 2. SplitType 텍스트 분할 ─────────────────────────────────────────
		// 실제: .c.is-home-hero [split-hero] (homeHero 함수와 동일한 selector)
		const splitHeroEls = document.querySelectorAll<HTMLElement>('.c.is-home-hero [split-hero]');
		const splitInstances = [...splitHeroEls].map((el) => new SplitType(el, { types: 'chars,words' }));

		// stagger-scroll → .word 단위 분할
		const staggerScrollEls = document.querySelectorAll<HTMLElement>('[stagger-scroll]');
		staggerScrollEls.forEach((el) => new SplitType(el, { types: 'words' }));

		// split-text (HSC overlay 등) → .word 단위
		const splitTextEls = document.querySelectorAll<HTMLElement>('[split-text]');
		splitTextEls.forEach((el) => new SplitType(el, { types: 'words' }));

		// stagger-lines → .line 단위 분할
		const staggerLineEls = document.querySelectorAll<HTMLElement>('[stagger-lines]');
		staggerLineEls.forEach((el) => new SplitType(el, { types: 'lines' }));

		// ── 3. homeHero intro + heroScrollTrigger ────────────────────────────
		// 실제 bundle: homeHero() 는 preloader 완료 후 호출됨
		// chars: y="-101%" → y="0%" 로 reveal (preloader → page 전환)
		const allChars = document.querySelectorAll<HTMLElement>('.hh-text-block .char');
		const orbElement = document.querySelector<HTMLElement>('[data-orb]');
		const orbOutlineEl1 = document.querySelector<HTMLElement>('[orb-outline="1"]');
		const orbOutlineEl2 = document.querySelector<HTMLElement>('[orb-outline="2"]');

		// hero 초기 상태 세팅 (chars hidden)
		if (allChars.length) {
			gsap.set(allChars, { y: '-101%' });
		}

		// Orb 초기 상태: 원본과 동일하게 translate(8em, 8.1em) — 프리로더 로고의 오른쪽 하단 원형 도트 위치
		// → preloader:done 시 translate(0,0)으로 이동하면서 0em→4.3em→80vh 성장
		if (orbElement) {
			orbElement.classList.remove('is-pre');
			gsap.set(orbElement, {
				autoAlpha: 0,
				width: '0em',
				height: '0em',
				minHeight: 'auto',
				minWidth: 'auto',
				x: '8em',
				y: '8.1em',
			});
		}
		if (orbOutlineEl1) gsap.set(orbOutlineEl1, { autoAlpha: 0, scale: 0 });
		if (orbOutlineEl2) gsap.set(orbOutlineEl2, { autoAlpha: 0, scale: 0 });

		// ── orbOutline 상시 회전 (원본 initializeOrbRotation과 동일) ─────────
		// outline1: 360°/100s (시계 방향), outline2: -360°/80s (반시계)
		// autoAlpha:0 상태에서도 회전 중 → reveal 시 이미 회전하고 있음
		if (orbOutlineEl1) gsap.to(orbOutlineEl1, { rotation: 360, duration: 100, repeat: -1, ease: 'none' });
		if (orbOutlineEl2) gsap.to(orbOutlineEl2, { rotation: -360, duration: 80, repeat: -1, ease: 'none' });

		// ─ HUD 초기 숨김 (preloader 중)
		gsap.set('.hud-brand-w .hud-brand-link', { y: '-101%', opacity: 0 });
		gsap.set('.hud-scroll-w', { opacity: 0 });
		gsap.set('.hud-menu-o .hud-menu-w', { y: '101%', opacity: 0 });

		// ── fromPreloader: 첫 방문 시 preloader:done 이벤트에서 true로 설정 ──
		// true → runHeroIntro에서 orb/orbOutline 애니메이션 스킵 (preloader가 담당)
		// false → 재방문(SPA 내비게이션) 시 runHeroIntro에서 직접 orb 애니메이션
		let fromPreloader = false;

		// Preloader 완료 이벤트를 기다림 (layout.svelte의 Preloader가 'preloader:done' dispatch)
		const runHeroIntro = () => {
			// HUD 슬라이드인 (원본 hudUiAnimations 기준)
			// hud-scroll-w: delay 없음 (원본과 동일)
			gsap.to('.hud-brand-w .hud-brand-link', { y: '0%', opacity: 1, duration: 1, ease: 'power1.out' });
			gsap.to('.hud-scroll-w', { opacity: 1, duration: 1.5, ease: 'power1.out' });
			gsap.to('.hud-menu-o .hud-menu-w', { y: '0%', opacity: 1, duration: 1, ease: 'power1.out' });

			// chars 등장 (첫 방문: preloader가 이미 y:0%로 올렸으므로 no-op
			//           SPA 내비게이션: preloader 미실행이므로 여기서 등장)
			gsap.to('.hh-text-block .char', {
				y: '0%',
				duration: 1,
				ease: 'power4.inOut',
				stagger: { each: 0.03, from: 'random' },
			});

			if (!fromPreloader) {
				// ── 재방문(SPA) 전용: preloader가 실행되지 않아 orb를 직접 애니메이션 ──
				// Phase 1: translate(8em,8.1em) 위치에서 0em→4.3em (1s)
				// Phase 2: 중앙(0,0)으로 이동하며 4.3em→80vh (delay:1, 1s)
				if (orbElement) {
					gsap.set(orbElement, {
						autoAlpha: 0,
						width: '0em',
						height: '0em',
						minHeight: 'auto',
						minWidth: 'auto',
					});
					gsap.to(orbElement, { autoAlpha: 1, width: '4.3em', height: '4.3em', duration: 1 });
					gsap.to(orbElement, {
						x: 0,
						y: 0,
						width: '80vh',
						height: '80vh',
						minHeight: '45em',
						minWidth: '45em',
						duration: 1,
						ease: 'power2.inOut',
						delay: 1,
					});
				}
				if (orbOutlineEl1) {
					gsap.to(orbOutlineEl1, { autoAlpha: 1, scale: 1, duration: 2, ease: 'power2.inOut' });
				}
				if (orbOutlineEl2) {
					gsap.to(orbOutlineEl2, { delay: 1, autoAlpha: 1, scale: 1, duration: 2, ease: 'power2.inOut' });
				}
			}

			// hh-tb slide in from sides
			// 첫 방문: preloader:done 기준 delay:0,0.1,0.2 (= fill complete 기준 2,2.1,2.2s)
			// 재방문: orb Phase 1+2 동안 기다려야 하므로 delay:1,1.1,1.2 (원본 homeHero 기준)
			const tbDelay = fromPreloader ? 0 : 1;
			gsap.from('[hh-tb="1"]', { delay: tbDelay, x: '10em', duration: 1, ease: 'power2.inOut' });
			gsap.from('[hh-tb="2"]', { delay: tbDelay + 0.1, x: '-10em', duration: 1, ease: 'power2.inOut' });
			gsap.from('[hh-tb="3"]', {
				delay: tbDelay + 0.2,
				x: '10em',
				duration: 1,
				ease: 'power2.inOut',
				onComplete: () => {
					lenis.start();
					setupScrollTriggers();
				},
			});
		};

		// Orb Three.js 캔버스가 DOM에 추가될 때까지 대기
		// (OrbClass.init()이 async이므로, 두 번째 방문 시 preloader가 즉시 완료되면
		//  Three.js 초기화 전에 runHeroIntro()가 호출되어 빈 div가 애니메이션됨)
		const waitForOrbCanvas = (): Promise<void> =>
			new Promise((resolve) => {
				if (orbElement?.querySelector('canvas')) {
					resolve();
					return;
				}
				// 최대 2s 대기 후 fallback (WebGL 미지원 등 예외 상황)
				const timeout = setTimeout(() => {
					mo.disconnect();
					resolve();
				}, 2000);
				const mo = new MutationObserver(() => {
					if (orbElement?.querySelector('canvas')) {
						mo.disconnect();
						clearTimeout(timeout);
						resolve();
					}
				});
				if (orbElement) mo.observe(orbElement, { childList: true });
				else resolve(); // orbElement 없으면 그냥 통과
			});

		// Preloader 완료 감지: 'preloader:done' 커스텀 이벤트 또는 즉시 실행
		const preloaderDone = document.documentElement.dataset.preloaderDone;
		if (preloaderDone === 'true') {
			// 두 번째 방문: preloader가 이미 완료됐지만 Three.js가 아직 초기화 중일 수 있음
			await waitForOrbCanvas();
			runHeroIntro();
		} else {
			// 첫 방문: preloader:done 이벤트 수신 시 fromPreloader=true 설정 후 실행
			window.addEventListener('preloader:done', () => {
				fromPreloader = true;
				runHeroIntro();
			}, { once: true });
		}

		// Lenis 초기 정지 (preloader 중)
		lenis.stop();

		// ── heroScrollTrigger + orbHomePath (preloader 완료 후 실행) ──────────
		const setupScrollTriggers = () => {
		const homeSection = document.querySelector<HTMLElement>('[home-hero]');
		if (homeSection) {
			[
				{ sel: '[hh-tb="1"]', x: '-20em' },
				{ sel: '[hh-tb="2"]', x: '-10em' },
				{ sel: '[hh-tb="3"]', x: '-5em' },
			].forEach(({ sel, x }) => {
				gsap.to(sel, {
					x,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: homeSection,
						start: 'top top',
						end: 'bottom top',
						scrub: true,
					},
				});
			});

			const chars = homeSection.querySelectorAll<HTMLElement>('[split-hero] .char');
			if (chars.length) {
				gsap.to(chars, {
					y: '101%',
					autoAlpha: 0,
					stagger: { each: 0.03, from: 'random' },
					scrollTrigger: {
						trigger: homeSection,
						start: 'top top',
						end: 'bottom top',
						scrub: true,
					},
				});
			}
		}

		// ── 4. orbHomePath ────────────────────────────────────────────────────
		const orbObj = document.querySelector<HTMLElement>('[data-orb]');
		const orbOutline1 = document.querySelector<HTMLElement>('[orb-out-w="1"]');
		const orbOutline2 = document.querySelector<HTMLElement>('[orb-out-w="2"]');

		if (orbObj && orbOutline1 && orbOutline2) {
			const commonST = {
				trigger: '.page-w',
				start: 'top top',
				end: 'bottom bottom',
				scrub: true,
				immediateRender: false,
			};

			// Orb 본체 이동 경로
			const tl = gsap.timeline({ scrollTrigger: commonST });
			tl.to(orbObj, { x: '50vw', scale: 2, duration: 0.15, ease: 'power2.out' })
				.to(orbObj, { x: '-50vw', y: '-20vh', scale: 1.5, duration: 0.15, ease: 'power2.inOut' })
				.to(orbObj, { x: '0vw', y: '50vh', scale: 0, duration: 0.05 })
				.to(orbObj, { x: '0vw', scale: 0, duration: 0.025 })
				.to(orbObj, { x: '0vw', y: '0vh', scale: 1, duration: 0.125 })
				.to(orbObj, { x: '-25vw', y: '20vh', scale: 1.5, duration: 0.1 })
				.to(orbObj, { x: '-60vw', y: '-75vh', scale: 0, ease: 'power1.out', duration: 0.05 })
				.to(orbObj, { x: '0vw', y: '0vh', scale: 0, duration: 0.3 });

			// Outline 1
			const tlOut1 = gsap.timeline({ scrollTrigger: commonST });
			tlOut1
				.to(orbOutline1, { x: '10vw', y: '0vh', scale: 1.2, duration: 0.15, overwrite: 'auto' })
				.to(orbOutline1, { x: '-30vw', y: '0vh', scale: 1.3, duration: 0.15 })
				.to(orbOutline1, { x: '0vw', y: '50vh', scale: 1, duration: 0.05 })
				.to(orbOutline1, { x: '0vw', y: '50vh', scale: 0.8, duration: 0.025 })
				.to(orbOutline1, { x: '0vw', y: '0vh', scale: 1, duration: 0.125 })
				.to(orbOutline1, { x: '30vw', y: '-20vh', scale: 0.7, duration: 0.15 })
				.to(orbOutline1, { x: '0vw', y: '0vh', scale: 1, duration: 0.05 })
				.to(orbOutline1, { x: '0vw', y: '0vh', scale: 0, duration: 0.25 })
				.to(orbOutline1, { x: '49vw', y: '0vh', scale: 1, duration: 0.05 });

			// Outline 2
			const tlOut2 = gsap.timeline({ scrollTrigger: commonST });
			tlOut2
				.to(orbOutline2, { x: '25vw', y: '0vh', scale: 1.3, duration: 0.15, overwrite: 'auto' })
				.to(orbOutline2, { x: '-9vw', y: '32vh', scale: 0.6, duration: 0.15 })
				.to(orbOutline2, { x: '0vw', y: '50vh', scale: 1, duration: 0.05 })
				.to(orbOutline2, { x: '0vw', y: '50vh', scale: 0.8, duration: 0.025 })
				.to(orbOutline2, { x: '0vw', y: '0vh', scale: 1, duration: 0.125 })
				.to(orbOutline2, { x: '0vw', y: '14vh', scale: 1.2, duration: 0.15 })
				.to(orbOutline2, { x: '0vw', y: '0vh', scale: 0.6, duration: 0.05 })
				.to(orbOutline2, { x: '0vw', y: '0vh', scale: 0, duration: 0.25 })
				.to(orbOutline2, { x: '29vw', y: '0vh', scale: 1.5, duration: 0.05 });
		}

		// ── 5. homeGridAnim ───────────────────────────────────────────────────
		// 실제 bundle 정확 복원: trigger=gridWrap(not wrapper), start="top bottom+=5%"
		const gridWrap = document.querySelector<HTMLElement>('[grid-anim]');
		if (gridWrap) {
			const gridItems = gridWrap.querySelectorAll<HTMLElement>('.hg-grid-item');
			const gridItemsInner = [...gridItems].map((item) =>
				item.querySelector<HTMLElement>('.hg-grid-inner')
			);
			const gridTexts = gridWrap.querySelectorAll<HTMLElement>('.text-small');
			// overlay words (.hg-grid-overlay [split-text] .word)
			const wordElems = document.querySelectorAll<HTMLElement>(
				'.hg-grid-overlay [split-text] .word'
			);

			// 초기 텍스트 사이즈 3em (bundle에서 set함)
			gsap.set(gridTexts, { fontSize: '3em' });

			// ─ Grid 3D fly-in timeline (perspective는 CSS에서 설정: var(--perspective)=4000px)
			const gridTL = gsap.timeline({
				defaults: { ease: 'none' },
				scrollTrigger: {
					trigger: gridWrap,
					start: 'top bottom+=5%',
					end: 'bottom top-=5%',
					scrub: true,
					id: 'gridTimelineTrigger',
				},
			});

			gridTL
				.set(gridItems, {
					transformOrigin: '50% 0%',
					z: () => gsap.utils.random(-6000, -100),
					rotationX: () => gsap.utils.random(-65, -25),
					autoAlpha: 0.5,
				})
				.to(gridWrap, { scale: 0.8 }, 0)
				.to(
					gridItems,
					{
						xPercent: () => gsap.utils.random(-150, 150),
						yPercent: () => gsap.utils.random(-300, 300),
						rotationX: 0,
						autoAlpha: 2,
					},
					0
				)
				.to(gridWrap, { z: 6500 }, 0)
				.fromTo(gridItemsInner, { scale: 2 }, { scale: 1 }, 0)
				.fromTo(gridTexts, { fontSize: '1.2em' }, { fontSize: '0.7em' }, 0);

			// ─ Overlay words timeline (별도 trigger)
			if (wordElems.length) {
				const wordFrom = { autoAlpha: 0, yPercent: 101, duration: 2, ease: 'power4.inOut' };
				const wordTo = {
					autoAlpha: 1,
					yPercent: 0,
					stagger: { each: 0.05, from: 'random' as const },
					duration: 2,
					ease: 'power4.inOut',
				};
				const wordsTL = gsap.timeline({
					scrollTrigger: {
						trigger: gridWrap,
						start: 'top bottom-=40%',
						end: 'center top',
						scrub: true,
						id: 'wordsTimelineTrigger',
					},
				});
				wordsTL
					.fromTo(wordElems, wordFrom, wordTo)
					.to(wordElems, { ...wordFrom, stagger: { each: 0.05, from: 'start' as const } });
			}
		}

		// ── 6. logoRevealScroll (HSC) ─────────────────────────────────────────
		const hscTrack = document.querySelector<HTMLElement>('[hsc-track]');
		if (hscTrack) {
			const hscScale = hscTrack.querySelector<HTMLElement>('[hsc-scale]');
			const hscImg = hscTrack.querySelector<HTMLElement>('[hsc-img]');
			const hscRotate = hscTrack.querySelector<HTMLElement>('[hsc-rotate]');
			const hscText = hscTrack.querySelector<HTMLElement>('[hsc-text]');
			const hscTextInner = hscTrack.querySelector<HTMLElement>('.h-c.is-anim');
			// 텍스트 초기 상태 설정 (GSAP이 관리)
			// 그라데이션([gradient-evolve])은 CSS에서 항상 보이도록 유지 (원본과 동일)
			if (hscTextInner) gsap.set(hscTextInner, { autoAlpha: 0, y: '2em' });

			if (hscScale) {
				gsap.to(hscScale, {
					scale: 29,
					scrollTrigger: { trigger: '[hsc-track]', scrub: true, start: 'top top', end: 'bottom top' },
				});
			}
			if (hscImg) {
				gsap.to(hscImg, {
					width: '20.5em',
					height: '20.5em',
					scrollTrigger: { trigger: '[hsc-track]', scrub: true, start: 'top top', end: 'bottom top' },
				});
				// 이미지 등장 (scale 0→1, rotation 0→45°)
				gsap.fromTo(
					hscImg,
					{ scale: 0, rotation: 0 },
					{ scale: 1, rotation: 45, scrollTrigger: { trigger: '[hsc-track]', scrub: true, start: 'top center', end: 'top top' } },
				);
			}
			if (hscRotate) {
				gsap.to(hscRotate, {
					rotation: 180,
					scrollTrigger: { trigger: '[hsc-track]', scrub: true, start: 'top top', end: 'bottom top' },
				});
			}

			if (hscText) {
				// 텍스트 슬라이드인 + fade-in (x: 50vw→0, opacity: 0→1)
				gsap.fromTo(
					hscText,
					{ x: '50vw', autoAlpha: 0 },
					{ x: '0vw', autoAlpha: 1, scrollTrigger: { trigger: '[hsc-track]', scrub: true, start: 'top top', end: 'bottom-=100 bottom' } },
				);
				// 텍스트 아래로 퇴장
				gsap.fromTo(
					hscText,
					{ y: '0vh' },
					{ y: '20vh', scrollTrigger: { trigger: '[hsc-track]', scrub: true, start: 'bottom bottom', end: 'bottom+=100 center' } },
				);
			}
			// h-c.is-anim 자체도 스크롤 시작점에서 reveal (y: 2em→0, opacity: 0→1)
			if (hscTextInner) {
				gsap.to(hscTextInner, {
					autoAlpha: 1,
					y: '0em',
					scrollTrigger: { trigger: '[hsc-track]', scrub: true, start: 'top center', end: 'top top' },
				});
			}

			// 단어 교차 애니메이션
			const wordEls = hscTrack.querySelectorAll<HTMLElement>('.word');
			wordEls.forEach((el, idx) => {
				gsap.fromTo(
					el,
					{ yPercent: 0 },
					{
						yPercent: idx % 2 === 0 ? -101 : 101,
						scrollTrigger: {
							trigger: '[hsc-track]',
							scrub: true,
							start: 'bottom bottom-=100',
							end: 'bottom center-=100',
						},
					},
				);
			});

			// 섹션 스케일 다운 + boxShadow
			ScrollTrigger.create({
				trigger: '[hsc-track]',
				scrub: true,
				start: 'bottom center',
				end: 'bottom top',
				onUpdate: (self) => {
					gsap.to('.s.is-hsc', {
						scale: 1 - 0.1 * self.progress,
						boxShadow: `0 0 0 ${1.5 * self.progress}px var(--light-grey)`,
					});
				},
			});
		}

		// ── 7. workScrollMorph ────────────────────────────────────────────────
		// 실제 bundle: innerWidth > 991 조건, MorphSVG hover, word y 초기값 0.75em
		const homeWork = document.querySelector<HTMLElement>('[home-work]');
		if (homeWork) {
			const items = homeWork.querySelectorAll<HTMLElement>('.hcs-item-w');
			gsap.set(items, { y: '0em' });

			// ─ 스크롤 parallax (데스크탑만)
			if (window.innerWidth > 991) {
				items.forEach((item, idx) => {
					const isOdd = (idx + 1) % 2 !== 0;
					ScrollTrigger.create({
						trigger: '[home-work]',
						start: 'top top',
						end: 'bottom bottom',
						scrub: true,
						onUpdate: (self) => {
							gsap.to(item, {
								y: gsap.utils.interpolate('0em', isOdd ? '-10em' : '10em', self.progress),
								overwrite: 'auto',
							});
						},
					});
				});

				// ─ MorphSVG hover (cross → arrow)
				// MorphSVGPlugin이 있을 때만 실행
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const MorphPlugin = (gsap as any).plugins?.morphSVG;
				const morphArrowPath =
					'M69.4 148.3 125 90.7H4.8c-1 0-1.8-.8-1.8-2V73.8c0-1.2.8-2 1.8-2h120.5L69.4 13.7c-1.3-1.5-.5-2.5 1-2.5H90c1 0 1.8.3 2.5 1L158 80.6v1l-65.4 67.9c-.8.7-1.5 1.3-2.5 1.3H70.4c-1.5 0-2.2-1.2-1-2.5z';

				items.forEach((item) => {
					const svgPath = item.querySelector<SVGPathElement>('.hcs-cross-svg');
					const words = item.querySelectorAll<HTMLElement>('.hcs-title-w .word');

					// 초기 word 상태
					gsap.set(words, { y: '0.75em' });

					item.addEventListener('mouseenter', () => {
						if (svgPath && MorphPlugin) {
							gsap.to(svgPath, { morphSVG: morphArrowPath, duration: 0.6 });
						}
						gsap.killTweensOf(words);
						gsap.to(words, { y: 0, stagger: 0.1, duration: 0.3 });
					});

					item.addEventListener('mouseleave', () => {
						if (svgPath && MorphPlugin) {
							gsap.to(svgPath, { morphSVG: svgPath, duration: 0.6 });
						}
						gsap.killTweensOf(words);
						gsap.to(words, { y: '0.75em', stagger: 0.05, duration: 0.6 });
					});
				});
			}
		}

		// ── 8. stagger-scroll / stagger-lines / btn-reveal 공통 ───────────────
		// immediateRender: false → trigger 발동 전까지 from 상태 적용 안 함
		// (refresh로 scroll 복원 시 words가 즉시 invisible해지는 문제 방지)
		document.querySelectorAll<HTMLElement>('[stagger-scroll]').forEach((el) => {
			const words = el.querySelectorAll('.word');
			if (words.length) {
				gsap.from(words, {
					autoAlpha: 0,
					yPercent: -101,
					duration: 2,
					ease: 'power4.inOut',
					stagger: { each: 0.05, from: 'random' },
					immediateRender: false,
					scrollTrigger: {
						trigger: el,
						start: '20% bottom',
						once: true,
					},
				});
			}
		});

		document.querySelectorAll<HTMLElement>('[stagger-lines]').forEach((el) => {
			const lines = el.querySelectorAll('.line');
			if (lines.length) {
				gsap.from(lines, {
					autoAlpha: 0,
					yPercent: -101,
					duration: 2,
					ease: 'power4.inOut',
					stagger: { each: 0.05, from: 'start' },
					immediateRender: false,
					scrollTrigger: {
						trigger: el,
						start: '20% bottom',
						once: true,
					},
				});
			}
		});

		document.querySelectorAll<HTMLElement>('[btn-reveal]').forEach((btn) => {
			const target = btn.querySelector<HTMLElement>('[reveal-target]');
			if (target) {
				gsap.from(target, {
					yPercent: 101,
					autoAlpha: 0,
					duration: 1,
					ease: 'power1.out',
					immediateRender: false,
					scrollTrigger: {
						trigger: btn,
						start: '20% bottom',
						once: true,
					},
				});
			}
		});

		ScrollTrigger.refresh();
		}; // end setupScrollTriggers

		})();

		// ── cleanup ───────────────────────────────────────────────────────────
		return () => {
			lenis?.destroy();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			ScrollTriggerModule?.getAll().forEach((t: any) => t.kill());
		};
	});
</script>

<!-- 홈 섹션들 (.page-w는 layout.svelte에서 감쌈) -->
<!-- 원본 순서: HomeHero → HomeMission → HomeClients → HomeWork → HomeGrid → HomeAwards → HomeHSC → HomeFooter -->
<main data-taxi="" class="main-w">
	<HomeHero />
	<HomeMission />
	<HomeClients />
	<HomeWork />
	<HomeGrid />
	<HomeAwards />
	<HomeHSC />
	<HomeFooter />
</main>

<style>
	.main-w {
		width: 100%;
	}
</style>