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
			<a href="/" class="mobile-logo"><MobileIcon /></a>
			<a href="/" class="desktop-logo"><DesktopIcon /></a>
			<div class="nav-links">
				{#each NavLinks as navlink}
					<a href={navlink.url}>{navlink.title}</a>
				{/each}
				<button on:click={handleLogout}>Logout</button>
			</div>
		</div>
	</nav>
{:else}
	<nav>
		<div class="nav-container">
			<a href="/" class="mobile-logo"><MobileIcon /></a>
			<a href="/" class="desktop-logo"><DesktopIcon /></a>

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
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem 2rem;
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

	.nav-links button {
		background: #f44336;
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		font-weight: 500;
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
