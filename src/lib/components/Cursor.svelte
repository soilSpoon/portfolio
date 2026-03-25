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
					ease: 'power2.out'
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
			mounted = false;
			cleanup?.();
		};
	});
</script>

<!--
	wrapper: fixed full-screen, mix-blend-mode: difference
	dot: absolute position, GSAP moves it
-->
<div data-cursor-wrap="" pointer-none="" class="fixed inset-0 z-[2000] pointer-events-none select-none mix-blend-difference" aria-hidden="true">
	<div data-cursor="" class="absolute h-[2em] w-[2em] rounded-full bg-white/60 will-change-transform"></div>
</div>
