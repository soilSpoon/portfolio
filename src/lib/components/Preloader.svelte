<script lang="ts">
	import { onMount } from 'svelte';
	import { animateOrbOutlineBreathing } from '$lib/animations/hero';
	import {
		dispatchIntroDone,
		isFirstVisit,
		markIntroDone,
		markVisited
	} from '$lib/animations/intro-state';
	import { HERO_TEXT_BLOCK_SELECTORS, SELECTORS } from '$lib/animations/selectors';
	import {
		ORB,
		ORB_OUTLINE_REVEAL,
		HERO_CHARS,
		HERO_TEXT_BLOCK_OFFSETS,
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
		gsap.set(chars, { yPercent: 101 });
		if (prePercentEl) gsap.set(prePercentEl, { yPercent: 101 });
		if (fillEl) gsap.set(fillEl, { scaleY: 0, transformOrigin: 'bottom center' });

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

		if (fillEl) {
			gsap.to(fillEl, {
				scaleY: 1,
				duration: loaderDuration,
				ease: CustomEase.create('loadEase', PRELOADER.loadEasePath),
				delay: PRELOADER.fillDelay,
				onComplete: runOutro
			});
		}

		function runOutro() {
			gsap.to(chars, {
				delay: PRELOADER.outroDelay,
				yPercent: -101,
				duration: HERO_CHARS.duration,
				ease: HERO_CHARS.ease,
				stagger: HERO_CHARS.stagger
			});
			if (prePercentEl) {
				gsap.to(prePercentEl, {
					delay: PRELOADER.outroDelay,
					yPercent: 100,
					duration: HERO_CHARS.duration,
					ease: HERO_CHARS.ease
				});
			}
			if (maskEl) {
				gsap.to(maskEl, {
					delay: PRELOADER.outroDelay,
					clipPath: 'inset(0% 0% 100% 0%)',
					duration: PRELOADER.maskDuration,
					ease: 'power2.inOut'
				});
			}
			if (pathX && pathC) {
				const xLen = pathX.getTotalLength();
				const cLen = pathC.getTotalLength();
				gsap.to(pathX, {
					strokeDashoffset: xLen,
					delay: PRELOADER.outroDelay,
					duration: PRELOADER.svgDrawDuration,
					ease: PRELOADER.svgDrawEase
				});
				gsap.to(pathC, {
					strokeDashoffset: cLen,
					delay: PRELOADER.outroDelay,
					duration: PRELOADER.svgDrawDuration,
					ease: PRELOADER.svgDrawEase
				});
			}

			const orbEl = document.querySelector<HTMLElement>(SELECTORS.orb);
			if (orbEl) {
				gsap.set(orbEl, { x: ORB.INIT_X, y: ORB.INIT_Y });
				gsap.to(orbEl, {
					autoAlpha: 1,
					x: ORB.INIT_X,
					y: ORB.INIT_Y,
					width: ORB.TINY,
					height: ORB.TINY,
					duration: 1
				});
				gsap.to(orbEl, {
					x: 0,
					y: 0,
					width: ORB.FULL,
					height: ORB.FULL,
					minHeight: ORB.MIN,
					minWidth: ORB.MIN,
					duration: 1,
					ease: 'power2.inOut',
					delay: 1,
					onComplete: () => {
						markIntroDone();
						dispatchIntroDone();
						onDone?.();
						gsap.to('.preloader', {
							autoAlpha: 0,
							duration: PRELOADER.fadeDuration,
							ease: 'none',
							onComplete: () => {
								visible = false;
							}
						});
					}
				});
			}

			const outlineEl1 = document.querySelector<HTMLElement>(SELECTORS.orbOutline1);
			const outlineEl2 = document.querySelector<HTMLElement>(SELECTORS.orbOutline2);
			if (outlineEl1) {
				gsap.to(outlineEl1, { autoAlpha: 1, scale: 1, ...ORB_OUTLINE_REVEAL });
				animateOrbOutlineBreathing(gsap, outlineEl1, outlineEl2);
			}
			if (outlineEl2) {
				gsap.to(outlineEl2, {
					autoAlpha: 1,
					scale: 1,
					...ORB_OUTLINE_REVEAL,
					delay: 1
				});
			}

			HERO_TEXT_BLOCK_SELECTORS.forEach((selector, index) => {
				gsap.set(selector, { x: HERO_TEXT_BLOCK_OFFSETS[index].x });
			});
			gsap.to(SELECTORS.heroChars, {
				delay: 1,
				y: HERO_CHARS.visibleY,
				duration: HERO_CHARS.duration,
				ease: HERO_CHARS.ease,
				stagger: HERO_CHARS.stagger
			});
		}
	});
</script>

{#if visible}
	<div class="preloader" aria-hidden="true" aria-label="Loading">
		<div class="ob-mask-wrap">
			<div class="ob-mask-outline">
				<svg viewBox="0 0 162 162" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
					<path
						bind:this={pathX}
						class="pre-svg-path"
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
						class="pre-svg-path"
						fill="none"
						stroke-width="0.5"
						stroke-miterlimit="10"
						d="M146.1 134.4h-.7c-6.5 0-11.9 5.3-11.9 11.9v.7
						   c0 6.7 5.5 12.2 12.2 12.2s12.2-5.5 12.2-12.2v-.7
						   c0-6.6-5.2-11.9-11.8-11.9z"
					/>
				</svg>
			</div>

			<div class="ob-fill-mask" bind:this={maskEl}>
				<div class="ob-fill-fill" bind:this={fillEl}></div>
			</div>
		</div>

		<div class="pre-info-w">
			<div class="pre-info-inner">
				<div class="o-hidden">
					<div class="pre-text-wrap">
						{#each BUILD_CHARS as char, i (i)}
							<span class="pre-char">{char}</span>
						{/each}
					</div>
				</div>
				<div class="o-hidden">
					<div class="pre-percent" bind:this={prePercentEl}>
						{percentValue}%
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.ob-mask-wrap {
		position: relative;
		width: 20em;
		height: 20em;
	}

	.ob-mask-outline {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.ob-mask-outline svg {
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.ob-fill-mask {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		clip-path: inset(0% 0% 0% 0%);
	}

	.ob-fill-fill {
		width: 100%;
		height: 100%;
		transform: scaleY(0);
		transform-origin: bottom center;
	}

	.pre-info-w {
		position: fixed;
		bottom: 2.5em;
		left: 2.5em;
	}

	.pre-info-inner {
		display: flex;
		align-items: center;
		gap: 1.5em;
	}

	.pre-text-wrap {
		display: flex;
		gap: 0.05em;
	}

	.pre-char {
		display: inline-block;
		font-size: 0.75em;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		opacity: 0.6;
	}

	.pre-percent {
		font-size: 0.75em;
		letter-spacing: 0.05em;
		font-variant-numeric: tabular-nums;
		opacity: 0.6;
	}
</style>
