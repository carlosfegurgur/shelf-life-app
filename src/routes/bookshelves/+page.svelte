<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { user, authInitialized } from '$lib/stores/auth';

	interface Bookshelf {
		id: string;
		name: string;
		description?: string;
		color?: string;
		user_id: string;
		created_at: string;
		updated_at?: string;
		book_count?: number;
	}

	let bookshelves: Bookshelf[] = [];
	let loading = true;
	let error = '';

	onMount(async () => {
		await waitForAuth();
		await fetchBookshelves();
	});

	async function waitForAuth() {
		if ($authInitialized) {
			return;
		}
		
		return new Promise<void>((resolve) => {
			const unsubscribe = authInitialized.subscribe((initialized) => {
				if (initialized) {
					unsubscribe();
					resolve();
				}
			});
		});
	}

	async function fetchBookshelves() {
		if (!$user) {
			console.error('User not authenticated');
			loading = false;
			return;
		}

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
				.eq('user_id', $user.id)
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
				.eq('user_id', $user?.id);

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
			{#each bookshelves as bookshelf (bookshelf.id)}
				<div class="bookshelf-card" style="--shelf-color: {bookshelf.color || '#667eea'}">
					<div class="bookshelf-header">
						<div class="bookshelf-info">
							<h3>{bookshelf.name}</h3>
							{#if bookshelf.description}
								<p class="description">{bookshelf.description}</p>
							{/if}
						</div>
						<div class="bookshelf-actions">
							<a href="/bookshelves/{bookshelf.id}/edit" class="edit-btn">Edit</a>
							<button 
								class="delete-btn" 
								on:click={() => deleteBookshelf(bookshelf.id)}
							>
								Delete
							</button>
						</div>
					</div>
					
					<div class="bookshelf-stats">
						<span class="book-count">
							{bookshelf.book_count} {bookshelf.book_count === 1 ? 'book' : 'books'}
						</span>
					</div>
					
					<div class="bookshelf-footer">
						<a href="/bookshelves/{bookshelf.id}" class="view-btn">
							View Books
						</a>
					</div>
				</div>
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

	.bookshelf-card {
		background: white;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		transition: transform 0.2s, box-shadow 0.2s;
		border-left: 4px solid var(--shelf-color);
	}

	.bookshelf-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
	}

	.bookshelf-header {
		padding: 1.5rem 1.5rem 1rem 1.5rem;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.bookshelf-info h3 {
		margin: 0 0 0.5rem 0;
		color: #333;
		font-size: 1.2rem;
	}

	.description {
		margin: 0;
		color: #666;
		font-size: 0.9rem;
		line-height: 1.4;
	}

	.bookshelf-actions {
		display: flex;
		gap: 0.5rem;
	}

	.edit-btn {
		color: #667eea;
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 500;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	.edit-btn:hover {
		background: #f0f2ff;
	}

	.delete-btn {
		background: none;
		border: none;
		color: #e74c3c;
		font-size: 0.9rem;
		font-weight: 500;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.delete-btn:hover {
		background: #fee;
	}

	.bookshelf-stats {
		padding: 0 1.5rem;
		margin-bottom: 1rem;
	}

	.book-count {
		color: #666;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.bookshelf-footer {
		padding: 0 1.5rem 1.5rem 1.5rem;
	}

	.view-btn {
		display: inline-block;
		background: var(--shelf-color);
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 500;
		transition: opacity 0.2s;
	}

	.view-btn:hover {
		opacity: 0.9;
	}
</style>
