<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		// mounted 플래그: async import 완료 전 언마운트 시 이벤트 리스너 누수 방지
		let mounted = true;
		let cleanup: (() => void) | undefined;

		(async () => {
			const { gsap } = await import('gsap');

			// 컴포넌트가 import 완료 전에 언마운트된 경우 조기 종료
			if (!mounted) return;

			const cursor = document.querySelector<HTMLElement>('[data-cursor]');
			if (!cursor) return;

			// 커서를 중앙 기준으로 (xPercent/yPercent -50)
			gsap.set(cursor, { xPercent: -50, yPercent: -50, x: -100, y: -100 });

			// 마우스 이동 추적
			const onMouseMove = (e: MouseEvent) => {
				const scale = cursor.classList.contains('mask')
					? 0
					: cursor.classList.contains('hover')
						? 0.55
						: 1;
				gsap.to(cursor, {
					x: e.clientX,
					y: e.clientY,
					scale,
					duration: 0.3,
					ease: 'power2.out',
				});
			};
			document.addEventListener('mousemove', onMouseMove);

			// hover-anim + a 요소 hover 상태
			const addHover = () => cursor.classList.add('hover');
			const removeHover = () => cursor.classList.remove('hover');

			const links = document.querySelectorAll<HTMLElement>('a');
			const hoverEls = document.querySelectorAll<HTMLElement>('[hover-anim]');

			links.forEach((el) => {
				el.addEventListener('mouseover', addHover);
				el.addEventListener('mouseout', removeHover);
			});
			hoverEls.forEach((el) => {
				el.addEventListener('mouseover', addHover);
				el.addEventListener('mouseout', removeHover);
			});

			cleanup = () => {
				document.removeEventListener('mousemove', onMouseMove);
				links.forEach((el) => {
					el.removeEventListener('mouseover', addHover);
					el.removeEventListener('mouseout', removeHover);
				});
				hoverEls.forEach((el) => {
					el.removeEventListener('mouseover', addHover);
					el.removeEventListener('mouseout', removeHover);
				});
			};
		})();

		return () => {
			mounted = false; // async가 완료되기 전에 호출되면 이벤트 등록 자체를 막음
			cleanup?.();
		};
	});
</script>

<!--
	실제 bundle 구조:
	  <div data-cursor-wrap="" pointer-none="" class="cursor-w">  ← mix-blend-mode: difference
	    <div data-cursor="" class="cursor"></div>                  ← 실제 도트 (absolute, 2em)
	  </div>
	wrapper가 fixed full-screen이고, dot은 wrapper 안에서 absolute position으로 GSAP이동
-->
<div data-cursor-wrap="" pointer-none="" class="cursor-w" aria-hidden="true">
	<div data-cursor="" class="cursor"></div>
</div>

<style>
	/* ─── Cursor Wrapper: fixed 전체화면, mix-blend-mode:difference ── */
	.cursor-w {
		position: fixed;
		inset: 0%;
		z-index: 2000;
		pointer-events: none;
		user-select: none;
		mix-blend-mode: difference;
	}

	/* ─── Cursor Dot: 2em × 2em, 흰색 (#fff9 ≈ rgba(255,255,255,0.6)) ── */
	.cursor {
		position: absolute;
		width: 2em;
		height: 2em;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.6);
		will-change: transform;
	}
</style>
