<script lang="ts">
	import { onMount } from 'svelte';
	import { INTRO_DONE_EVENT, isIntroDone } from '$lib/animations/intro-state';
	import HomeHero from '$lib/components/HomeHero.svelte';
	import HomeMission from '$lib/components/HomeMission.svelte';
	import HomeClients from '$lib/components/HomeClients.svelte';
	import HomeWork from '$lib/components/HomeWork.svelte';
	import HomeGrid from '$lib/components/HomeGrid.svelte';
	import HomeAwards from '$lib/components/HomeAwards.svelte';
	import HomeHSC from '$lib/components/HomeHSC.svelte';
	import HomeFooter from '$lib/components/HomeFooter.svelte';

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
	import { waitForOrbCanvas } from '$lib/animations/orb-utils';
	import { setupGrid } from '$lib/animations/grid';
	import { setupHSC } from '$lib/animations/hsc';
	import { setupWork } from '$lib/animations/work';
	import { setupCommonReveal } from '$lib/animations/common';
	import type { LenisController } from '$lib/animations/lenis';
	import type { STType } from '$lib/animations/types';

	let mounted = false;

	onMount(() => {
		mounted = true;
		let lenisController: LenisController | null = null;
		let ST: STType | null = null;
		let cancelled = false;
		let introDoneHandler: (() => void) | null = null;

		const initializePage = async () => {
			const [{ gsap }, { ScrollTrigger }, SplitType] = await Promise.all([
				import('gsap'),
				import('gsap/ScrollTrigger'),
				import('split-type').then((m) => m.default)
			]);

			gsap.registerPlugin(ScrollTrigger);
			ST = ScrollTrigger;

			// ── 초기화 ────────────────────────────────────────────────────────
			lenisController = initLenis();
			lenisController.stop();

			splitAllText(SplitType);
			setHeroInitialState(gsap);
			startOrbRotation(gsap);

			if (isIntroDone()) {
				setSpaInitialState(gsap);
			}

			// ── 스크롤 애니메이션 설정 함수 ────────────────────────────────────
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

			// ── 인트로 실행 + Lenis 시작 ───────────────────────────────────────
			const runIntroAndStartScroll = (fromPreloader: boolean) => {
				console.log('[+page.svelte] runIntroAndStartScroll, fromPreloader:', fromPreloader);
				if (cancelled || !lenisController) return;

				const introTl = runHeroIntro({ gsap }, { fromPreloader });

				introTl.call(
					() => {
						if (cancelled || !lenisController) return;
						lenisController.start();
						setupScrollTriggers();
					},
					[],
					introTl.duration()
				);
			};

			// ── 인트로 실행 분기 ──────────────────────────────────────────────
			if (isIntroDone()) {
				// SPA nav: 프리로더 없음 → 캔버스 대기 후 전체 시퀀스 직접 실행
				await waitForOrbCanvas();
				if (!cancelled) {
					runIntroAndStartScroll(false);
				}
			} else {
				// 첫 방문: Preloader 완료 이벤트 대기
				introDoneHandler = () => {
					runIntroAndStartScroll(true);
				};
				window.addEventListener(INTRO_DONE_EVENT, introDoneHandler, { once: true });
			}
		};

		void initializePage().catch((e) => {
			console.error('Failed to initialize home animations', e);
			lenisController?.destroy();
		});

		return () => {
			cancelled = true;
			if (introDoneHandler) {
				window.removeEventListener(INTRO_DONE_EVENT, introDoneHandler);
				introDoneHandler = null;
			}
			lenisController?.destroy();
			if (ST) ST.getAll().forEach((trigger) => trigger.kill());
		};
	});
</script>

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
