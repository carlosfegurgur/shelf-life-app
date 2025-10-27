<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '$lib/global.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app">
	<Navbar />
	<main>
		<slot />
	</main>
	<Footer />
</div>

<style>
	.app {
		min-height: 100vh;
		background-color: var(--bg-brand-tertiary);
		display: flex;
		flex-direction: column;
	}

	main {
		margin-top: auto;
	}
</style>
