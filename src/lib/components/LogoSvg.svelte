<script lang="ts">
	interface Props {
		class?: string;
		pathClass?: string;
	}
	let { class: className = '', pathClass = '' }: Props = $props();
</script>

<svg
	viewBox="0 0 162 162"
	xmlns="http://www.w3.org/2000/svg"
	aria-hidden="true"
	class={className || undefined}
>
	<path
		d="M108 88.7c-10.8 0-19.7 8.8-19.7 19.7v47.4c0 1.9-1.5 3.4-3.4 3.4h-8.6c-1.9 0-3.4-1.5-3.4-3.4v-47.4c0-10.8-8.8-19.7-19.7-19.7H6.4c-1.9 0-3.4-1.5-3.4-3.4v-8c0-1.9 1.5-3.4 3.4-3.4h46.9c10.8 0 19.7-8.8 19.6-19.7V6.4c0-1.9 1.5-3.4 3.4-3.4H85c1.9 0 3.4 1.5 3.4 3.4v47.8c0 10.8 8.8 19.7 19.7 19.7h46.6c1.9 0 3.4 1.5 3.4 3.4v8c0 1.9-1.5 3.4-3.4 3.4H108z"
		style="fill-rule:evenodd;clip-rule:evenodd;"
		fill="currentColor"
		class={pathClass || undefined}
	/>
</svg>
