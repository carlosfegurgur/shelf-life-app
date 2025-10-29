<script>
	import MobileIcon from '$lib/assets/mobileIcon.svelte';
    import { Github, Instagram, Youtube } from '@lucide/svelte';
</script>

<footer>
    <div class="container">
        <a href="/" class="icon"><MobileIcon height={35} width={35} /></a>
        <div class="social-links">
            <a href="/"><Instagram /></a>
            <a href="/"><Github /></a>
            <a href="/"><Youtube /></a>
        </div>
    </div>
</footer>

<style>
	footer {
        background: var(--bg);
        margin-top: auto;
	}

    .container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
        max-width: var(--max-width);
        margin: 0 auto;
    }

	.social-links a {
		text-decoration: none;
		color: var(--text);
	}
</style>
