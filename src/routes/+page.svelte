<script lang="ts">
	import { onMount } from 'svelte';
	import { user } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
    import RegisterPage from '$lib/components/RegisterPage.svelte';

	onMount(() => {
		// Redirect to login if not authenticated
		if (!$user) {
			goto('/');
		}
	});
</script>

{#if $user}
	<div class="dashboard">
		<h1>Welcome to Shelf Life, {$user?.email || 'User'}!</h1>
		<p>Your personal library management system</p>
		
		<div class="quick-actions">
			<a href="/library" class="action-card">
				<h3>📚 My Library</h3>
				<p>View and manage your book collection</p>
			</a>
			
			<a href="/bookshelves" class="action-card">
				<h3>📖 Bookshelves</h3>
				<p>Organize books into custom shelves</p>
			</a>
			
			<a href="/books/add" class="action-card">
				<h3>➕ Add Book</h3>
				<p>Add a new book to your library</p>
			</a>
		</div>
	</div>
{:else}
	<RegisterPage />
{/if}

<style>
	.dashboard {
		max-width: 800px;
		margin: 0 auto;
	}

	h1 {
		color: #333;
		margin-bottom: 0.5rem;
	}

	.quick-actions {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-top: 2rem;
	}

	.action-card {
		background: white;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		text-decoration: none;
		color: inherit;
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.action-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.action-card h3 {
		margin: 0 0 0.5rem 0;
		color: #667eea;
	}

	.action-card p {
		margin: 0;
		color: #666;
	}

</style>
