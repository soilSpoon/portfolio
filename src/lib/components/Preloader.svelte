<script lang="ts">
	import { onMount } from 'svelte';
	import { buildOrbHeroIntro } from '$lib/animations/hero';
	import {
		dispatchIntroDone,
		isFirstVisit,
		markIntroDone,
		markVisited
	} from '$lib/animations/intro-state';
	import { HERO_TEXT_BLOCK_SELECTORS } from '$lib/animations/selectors';
	import {
		HERO_CHARS,
		HERO_TEXT_BLOCK_OFFSETS,
		ORB_INTRO_TOTAL,
		PRELOADER
	} from '$lib/animations/config';

	interface Props {
		onDone?: () => void;
	}
	let { onDone }: Props = $props();

	let visible = $state(true);
	let percentValue = $state(0);

	let pathX = $state<SVGPathElement | null>(null);
	let pathC = $state<SVGPathElement | null>(null);
	let fillEl = $state<HTMLElement | null>(null);
	let maskEl = $state<HTMLElement | null>(null);
	let prePercentEl = $state<HTMLElement | null>(null);

	const BUILD_CHARS = ['b', 'u', 'i', 'l', 'd'];

	onMount(async () => {
		const loaderDuration = isFirstVisit()
			? PRELOADER.firstVisitDuration
			: PRELOADER.returnVisitDuration;
		markVisited();

		const { gsap } = await import('gsap');
		const { CustomEase } = await import('gsap/CustomEase');
		gsap.registerPlugin(CustomEase);

		const chars = document.querySelectorAll<HTMLElement>('.pre-char');

		// ── 초기 상태 설정 ────────────────────────────────────────────────────
		gsap.set(chars, { yPercent: 101 });
		if (prePercentEl) gsap.set(prePercentEl, { yPercent: 101 });
		if (fillEl) gsap.set(fillEl, { scaleY: 0, transformOrigin: 'bottom center' });

		// ── SVG 드로우인 ──────────────────────────────────────────────────────
		if (pathX && pathC) {
			const xLen = pathX.getTotalLength();
			const cLen = pathC.getTotalLength();

			gsap.set(pathX, { strokeDasharray: xLen, strokeDashoffset: xLen });
			gsap.set(pathC, { strokeDasharray: cLen, strokeDashoffset: cLen });

			gsap.to(pathX, {
				strokeDashoffset: 0,
				duration: PRELOADER.svgDrawDuration,
				ease: PRELOADER.svgDrawEase
			});
			gsap.to(pathC, {
				strokeDashoffset: 0,
				duration: PRELOADER.svgDrawDuration,
				ease: PRELOADER.svgDrawEase
			});
		}

		// ── "build" 텍스트 등장 ───────────────────────────────────────────────
		gsap.to(chars, {
			delay: PRELOADER.charsDelay,
			yPercent: 0,
			duration: HERO_CHARS.duration,
			ease: HERO_CHARS.ease,
			stagger: HERO_CHARS.stagger
		});

		if (prePercentEl) {
			gsap.to(prePercentEl, {
				delay: PRELOADER.charsDelay,
				yPercent: 0,
				duration: HERO_CHARS.duration,
				ease: HERO_CHARS.ease
			});
		}

		// ── 퍼센트 카운터 ─────────────────────────────────────────────────────
		const counter = { value: 0 };
		gsap.to(counter, {
			value: 100,
			duration: loaderDuration,
			delay: PRELOADER.charsDelay,
			ease: 'none',
			onUpdate: () => {
				percentValue = Math.round(counter.value);
			}
		});

		// ── Fill 애니메이션 → runOutro 트리거 ─────────────────────────────────
		if (fillEl) {
			gsap.to(fillEl, {
				scaleY: 1,
				duration: loaderDuration,
				ease: CustomEase.create('loadEase', PRELOADER.loadEasePath),
				delay: PRELOADER.fillDelay,
				onComplete: () => runOutro(gsap, chars)
			});
		}
	});

	function runOutro(gsap: typeof import('gsap').gsap, chars: NodeListOf<HTMLElement>) {
		// ── Preloader UI 페이드아웃 타임라인 ──────────────────────────────────
		const outroTl = gsap.timeline();

		// "build" 텍스트 사라짐
		outroTl.to(
			chars,
			{
				yPercent: -101,
				duration: HERO_CHARS.duration,
				ease: HERO_CHARS.ease,
				stagger: HERO_CHARS.stagger
			},
			PRELOADER.outroDelay
		);

		// 퍼센트 사라짐
		if (prePercentEl) {
			outroTl.to(
				prePercentEl,
				{
					yPercent: 100,
					duration: HERO_CHARS.duration,
					ease: HERO_CHARS.ease
				},
				PRELOADER.outroDelay
			);
		}

		// 마스크 클립
		if (maskEl) {
			outroTl.to(
				maskEl,
				{
					clipPath: 'inset(0% 0% 100% 0%)',
					duration: PRELOADER.maskDuration,
					ease: 'power2.inOut'
				},
				PRELOADER.outroDelay
			);
		}

		// SVG 언드로우
		if (pathX && pathC) {
			const xLen = pathX.getTotalLength();
			const cLen = pathC.getTotalLength();
			outroTl
				.to(
					pathX,
					{
						strokeDashoffset: xLen,
						duration: PRELOADER.svgDrawDuration,
						ease: PRELOADER.svgDrawEase
					},
					PRELOADER.outroDelay
				)
				.to(
					pathC,
					{
						strokeDashoffset: cLen,
						duration: PRELOADER.svgDrawDuration,
						ease: PRELOADER.svgDrawEase
					},
					PRELOADER.outroDelay
				);
		}

		// ── Hero text blocks 초기 위치 설정 (오프스크린) ──────────────────────
		HERO_TEXT_BLOCK_SELECTORS.forEach((selector, index) => {
			gsap.set(selector, { x: HERO_TEXT_BLOCK_OFFSETS[index].x });
		});

		// ── Orb + Outline + Hero chars 인트로 (공유 타임라인 사용) ────────────
		const orbIntroTl = buildOrbHeroIntro(gsap);

		// orb Phase 2 완료 시점에 이벤트 dispatch + preloader fade
		orbIntroTl.call(
			() => {
				markIntroDone();
				dispatchIntroDone();
				onDone?.();

				gsap.to('[data-preloader]', {
					autoAlpha: 0,
					duration: PRELOADER.fadeDuration,
					ease: 'none',
					onComplete: () => {
						visible = false;
					}
				});
			},
			[],
			ORB_INTRO_TOTAL
		);
	}
</script>

{#if visible}
	<div
		data-preloader
		class="fixed inset-0 -z-5 flex items-center justify-center bg-main-light dark:bg-main-dark"
		aria-hidden="true"
		aria-label="Loading"
	>
		<div class="relative h-[20em] w-[20em]">
			<div class="absolute inset-0 h-full w-full">
				<svg
					class="h-full w-full overflow-visible"
					viewBox="0 0 162 162"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						bind:this={pathX}
						class="pre-svg-path stroke-main-dark [stroke-dasharray:1000] [stroke-dashoffset:1000] dark:stroke-main-light"
						fill="none"
						stroke-width="0.5"
						stroke-miterlimit="10"
						d="M108 88.7c-10.8 0-19.7 8.8-19.7 19.7v47.4c0 1.9-1.5 3.4-3.4
						   3.4h-8.6c-1.9 0-3.4-1.5-3.4-3.4v-47.4c0-10.8-8.8-19.7-19.7-19.7H6.4
						   c-1.9 0-3.4-1.5-3.4-3.4v-8c0-1.9 1.5-3.4 3.4-3.4h46.9
						   c10.8 0 19.7-8.8 19.6-19.7V6.4c0-1.9 1.5-3.4 3.4-3.4H85
						   c1.9 0 3.4 1.5 3.4 3.4v47.8c0 10.8 8.8 19.7 19.7 19.7h46.6
						   c1.9 0 3.4 1.5 3.4 3.4v8c0 1.9-1.5 3.4-3.4 3.4H108z"
					/>
					<path
						bind:this={pathC}
						class="pre-svg-path stroke-main-dark [stroke-dasharray:1000] [stroke-dashoffset:1000] dark:stroke-main-light"
						fill="none"
						stroke-width="0.5"
						stroke-miterlimit="10"
						d="M146.1 134.4h-.7c-6.5 0-11.9 5.3-11.9 11.9v.7
						   c0 6.7 5.5 12.2 12.2 12.2s12.2-5.5 12.2-12.2v-.7
						   c0-6.6-5.2-11.9-11.8-11.9z"
					/>
				</svg>
			</div>

			<div
				class="absolute inset-0 h-full w-full mask-[url('/ob-logomark.svg')] mask-contain mask-center mask-no-repeat [clip-path:inset(0%_0%_0%_0%)]"
				bind:this={maskEl}
			>
				<div
					class="h-full w-full origin-bottom scale-y-0 bg-main-dark dark:bg-main-light"
					bind:this={fillEl}
				></div>
			</div>
		</div>

		<div class="fixed bottom-[2.5em] left-[2.5em]">
			<div class="flex items-center gap-[1.5em]">
				<div class="overflow-hidden">
					<div class="flex gap-[0.05em]">
						{#each BUILD_CHARS as char, i (i)}
							<span
								class="pre-char inline-block text-[0.85em] tracking-[0.1em] uppercase opacity-60"
								>{char}</span
							>
						{/each}
					</div>
				</div>
				<div class="overflow-hidden">
					<div
						class="text-[0.85em] tracking-[0.05em] tabular-nums opacity-60"
						bind:this={prePercentEl}
					>
						{percentValue}%
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
