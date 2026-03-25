<script lang="ts">
	import { onMount } from 'svelte';
	import { OrbClass } from '$lib/orb.class';

	let orbEl = $state<HTMLDivElement | null>(null);

	onMount(() => {
		if (!orbEl) return;

		const orb = new OrbClass(orbEl);

		// 다크/라이트 모드 전환 감지 → 텍스처 교체
		const observer = new MutationObserver(() => {
			const isDark = !document.documentElement.classList.contains('light');
			orb.setTexture(
				isDark
					? '/ob/textures/ob_texture-old-2.jpg'
					: '/ob/textures/ob_texture-old.webp',
			);
		});
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class'],
		});

		return () => {
			observer.disconnect();
			orb.dispose();
		};
	});
</script>

<!-- data-orb 타깃: layout.svelte의 .orb-w 안에 위치 -->
<!-- GSAP이 초기에 width:0em + autoAlpha:0 으로 세팅 후 두 단계로 애니메이션 (원본과 동일) -->
<div data-orb="" class="orb" bind:this={orbEl}></div>
