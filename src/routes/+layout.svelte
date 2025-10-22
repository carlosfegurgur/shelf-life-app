<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { user, authInitialized, initAuth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabaseClient';

	onMount(() => {
		initAuth();
	});

	// Redirect to login if user is not authenticated after auth is initialized
	$: if ($authInitialized && !$user) {
		goto('/login');
	}

	async function handleLogout() {
		await supabase.auth.signOut();
		goto('/login');
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app">
	{#if $authInitialized && $user}
		<nav>
			<div class="nav-container">
				<a href="/" class="logo">Shelf Life</a>
				<div class="nav-links">
					<a href="/">Dashboard</a>
					<a href="/library">Library</a>
					<a href="/bookshelves">Bookshelves</a>
					<a href="/books/add">Add Book</a>
					<a href="/profile">Profile</a>
					<button on:click={handleLogout}>Logout</button>
				</div>
			</div>
		</nav>
	{/if}

	<main>
		<slot />
	</main>
</div>

<style>
	.app {
		min-height: 100vh;
		background: #f5f5f5;
	}

	nav {
		background: white;
		border-bottom: 1px solid #e0e0e0;
		padding: 1rem 0;
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 2rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.logo {
		font-size: 1.5rem;
		font-weight: bold;
		text-decoration: none;
		color: #333;
	}

	.nav-links {
		display: flex;
		gap: 2rem;
		align-items: center;
	}

	.nav-links a {
		text-decoration: none;
		color: #666;
		font-weight: 500;
	}

	.nav-links a:hover {
		color: #333;
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

	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}
</style>
