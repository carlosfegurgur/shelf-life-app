<script lang="ts">
	import { onMount } from 'svelte';
	import type { Bookshelf } from '$lib/types/types.js';
	import BookShelfCard from '$lib/components/BookShelfCard.svelte';

	let bookshelves: Bookshelf[] = $state([]);
	let loading = $state(true);
	let error = $state('');

	let { data } = $props();
	let { user, supabase } = $derived(data);

	onMount(async () => {
		await fetchBookshelves();
	});

	async function fetchBookshelves() {
		loading = true;
		try {
			// Fetch bookshelves with book counts
			const { data, error: fetchError } = await supabase
				.from('bookshelves')
				.select(`
					id,
					name,
					description,
					user_id,
					created_at,
					updated_at,
					books(count)
				`)
				.eq('user_id', user.id)
				.order('created_at', { ascending: false });

			if (fetchError) {
				console.error('Error fetching bookshelves:', fetchError);
				error = 'Failed to load bookshelves';
			} else {
				bookshelves = (data || []).map(shelf => ({
					...shelf,
					book_count: shelf.books?.[0]?.count || 0
				}));
			}
		} catch (err) {
			console.error('Error:', err);
			error = 'An unexpected error occurred';
		}
		loading = false;
	}

	async function deleteBookshelf(bookshelfId: string) {
		if (!confirm('Are you sure you want to delete this bookshelf? This action cannot be undone.')) {
			return;
		}

		try {
			const { error: deleteError } = await supabase
				.from('bookshelves')
				.delete()
				.eq('id', bookshelfId)
				.eq('user_id', user?.id);

			if (deleteError) {
				console.error('Error deleting bookshelf:', deleteError);
				error = 'Failed to delete bookshelf';
			} else {
				// Remove from local array
				bookshelves = bookshelves.filter(shelf => shelf.id !== bookshelfId);
			}
		} catch (err) {
			console.error('Error:', err);
			error = 'An unexpected error occurred';
		}
	}
</script>

<div class="container">
	<div class="header">
		<h1>My Bookshelves</h1>
		<a href="/bookshelves/add" class="add-btn">+ Add Bookshelf</a>
	</div>

	{#if error}
		<div class="error">{error}</div>
	{/if}

	{#if loading}
		<p class="loading">Loading your bookshelves...</p>
	{:else if bookshelves.length === 0}
		<div class="empty-state">
			<div class="empty-icon">📚</div>
			<h3>No bookshelves yet</h3>
			<p>Create your first bookshelf to organize your books</p>
			<a href="/bookshelves/add" class="create-btn">Create Bookshelf</a>
		</div>
	{:else}
		<div class="bookshelves-grid">
			{#each bookshelves as bookshelf}
				<BookShelfCard {bookshelf} {deleteBookshelf} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	h1 {
		color: #333;
		margin: 0;
	}

	.add-btn {
		background: #667eea;
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		text-decoration: none;
		font-weight: 500;
		transition: background-color 0.2s;
	}

	.add-btn:hover {
		background: #5a6fd8;
	}

	.error {
		background: #fee;
		color: #c33;
		padding: 1rem;
		border-radius: 6px;
		margin-bottom: 1rem;
		border: 1px solid #fcc;
	}

	.loading {
		text-align: center;
		color: #666;
		font-size: 1.1rem;
		padding: 3rem;
	}

	.empty-state {
		text-align: center;
		padding: 4rem 2rem;
		background: white;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.empty-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	.empty-state h3 {
		color: #333;
		margin: 0 0 0.5rem 0;
	}

	.empty-state p {
		color: #666;
		margin: 0 0 2rem 0;
	}

	.create-btn {
		background: #667eea;
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		text-decoration: none;
		font-weight: 500;
		transition: background-color 0.2s;
	}

	.create-btn:hover {
		background: #5a6fd8;
	}

	.bookshelves-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 1.5rem;
	}
</style>
