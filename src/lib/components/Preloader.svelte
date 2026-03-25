<script lang="ts">
	import { onMount } from 'svelte';

	// ─── Props ────────────────────────────────────────────────────────────────
	interface Props {
		onDone: () => void;
	}
	let { onDone }: Props = $props();

	// ─── 상태 ─────────────────────────────────────────────────────────────────
	let visible = $state(true);
	let percentValue = $state(0);

	// ─── DOM refs ─────────────────────────────────────────────────────────────
	let pathX = $state<SVGPathElement | null>(null);
	let pathC = $state<SVGPathElement | null>(null);
	let fillEl = $state<HTMLElement | null>(null);
	let maskEl = $state<HTMLElement | null>(null);
	let prePercentEl = $state<HTMLElement | null>(null);

	// ─── 상수 ─────────────────────────────────────────────────────────────────
	// 원본 소스에서 추출한 CustomEase 곡선
	const LOAD_EASE =
		'M0,0,C0,0,0.13,0.34,0.238,0.442,0.305,0.506,0.322,0.514,0.396,0.54,' +
		'0.478,0.568,0.468,0.56,0.522,0.584,0.572,0.606,0.61,0.719,0.714,0.826,' +
		'0.798,0.912,1,1,1,1';

	// "build" 텍스트를 char 단위로 분리 (SplitType 역할)
	const BUILD_CHARS = ['b', 'u', 'i', 'l', 'd'];

	// ─── 메인 ─────────────────────────────────────────────────────────────────
	onMount(async () => {
		// 원본과 동일: 페이지 로드마다 항상 프리로더 실행
		// (첫 방문: 4s, 재방문: 1s — sessionStorage 스킵 없음)

		// 첫 방문 여부로 로더 시간 결정
		const isFirstVisit = !localStorage.getItem('visited');
		const loaderDuration = isFirstVisit ? 4 : 1;
		localStorage.setItem('visited', 'true');

		// SSR 안전: onMount 내에서 동적 import
		const { gsap } = await import('gsap');
		const { CustomEase } = await import('gsap/CustomEase');
		gsap.registerPlugin(CustomEase);

		// ── 초기 상태 세팅 ─────────────────────────────────────────────────────
		const chars = document.querySelectorAll<HTMLElement>('.pre-char');
		gsap.set(chars, { yPercent: 101 });
		if (prePercentEl) gsap.set(prePercentEl, { yPercent: 101 });
		if (fillEl) gsap.set(fillEl, { scaleY: 0, transformOrigin: 'bottom center' });

		// ── Phase 1 (0s): SVG 선 드로우인 ─────────────────────────────────────
		if (pathX && pathC) {
			const xLen = pathX.getTotalLength();
			const cLen = pathC.getTotalLength();

			gsap.set(pathX, { strokeDasharray: xLen, strokeDashoffset: xLen });
			gsap.set(pathC, { strokeDasharray: cLen, strokeDashoffset: cLen });

			gsap.to(pathX, { strokeDashoffset: 0, duration: 1, ease: 'power1.inOut' });
			gsap.to(pathC, { strokeDashoffset: 0, duration: 1, ease: 'power1.inOut' });
		}

		// ── Phase 2 (0.5s): 텍스트 + 퍼센트 슬라이드인 ────────────────────────
		gsap.to(chars, {
			delay: 0.5,
			yPercent: 0,
			duration: 1,
			ease: 'power4.inOut',
			stagger: { each: 0.03, from: 'random' }
		});

		if (prePercentEl) {
			gsap.to(prePercentEl, {
				delay: 0.5,
				yPercent: 0,
				duration: 1,
				ease: 'power4.inOut'
			});
		}

		// 퍼센트 카운터 0 → 100
		const counter = { value: 0 };
		gsap.to(counter, {
			value: 100,
			duration: loaderDuration,
			delay: 0.5,
			ease: 'none',
			onUpdate: () => {
				percentValue = Math.round(counter.value);
			}
		});

		// ── Phase 3 (1.5s): 로고 Fill 채움 ───────────────────────────────────
		if (fillEl) {
			gsap.to(fillEl, {
				scaleY: 1,
				duration: loaderDuration,
				ease: CustomEase.create('loadEase', LOAD_EASE),
				delay: 1.5,
				onComplete: runOutro
			});
		}

		// ── Phase 4: 아웃트로 ─────────────────────────────────────────────────
		function runOutro() {
			// "build" chars 위로 사라짐
			gsap.to(chars, {
				delay: 0.5,
				yPercent: -101,
				duration: 1,
				ease: 'power4.inOut',
				stagger: { each: 0.03, from: 'random' }
			});
			if (prePercentEl) {
				gsap.to(prePercentEl, { delay: 0.5, yPercent: 100, duration: 1, ease: 'power4.inOut' });
			}
			if (maskEl) {
				gsap.to(maskEl, { delay: 0.5, clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: 'power2.inOut' });
			}
			if (pathX && pathC) {
				const xLen = pathX.getTotalLength();
				const cLen = pathC.getTotalLength();
				gsap.to(pathX, { strokeDashoffset: xLen, delay: 0.5, duration: 1, ease: 'power1.inOut' });
				gsap.to(pathC, { strokeDashoffset: cLen, delay: 0.5, duration: 1, ease: 'power1.inOut' });
			}

			// ── Orb 애니메이션 (fill complete 즉시, delay 없음) ───────────────
			// preloader z-index:-5, orb-w z-index:-2, orb z-index:-1
			// → orb가 preloader 위에 보임 (원본 stacking context와 동일)
			const orbEl = document.querySelector<HTMLElement>('[data-orb]');
			if (orbEl) {
				// Phase 1 (0s~1s): translate(8em,8.1em) 위치에서 0em→4.3em tiny dot
				gsap.to(orbEl, {
					autoAlpha: 1,
					width: '4.3em',
					height: '4.3em',
					duration: 1,
				});
				// Phase 2 (1s~2s): 중앙(0,0)으로 이동하며 4.3em→80vh full orb
				// Phase 2 완료 시 preloader:done dispatch → 프리로더 fade out
				gsap.to(orbEl, {
					x: 0,
					y: 0,
					width: '80vh',
					height: '80vh',
					minHeight: '45em',
					minWidth: '45em',
					duration: 1,
					ease: 'power2.inOut',
					delay: 1,
					onComplete: () => {
						document.documentElement.dataset.preloaderDone = 'true';
						window.dispatchEvent(new CustomEvent('preloader:done'));
						sessionStorage.setItem('preloaderHasRun', 'true');
						onDone();
						gsap.to('.preloader', {
							autoAlpha: 0,
							duration: 0.2,
							ease: 'none',
							onComplete: () => {
								visible = false;
							}
						});
					}
				});
			}

			// ── orbOutline 등장 (fill complete 즉시) ──────────────────────────
			// outline1: 즉시 scale:0→1, 2s / outline2: delay:1, 2s
			// 이후 breathing: scale 1→1.3→1.2 (out1), 1→0.9 (out2)
			const outlineEl1 = document.querySelector<HTMLElement>('[orb-outline="1"]');
			const outlineEl2 = document.querySelector<HTMLElement>('[orb-outline="2"]');
			if (outlineEl1) {
				gsap.to(outlineEl1, { autoAlpha: 1, scale: 1, duration: 2, ease: 'power2.inOut' });
				gsap.to(outlineEl1, { scale: 1.3, duration: 1, ease: 'power2.inOut', delay: 2 });
				gsap.to(outlineEl1, { scale: 1.2, duration: 1, ease: 'power2.inOut', delay: 3 });
			}
			if (outlineEl2) {
				gsap.to(outlineEl2, { autoAlpha: 1, scale: 1, duration: 2, ease: 'power2.inOut', delay: 1 });
				gsap.to(outlineEl2, { scale: 0.9, duration: 1, ease: 'power2.inOut', delay: 3 });
			}

			// ── Hero chars 슬라이드인 (delay:1) ─────────────────────────────
			// preloader(z-index:-5) 위에 page content(z-index:0)가 있어서
			// 프리로더 실행 중에도 hero chars가 보임 — 원본과 동일
			gsap.to('.hh-text-block .char', {
				delay: 1,
				y: '0%',
				duration: 1,
				ease: 'power4.inOut',
				stagger: { each: 0.03, from: 'random' }
			});
		}
	});
</script>

<!-- ─── 렌더링 ──────────────────────────────────────────────────────────────── -->
{#if visible}
	<div class="preloader" aria-hidden="true" aria-label="Loading">
		<div class="ob-mask-wrap">

			<!-- ① SVG: 크로스(+)와 원형 도트 — 선 드로우인 애니메이션 -->
			<div class="ob-mask-outline">
				<svg
					viewBox="0 0 162 162"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<!--
						st-x: OFF+BRAND 크로스(+) 아이콘 외곽선
						원본 소스에서 추출한 정확한 path
					-->
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
					<!--
						st-c: 오른쪽 하단 원형 도트
					-->
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

			<!-- ② 로고 마스크 + Fill 바: 로고 실루엣 안으로 색이 채워짐 -->
			<div class="ob-fill-mask" bind:this={maskEl}>
				<div class="ob-fill-fill" bind:this={fillEl}></div>
			</div>

		</div>

		<!-- ③ 하단 정보: "build" 텍스트 + 퍼센트 -->
		<div class="pre-info-w">
			<div class="pre-info-inner">
				<!-- "build" 텍스트 — char 단위로 분리 -->
				<div class="o-hidden">
					<div class="pre-text-wrap">
						{#each BUILD_CHARS as char}
							<span class="pre-char">{char}</span>
						{/each}
					</div>
				</div>
				<!-- 퍼센트 카운터 -->
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
	/* ─── 래퍼 ────────────────────────────────────────────────────────────────── */
	.ob-mask-wrap {
		position: relative;
		/* 로고 크기: 뷰포트 기반 (원본 폰트 1em ≈ 1vw 체계) */
		width: 16em;
		height: 16em;
	}

	/* ─── SVG 외곽선 ─────────────────────────────────────────────────────────── */
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

	/* ─── 로고 Fill 마스크 ───────────────────────────────────────────────────── */
	.ob-fill-mask {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		/* 초기 clip-path: 전체 노출 */
		clip-path: inset(0% 0% 0% 0%);
	}

	.ob-fill-fill {
		width: 100%;
		height: 100%;
		/* GSAP으로 scaleY: 0 → 1 */
		transform: scaleY(0);
		transform-origin: bottom center;
	}

	/* ─── 하단 텍스트 영역 ───────────────────────────────────────────────────── */
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

	/* "build" 텍스트 */
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

	/* 퍼센트 */
	.pre-percent {
		font-size: 0.75em;
		letter-spacing: 0.05em;
		font-variant-numeric: tabular-nums;
		opacity: 0.6;
	}
</style>
