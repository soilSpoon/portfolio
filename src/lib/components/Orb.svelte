<script lang="ts">
	import { onMount } from 'svelte';
	import { OrbClass } from '$lib/orb.class';

	let orbEl = $state<HTMLDivElement | null>(null);

	onMount(() => {
		if (!orbEl) return;

		const orb = new OrbClass(orbEl);

		// 다크/라이트 모드 전환 감지 → procedural palette 크로스페이드
		const observer = new MutationObserver(() => {
			const isDark = !document.documentElement.classList.contains('light');
			orb.setMode(isDark);
		});
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class']
		});

		return () => {
			observer.disconnect();
			orb.dispose();
		};
	});
</script>

<!-- data-orb: GSAP이 초기에 width:0em + autoAlpha:0 세팅 후 두 단계로 애니메이션 -->
<div
	data-orb=""
	class="absolute -z-1 h-0 w-0 overflow-hidden rounded-full opacity-0 will-change-transform"
	bind:this={orbEl}
></div>
