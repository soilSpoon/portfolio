<script lang="ts">
	import { dev } from '$app/environment';
	import { browser } from '$app/environment';
	let { children } = $props();
</script>

{#if dev && browser}
	{#await import('sv-agentation') then { Agentation }}
		<Agentation />
	{/await}
{/if}

{@render children()}
