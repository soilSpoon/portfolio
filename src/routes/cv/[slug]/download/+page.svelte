<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';

	let { data } = $props();

	// PIN을 변경하려면 이 값을 수정하세요
	const DOWNLOAD_PIN = '0938';

	let pin = $state('');
	let authorized = $state(false);
	let error = $state('');

	function checkPin() {
		if (pin === DOWNLOAD_PIN) {
			authorized = true;
			error = '';
		} else {
			error = 'PIN이 올바르지 않습니다';
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') checkPin();
	}

	function handlePrint() {
		if (browser) window.print();
	}
</script>

<svelte:head>
	<title>{data.title} 다운로드 — 이대희</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if !authorized}
	<div class="pin-gate">
		<div class="pin-card">
			<h2>PDF 다운로드</h2>
			<p>{data.title}</p>
			<div class="pin-input-group">
				<input
					type="password"
					bind:value={pin}
					onkeydown={handleKeydown}
					placeholder="PIN 입력"
					autocomplete="off"
				/>
				<button onclick={checkPin}>확인</button>
			</div>
			{#if error}
				<p class="pin-error">{error}</p>
			{/if}
		</div>
	</div>
{:else}
	<div class="download-bar no-print">
		<a href={resolve(`/cv/${data.slug}`)}>← 웹으로 보기</a>
		<button onclick={handlePrint}>PDF로 저장</button>
	</div>

	<article>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted local markdown rendered at build time -->
		{@html data.html}
	</article>
{/if}

<style>
	/* ── PIN 입력 화면 ─────────────────────────────────── */
	.pin-gate {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
	}

	.pin-card {
		text-align: center;
	}

	.pin-card h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin: 0 0 0.25rem;
		border: none;
	}

	.pin-card > p {
		color: #888;
		font-size: 0.9rem;
		margin-bottom: 1.5rem;
	}

	.pin-input-group {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
	}

	.pin-input-group input {
		padding: 0.6rem 1rem;
		border: 1px solid #ddd;
		border-radius: 6px;
		font-size: 1rem;
		width: 140px;
		text-align: center;
		letter-spacing: 0.2em;
		outline: none;
		font-family: inherit;
	}

	.pin-input-group input:focus {
		border-color: #888;
	}

	.pin-input-group button {
		padding: 0.6rem 1.25rem;
		background: #111;
		color: #fff;
		border: none;
		border-radius: 6px;
		font-size: 0.9rem;
		cursor: pointer;
		font-family: inherit;
	}

	.pin-input-group button:hover {
		background: #333;
	}

	.pin-error {
		color: #dc2626;
		font-size: 0.85rem;
		margin-top: 0.75rem;
	}

	/* ── 다운로드 바 ───────────────────────────────────── */
	.download-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 0;
		margin-bottom: 1.5rem;
		border-bottom: 1px solid #eee;
	}

	.download-bar a {
		color: #2563eb;
		text-decoration: none;
		font-size: 0.875rem;
	}

	.download-bar a:hover {
		text-decoration: underline;
	}

	.download-bar button {
		padding: 0.5rem 1.25rem;
		background: #111;
		color: #fff;
		border: none;
		border-radius: 6px;
		font-size: 0.875rem;
		cursor: pointer;
		font-family: inherit;
	}

	.download-bar button:hover {
		background: #333;
	}
</style>
