<script>
	import MobileIcon from '$lib/assets/mobileIcon.svelte';
</script>

<footer>
	<a href="/" class="icon"><MobileIcon height={35} width={35} /></a>
	<div class="social-links">
		<a href="/">Instagram</a>
		<a href="/">Youtube</a>
		<a href="/">Twitter</a>
	</div>
</footer>

<style>
	footer {
		margin-top: auto;
		background: var(--bg);
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
	}

	.social-links a {
		text-decoration: none;
		color: var(--text);
	}
</style>
