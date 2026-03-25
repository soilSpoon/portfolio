<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { children } = $props();

	onMount(() => {
		if (!browser) return;

		const root = document.documentElement;
		const savedTheme = localStorage.getItem('theme') ?? 'light';
		root.classList.remove('light', 'dark');
		root.classList.add(savedTheme === 'dark' ? 'dark' : 'light');
	});
</script>

{@render children()}
