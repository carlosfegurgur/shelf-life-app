<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { supabase } from '$lib/supabaseClient';
	import { user, authInitialized } from '$lib/stores/auth';
	import { goto } from '$app/navigation';

	interface Book {
		id: string;
		title: string;
		author: string;
		status: 'want_to_read' | 'currently_reading' | 'finished';
		rating?: number;
		cover_url?: string;
		user_id: string;
		created_at: string;
		updated_at?: string;
		notes?: string;
		start_date?: string;
		finish_date?: string;
	}

	let book: Book | null = null;
	let loading = true;
	let error = '';

	$: bookId = $page.params.id;

	onMount(async () => {
		// Wait for authentication to be initialized
		await waitForAuth();
		await fetchBook();
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

	async function fetchBook() {
		if (!bookId || !$user) {
			error = 'Book not found or user not authenticated';
			loading = false;
			return;
		}

		loading = true;
		const { data, error: fetchError } = await supabase
			.from('books')
			.select('*')
			.eq('id', bookId)
			.eq('user_id', $user.id)
			.single();

		if (fetchError) {
			error = 'Book not found or access denied';
			console.error('Error fetching book:', fetchError);
		} else {
			book = data;
		}
		loading = false;
	}


	async function deleteBook() {
		if (!book || !$user) return;

		if (!confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
			return;
		}

		const { error: deleteError } = await supabase
			.from('books')
			.delete()
			.eq('id', book.id)
			.eq('user_id', $user.id);

		if (deleteError) {
			error = 'Failed to delete book';
			console.error('Error deleting book:', deleteError);
		} else {
			goto('/library');
		}
	}


	function getStatusLabel(status: string) {
		const labels: Record<string, string> = {
			want_to_read: 'Want to Read',
			currently_reading: 'Currently Reading',
			finished: 'Finished'
		};
		return labels[status] || status;
	}

	function formatDate(dateString: string) {
		if (!dateString) return '';
		return new Date(dateString).toLocaleDateString();
	}
</script>

<div class="container">
	{#if loading}
		<div class="loading">
			<p>Loading book details...</p>
		</div>
	{:else if error}
		<div class="error">
			<h2>Error</h2>
			<p>{error}</p>
			<a href="/library" class="back-btn">← Back to Library</a>
		</div>
	{:else if book}
		<div class="book-detail">
			<div class="book-header">
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
					<h1>{book.title}</h1>
					<p class="author">by {book.author}</p>
					
					<div class="book-meta">
						<div class="status">
							<strong>Status:</strong> 
							<span class="status-badge status-{book.status}">
								{getStatusLabel(book.status)}
							</span>
						</div>
						
						{#if book.rating}
							<div class="rating">
								<strong>Rating:</strong> 
								<span class="stars">{'⭐'.repeat(book.rating)}</span>
							</div>
						{/if}
						
						{#if book.start_date}
							<div class="date">
								<strong>Started:</strong> {formatDate(book.start_date)}
							</div>
						{/if}
						
						{#if book.finish_date}
							<div class="date">
								<strong>Finished:</strong> {formatDate(book.finish_date)}
							</div>
						{/if}
					</div>
					
					<div class="actions">
						<a href="/books/{book.id}/edit" class="edit-btn">Edit Book</a>
						<button on:click={deleteBook} class="delete-btn">Delete Book</button>
						<a href="/library" class="back-btn">← Back to Library</a>
					</div>
				</div>
			</div>

			{#if book.notes}
				<div class="notes-section">
					<h3>Notes</h3>
					<p class="notes">{book.notes}</p>
				</div>
			{/if}

		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem;
	}

	.loading, .error {
		text-align: center;
		padding: 3rem;
	}

	.error h2 {
		color: #c33;
		margin-bottom: 1rem;
	}

	.book-detail {
		background: white;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.book-header {
		display: flex;
		gap: 2rem;
		padding: 2rem;
	}

	.book-cover {
		flex-shrink: 0;
		width: 200px;
		height: 300px;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
		flex: 1;
	}

	.book-info h1 {
		font-size: 2.5rem;
		margin: 0 0 0.5rem 0;
		color: #333;
		line-height: 1.2;
	}

	.author {
		font-size: 1.2rem;
		color: #666;
		margin: 0 0 2rem 0;
	}

	.book-meta {
		margin-bottom: 2rem;
	}

	.book-meta > div {
		margin-bottom: 0.75rem;
	}

	.status-badge {
		display: inline-block;
		padding: 0.25rem 0.75rem;
		border-radius: 20px;
		font-size: 0.875rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
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

	.stars {
		font-size: 1.1rem;
	}

	.actions {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.edit-btn, .delete-btn, .back-btn {
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		text-decoration: none;
		font-weight: 600;
		border: none;
		cursor: pointer;
		transition: all 0.2s;
	}

	.edit-btn {
		background: #667eea;
		color: white;
	}

	.edit-btn:hover {
		background: #5568d3;
	}

	.delete-btn {
		background: #f44336;
		color: white;
	}

	.delete-btn:hover {
		background: #d32f2f;
	}

	.back-btn {
		background: #f5f5f5;
		color: #666;
		border: 1px solid #ddd;
	}

	.back-btn:hover {
		background: #e0e0e0;
	}

	.notes-section {
		padding: 2rem;
		border-top: 1px solid #eee;
	}

	.notes-section h3 {
		margin: 0 0 1rem 0;
		color: #333;
	}

	.notes {
		line-height: 1.6;
		color: #555;
		margin: 0;
	}


	@media (max-width: 768px) {
		.book-header {
			flex-direction: column;
			text-align: center;
		}
		
		.book-cover {
			width: 150px;
			height: 225px;
			margin: 0 auto;
		}
		
		.form-row {
			grid-template-columns: 1fr;
		}
		
		.actions {
			justify-content: center;
		}
	}
</style>
