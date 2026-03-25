<script lang="ts">
	import { onMount } from 'svelte';
	import { INTRO_DONE_EVENT, isIntroDone } from '$lib/animations/intro-state';
	import { SELECTORS } from '$lib/animations/selectors';
	import HomeHero from '$lib/components/HomeHero.svelte';
	import HomeMission from '$lib/components/HomeMission.svelte';
	import HomeClients from '$lib/components/HomeClients.svelte';
	import HomeWork from '$lib/components/HomeWork.svelte';
	import HomeGrid from '$lib/components/HomeGrid.svelte';
	import HomeAwards from '$lib/components/HomeAwards.svelte';
	import HomeHSC from '$lib/components/HomeHSC.svelte';
	import HomeFooter from '$lib/components/HomeFooter.svelte';

	// 애니메이션 모듈 — static import 안전 (모듈 레벨에서 gsap 실행 없음, import type만 사용)
	import { initLenis } from '$lib/animations/lenis';
	import { splitAllText } from '$lib/animations/split';
	import {
		setHeroInitialState,
		startOrbRotation,
		setSpaInitialState,
		runHeroIntro,
		setupHeroScroll
	} from '$lib/animations/hero';
	import { setupOrbPath } from '$lib/animations/orb';
	import { setupGrid } from '$lib/animations/grid';
	import { setupHSC } from '$lib/animations/hsc';
	import { setupWork } from '$lib/animations/work';
	import { setupCommonReveal } from '$lib/animations/common';
	import type { LenisInstance, STType } from '$lib/animations/types';

	let mounted = false;

	onMount(() => {
		mounted = true;
		let lenis: LenisInstance | null = null;
		let lenisController: ReturnType<typeof initLenis> | null = null;
		let ST: STType | null = null;

		let cancelled = false;

		const waitForOrbCanvas = (): Promise<void> =>
			new Promise((resolve) => {
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
				}, 2000);

				observer.observe(orbEl, { childList: true });
			});

		const initializePage = async () => {
			// 서드파티 라이브러리만 dynamic import (SSR에서 실행되면 안 됨)
			const [{ gsap }, { ScrollTrigger }, SplitType] = await Promise.all([
				import('gsap'),
				import('gsap/ScrollTrigger'),
				import('split-type').then((m) => m.default)
			]);

			gsap.registerPlugin(ScrollTrigger);
			ST = ScrollTrigger;

			// ── 초기화 ────────────────────────────────────────────────────────
			lenisController = initLenis();
			lenis = lenisController.lenis;
			lenisController.stop();

			splitAllText(SplitType);
			setHeroInitialState(gsap);
			startOrbRotation(gsap);

			if (isIntroDone()) {
				setSpaInitialState(gsap);
			}

			// ── 스크롤 애니메이션 (hero intro 완료 후 실행) ───────────────────
			const ctx = { gsap, ST: ScrollTrigger };

			const setupScrollTriggers = () => {
				setupHeroScroll(ctx);
				setupOrbPath(ctx);
				setupGrid(ctx);
				setupHSC(ctx);
				setupWork(ctx);
				setupCommonReveal(ctx);
				ScrollTrigger.refresh();
			};

			// ── 인트로 실행 분기 ──────────────────────────────────────────────
			if (isIntroDone()) {
				// SPA nav: 프리로더 없음 → 캔버스 대기 후 전체 시퀀스 직접 실행
				await waitForOrbCanvas();
				if (cancelled || !lenis) return;
				runHeroIntro({ ...ctx, lenis, fromPreloader: false, onComplete: setupScrollTriggers });
			} else {
				window.addEventListener(
					INTRO_DONE_EVENT,
					() => {
						if (cancelled || !lenis) return;
						runHeroIntro({ ...ctx, lenis, fromPreloader: true, onComplete: setupScrollTriggers });
					},
					{ once: true }
				);
			}
		};

		void initializePage();

		return () => {
			cancelled = true;
			lenisController?.destroy();
			if (ST) ST.getAll().forEach((trigger) => trigger.kill());
		};
	});
</script>

<!-- 홈 섹션들 (.page-w는 layout.svelte에서 감쌈) -->
<main data-taxi="" class="main-w">
	<HomeHero />
	<HomeMission />
	<HomeClients />
	<HomeWork />
	{#if mounted}
		<HomeGrid />
	{/if}
	<HomeAwards />
	<HomeHSC />
	<HomeFooter />
</main>

<style>
	.main-w {
		width: 100%;
	}
</style>
