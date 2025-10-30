<script lang="ts">
	import { onMount } from 'svelte';
	import { user, authInitialized, initAuth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';
	import DesktopIcon from '$lib/assets/desktopIcon.svelte';
	import '$lib/global.css';
	import MobileIcon from '$lib/assets/mobileIcon.svelte';
	import Button from './Button.svelte';

	onMount(() => {
		initAuth();
	});

	// Redirect to login if user is not authenticated after auth is initialized
	// $: if ($authInitialized && !$user) {
	// 	goto('/login');
	// }

	async function handleLogout() {
		await supabase.auth.signOut();
		goto('/');
	}

	const NavLinks = [
		{ url: '/library', title: 'Library' },
		{ url: '/bookshelves', title: 'Bookshelves' },
		{ url: '/books/add', title: 'Add Book' },
		{ url: '/profile', title: 'Profile' }
	];
</script>

{#if $authInitialized && $user}
	<nav>
		<div class="nav-container">
			<a href="/" class="mobile-logo"><MobileIcon height={40} width={100} /></a>
			<a href="/" class="desktop-logo"><DesktopIcon height={40} width={100} /></a>

			<div class="nav-links">
				<!-- {#each NavLinks as navlink}
					<a href={navlink.url}>{navlink.title}</a>
				{/each} -->
				<Button onclick={handleLogout} variant="primary">Logout</Button>
			</div>
		</div>
	</nav>
{:else}
	<nav>
		<div class="nav-container">
			<a href="/" class="mobile-logo"><MobileIcon height={40} width={100} /></a>
			<a href="/" class="desktop-logo"><DesktopIcon height={40} width={100} /></a>

			<div class="nav-links">
				<Button href="/signup" variant="primary">Register</Button>
				<Button href="/login" variant="secondary">Log in</Button>
			</div>
		</div>
	</nav>
{/if}

<style>
	nav {
		background: var(--bg);
	}

	.nav-container {
		max-width: var(--max-width);
		margin: 0 auto;
		padding: 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.desktop-logo {
		display: none;
	}

	.nav-links {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	@media only screen and (min-width: 48rem) {
		.mobile-logo {
			display: none;
		}
		.desktop-logo {
			display: inline-block;
		}
	}
</style>
