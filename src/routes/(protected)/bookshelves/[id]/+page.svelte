<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import type { Book, Bookshelf } from '$lib/types/types';

	let bookshelf: Bookshelf | null = $state(null);
	let books: Book[] = $state([]);
	let loading = $state(true);
	let error = $state('');

	let { data } = $props();
	let { user, supabase } = $derived(data);

	let bookshelfId = $derived(page.params.id);

	onMount(async () => {
		await fetchBookshelf();
		await fetchBooks();
	});

	async function fetchBookshelf() {
		if (!bookshelfId || !user) {
			error = 'Bookshelf not found or user not authenticated';
			loading = false;
			return;
		}

		const { data, error: fetchError } = await supabase
			.from('bookshelves')
			.select('*')
			.eq('id', bookshelfId)
			.eq('user_id', user.id)
			.single();

		if (fetchError) {
			error = 'Bookshelf not found or access denied';
			console.error('Error fetching bookshelf:', fetchError);
		} else {
			bookshelf = data;
		}
	}

	async function fetchBooks() {
		if (!bookshelfId || !user) {
			loading = false;
			return;
		}

		loading = true;
		const { data, error } = await supabase
			.from('books')
			.select('*')
			.eq('user_id', user.id)
			.eq('bookshelf_id', bookshelfId)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching books:', error);
		} else {
			books = data || [];
		}
		loading = false;
	}

	async function removeBookFromShelf(bookId: string) {
		try {
			const { error: updateError } = await supabase
				.from('books')
				.update({ bookshelf_id: null })
				.eq('id', bookId)
				.eq('user_id', user?.id);

			if (updateError) {
				console.error('Error removing book from shelf:', updateError);
			} else {
				// Remove from local array
				books = books.filter((book) => book.id !== bookId);
			}
		} catch (err) {
			console.error('Error:', err);
		}
	}

	async function deleteBook(bookId: string) {
		if (!confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
			return;
		}

		try {
			const { error: deleteError } = await supabase
				.from('books')
				.delete()
				.eq('id', bookId)
				.eq('user_id', user?.id);

			if (deleteError) {
				console.error('Error deleting book:', deleteError);
			} else {
				// Remove from local array
				books = books.filter((book) => book.id !== bookId);
			}
		} catch (err) {
			console.error('Error:', err);
		}
	}
</script>

<div class="container">
	{#if bookshelf}
		<div class="bookshelf-header" style="--shelf-color: {bookshelf.color || '#667eea'}">
			<div class="bookshelf-info">
				<h1>{bookshelf.name}</h1>
				{#if bookshelf.description}
					<p class="description">{bookshelf.description}</p>
				{/if}
			</div>
			<div class="bookshelf-actions">
				<a href="/bookshelves/{bookshelf.id}/edit" class="edit-btn">Edit Shelf</a>
				<a href="/books/add?bookshelf={bookshelf.id}" class="add-book-btn">+ Add Book</a>
			</div>
		</div>

		<div class="bookshelf-nav">
			<a href="/bookshelves" class="back-link">← Back to Bookshelves</a>
		</div>

		{#if error}
			<div class="error">{error}</div>
		{/if}

		{#if loading}
			<p class="loading">Loading books...</p>
		{:else if books.length === 0}
			<div class="empty-state">
				<div class="empty-icon">📚</div>
				<h3>No books in this shelf</h3>
				<p>Add books to organize them in this bookshelf</p>
				<a href="/books/add?bookshelf={bookshelf.id}" class="add-book-btn">Add First Book</a>
			</div>
		{:else}
			<div class="books-header">
				<h2>Books ({books.length})</h2>
			</div>

			<div class="book-grid">
				{#each books as book (book.id)}
					<div class="book-card">
						<a href="/books/{book.id}" class="book-link">
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
								<div class="status">
									<span class="status-badge status-{book.status}">
										{book.status.replace('_', ' ')}
									</span>
								</div>
							</div>
						</a>

						<div class="book-actions">
							<a href="/books/{book.id}/edit" class="edit-book-btn">Edit</a>
							<button
								class="remove-btn"
								onclick={() => removeBookFromShelf(book.id)}
								title="Remove from shelf"
							>
								Remove
							</button>
							<button class="delete-btn" onclick={() => deleteBook(book.id)} title="Delete book">
								Delete
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	{:else if !loading}
		<div class="error">
			<h2>Bookshelf not found</h2>
			<p>The bookshelf you're looking for doesn't exist or you don't have access to it.</p>
			<a href="/bookshelves" class="back-link">← Back to Bookshelves</a>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		background-color: var(--white);
	}

	.bookshelf-header {
		background: linear-gradient(
			135deg,
			var(--shelf-color),
			color-mix(in srgb, var(--shelf-color) 80%, white)
		);
		color: white;
		padding: 2rem;
		border-radius: 12px;
		margin-bottom: 2rem;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.bookshelf-info h1 {
		margin: 0 0 0.5rem 0;
		font-size: 2rem;
		font-weight: bold;
	}

	.description {
		margin: 0;
		opacity: 0.9;
		font-size: 1.1rem;
		line-height: 1.4;
	}

	.bookshelf-actions {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.edit-btn {
		background: rgba(255, 255, 255, 0.2);
		color: white;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		text-decoration: none;
		font-weight: 500;
		transition: background-color 0.2s;
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	.edit-btn:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	.add-book-btn {
		background: white;
		color: var(--shelf-color);
		padding: 0.5rem 1rem;
		border-radius: 6px;
		text-decoration: none;
		font-weight: 500;
		transition: opacity 0.2s;
	}

	.add-book-btn:hover {
		opacity: 0.9;
	}

	.bookshelf-nav {
		margin-bottom: 2rem;
	}

	.back-link {
		color: #667eea;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
	}

	.back-link:hover {
		color: #5a6fd8;
	}

	.error {
		background: #fee;
		color: #c33;
		padding: 1rem;
		border-radius: 6px;
		margin-bottom: 1rem;
		border: 1px solid #fcc;
	}

	.error h2 {
		margin: 0 0 0.5rem 0;
	}

	.error p {
		margin: 0 0 1rem 0;
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

	.books-header {
		margin-bottom: 1.5rem;
	}

	.books-header h2 {
		color: #333;
		margin: 0;
		font-size: 1.5rem;
	}

	.book-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1.5rem;
	}

	.book-card {
		background: white;
		border-radius: 12px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.book-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
	}

	.book-link {
		display: block;
		text-decoration: none;
		color: inherit;
	}

	.book-cover {
		aspect-ratio: 2/3;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.book-cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.placeholder-cover {
		font-size: 3rem;
		color: #ccc;
	}

	.book-info {
		padding: 1rem;
	}

	.book-info h3 {
		margin: 0 0 0.5rem 0;
		color: #333;
		font-size: 1.1rem;
		line-height: 1.3;
		display: -webkit-box;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.author {
		margin: 0 0 0.5rem 0;
		color: #666;
		font-size: 0.9rem;
	}

	.rating {
		margin: 0 0 0.5rem 0;
		font-size: 0.9rem;
	}

	.status {
		margin: 0;
	}

	.status-badge {
		display: inline-block;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.8rem;
		font-weight: 500;
		text-transform: capitalize;
	}

	.status-want_to_read {
		background: #e3f2fd;
		color: #1976d2;
	}

	.status-currently_reading {
		background: #fff3e0;
		color: #f57c00;
	}

	.status-finished {
		background: #e8f5e8;
		color: #388e3c;
	}

	.book-actions {
		padding: 0 1rem 1rem 1rem;
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.edit-book-btn {
		color: #667eea;
		text-decoration: none;
		font-size: 0.8rem;
		font-weight: 500;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	.edit-book-btn:hover {
		background: #f0f2ff;
	}

	.remove-btn,
	.delete-btn {
		background: none;
		border: none;
		font-size: 0.8rem;
		font-weight: 500;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.remove-btn {
		color: #f57c00;
	}

	.remove-btn:hover {
		background: #fff3e0;
	}

	.delete-btn {
		color: #e74c3c;
	}

	.delete-btn:hover {
		background: #fee;
	}
</style>
