<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import { user, authInitialized } from '$lib/stores/auth';

	interface Book {
		id: string;
		title: string;
		author: string;
		status: 'want_to_read' | 'currently_reading' | 'finished';
		rating?: number;
		cover_url?: string;
		user_id: string;
		created_at: string;
	}

	let books: Book[] = [];
	let loading = true;
	let activeShelf = 'all';

	const shelves = {
		all: 'All Books',
		want_to_read: 'Want to Read',
		currently_reading: 'Currently Reading',
		finished: 'Finished'
	};

	onMount(async () => {
		// Wait for authentication to be initialized
		await waitForAuth();
		await fetchBooks();
	});

	async function waitForAuth() {
		// Check if auth is already initialized
		if ($authInitialized) {
			return;
		}
		
		// Wait for authentication to be initialized
		return new Promise<void>((resolve) => {
			const unsubscribe = authInitialized.subscribe((initialized) => {
				if (initialized) {
					unsubscribe();
					resolve();
				}
			});
		});
	}

	async function fetchBooks() {
        console.log('runnign fetch', $user)
		if (!$user) {
			console.error('User not authenticated');
			loading = false;
			return;
		}

		loading = true;
		const { data, error } = await supabase
			.from('books')
			.select('*')
			.eq('user_id', $user.id)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching books:', error);
		} else {
			books = data || [];
		}
		loading = false;
	}

	$: filteredBooks = activeShelf === 'all' ? books : books.filter((b) => b.status === activeShelf);
</script>

<div class="container">
	<div class="header">
		<h1>My Library</h1>
		<a href="/books/add" class="add-btn">+ Add Book</a>
	</div>

	<div class="shelves">
		{#each Object.entries(shelves) as [key, label]}
			<button
				class="shelf-btn"
				class:active={activeShelf === key}
				on:click={() => (activeShelf = key)}
			>
				{label}
				{#if key !== 'all'}
					<span class="count">
						({books.filter((b) => b.status === key).length})
					</span>
				{/if}
			</button>
		{/each}
	</div>

	{#if loading}
		<p class="loading">Loading your books...</p>
	{:else if filteredBooks.length === 0}
		<div class="empty-state">
			<p>No books in this shelf yet.</p>
			<a href="/books/add">Add your first book</a>
		</div>
	{:else}
		<div class="book-grid">
			{#each filteredBooks as book (book.id)}
				<a href="/books/{book.id}" class="book-card">
					<div class="book-cover">
						{#if book.cover_url}
							<img src={book.cover_url} alt={book.title} />
						{:else}
							<div class="placeholder-cover">
								<span>📖</span>
							</div>
						{/if}
					</div>
					<div class="book-info">
						<h3>{book.title}</h3>
						<p class="author">{book.author}</p>
						{#if book.rating}
							<div class="rating">
								{'⭐'.repeat(book.rating)}
							</div>
						{/if}
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}

	h1 {
		color: #333;
	}

	.add-btn {
		background: #667eea;
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		text-decoration: none;
		font-weight: 600;
	}

	.add-btn:hover {
		background: #5568d3;
	}

	.shelves {
		display: flex;
		gap: 1rem;
		margin-bottom: 2rem;
		border-bottom: 2px solid #e0e0e0;
	}

	.shelf-btn {
		background: none;
		border: none;
		padding: 1rem 1.5rem;
		font-size: 1rem;
		font-weight: 600;
		color: #666;
		cursor: pointer;
		border-bottom: 3px solid transparent;
		margin-bottom: -2px;
	}

	.shelf-btn:hover {
		color: #333;
	}

	.shelf-btn.active {
		color: #667eea;
		border-bottom-color: #667eea;
	}

	.count {
		font-size: 0.875rem;
		color: #999;
	}

	.book-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 2rem;
	}

	.book-card {
		background: white;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		text-decoration: none;
		color: inherit;
		transition: transform 0.2s;
	}

	.book-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.book-cover {
		aspect-ratio: 2/3;
		overflow: hidden;
	}

	.book-cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.placeholder-cover {
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 4rem;
	}

	.book-info {
		padding: 1rem;
	}

	.book-info h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.1rem;
		color: #333;
	}

	.author {
		color: #666;
		font-size: 0.9rem;
		margin: 0;
	}

	.rating {
		margin-top: 0.5rem;
		font-size: 0.9rem;
	}

	.loading {
		text-align: center;
		padding: 3rem;
		color: #666;
	}

	.empty-state {
		text-align: center;
		padding: 3rem;
		color: #666;
	}

	.empty-state a {
		display: inline-block;
		margin-top: 1rem;
		color: #667eea;
		text-decoration: none;
		font-weight: 600;
	}
</style>
