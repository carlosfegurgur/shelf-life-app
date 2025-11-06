<script lang="ts">
	import '$lib/global.css';
	import DesktopIcon from '$lib/assets/desktopIcon.svelte';
	import MobileIcon from '$lib/assets/mobileIcon.svelte';
	import Button from './Button.svelte';
	import { goto, invalidateAll } from '$app/navigation';

	import { page } from '$app/state';
	let user = $derived(page.data.user);
	let auth = $derived(page.data.supabase.auth);

	async function handleLogout() {
		try {
			await auth.signOut();
			await invalidateAll();
			goto('/');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	}
	
	// const NavLinks = [
	// 	{ url: '/library', title: 'Library' },
	// 	{ url: '/bookshelves', title: 'Bookshelves' },
	// 	{ url: '/books/add', title: 'Add Book' },
	// 	{ url: '/dashboard', title: 'Profile' }
	// ];
</script>

{#if user}
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
