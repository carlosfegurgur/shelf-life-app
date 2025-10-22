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
		bookshelf_id?: string;
	}

	interface Bookshelf {
		id: string;
		name: string;
		color?: string;
	}

	let book: Book | null = null;
	let bookshelves: Bookshelf[] = [];
	let loading = true;
	let error = '';
	let saving = false;

	let form = {
		title: '',
		author: '',
		status: 'want_to_read' as 'want_to_read' | 'currently_reading' | 'finished',
		rating: 0,
		cover_url: '',
		notes: '',
		start_date: '',
		finish_date: '',
		bookshelf_id: ''
	};

	$: bookId = $page.params.id;

	onMount(async () => {
		// Wait for authentication to be initialized
		await waitForAuth();
		await fetchBook();
		await fetchBookshelves();
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

	async function fetchBookshelves() {
		if (!$user) return;

		const { data, error: fetchError } = await supabase
			.from('bookshelves')
			.select('id, name, color')
			.eq('user_id', $user.id)
			.order('name');

		if (fetchError) {
			console.error('Error fetching bookshelves:', fetchError);
		} else {
			bookshelves = data || [];
		}
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
			// Populate form
			if (book) {
				form = {
					title: book.title,
					author: book.author,
					status: book.status,
					rating: book.rating || 0,
					cover_url: book.cover_url || '',
					notes: book.notes || '',
					start_date: book.start_date || '',
					finish_date: book.finish_date || '',
					bookshelf_id: book.bookshelf_id || ''
				};
			}
		}
		loading = false;
	}

	async function handleSubmit() {
		if (!book || !$user) return;

		if (!form.title || !form.author) {
			error = 'Title and author are required';
			return;
		}

		error = '';
		saving = true;

		try {
			const { error: updateError } = await supabase
				.from('books')
				.update({
					title: form.title,
					author: form.author,
					status: form.status,
					rating: form.rating || null,
					cover_url: form.cover_url || null,
					notes: form.notes || null,
					start_date: form.start_date || null,
					finish_date: form.finish_date || null,
					bookshelf_id: form.bookshelf_id || null,
					updated_at: new Date().toISOString()
				})
				.eq('id', book.id)
				.eq('user_id', $user.id);

			if (updateError) throw updateError;

			goto(`/books/${book.id}`);
		} catch (err: any) {
			error = err.message || 'Failed to update book';
			console.error('Error updating book:', err);
		} finally {
			saving = false;
		}
	}

	async function deleteBook() {
		if (!book || !$user) return;

		if (!confirm('Are you sure you want to delete this book? This action cannot be undone.')) {
			return;
		}

		try {
			const { error: deleteError } = await supabase
				.from('books')
				.delete()
				.eq('id', book.id)
				.eq('user_id', $user.id);

			if (deleteError) throw deleteError;

			goto('/library');
		} catch (err: any) {
			error = err.message || 'Failed to delete book';
			console.error('Error deleting book:', err);
		}
	}
</script>

<div class="container">
	{#if loading}
		<div class="loading">
			<p>Loading book details...</p>
		</div>
	{:else if error && !book}
		<div class="error">
			<h2>Error</h2>
			<p>{error}</p>
			<a href="/library" class="back-btn">← Back to Library</a>
		</div>
	{:else if book}
		<div class="edit-page">
			<div class="header">
				<h1>Edit Book</h1>
				<div class="actions">
					<a href="/books/{book.id}" class="back-btn">← Back to Book</a>
					<button on:click={deleteBook} class="delete-btn">Delete Book</button>
				</div>
			</div>

			{#if error}
				<div class="error-message">{error}</div>
			{/if}

			<form on:submit|preventDefault={handleSubmit}>
				<div class="form-row">
					<div class="form-group">
						<label for="title">Title *</label>
						<input id="title" type="text" bind:value={form.title} required />
					</div>
					<div class="form-group">
						<label for="author">Author *</label>
						<input id="author" type="text" bind:value={form.author} required />
					</div>
				</div>

				<div class="form-row">
					<div class="form-group">
						<label for="status">Status</label>
						<select id="status" bind:value={form.status}>
							<option value="want_to_read">Want to Read</option>
							<option value="currently_reading">Currently Reading</option>
							<option value="finished">Finished</option>
						</select>
					</div>
					<div class="form-group">
						<label for="rating">Rating</label>
						<select id="rating" bind:value={form.rating}>
							<option value={0}>No rating</option>
							<option value={1}>1 star</option>
							<option value={2}>2 stars</option>
							<option value={3}>3 stars</option>
							<option value={4}>4 stars</option>
							<option value={5}>5 stars</option>
						</select>
					</div>
				</div>

				<div class="form-group">
					<label for="cover_url">Cover URL</label>
					<input id="cover_url" type="url" bind:value={form.cover_url} />
				</div>

				<div class="form-row">
					<div class="form-group">
						<label for="start_date">Started Date</label>
						<input id="start_date" type="date" bind:value={form.start_date} />
					</div>
					<div class="form-group">
						<label for="finish_date">Finished Date</label>
						<input id="finish_date" type="date" bind:value={form.finish_date} />
					</div>
				</div>

				<div class="form-group">
					<label for="bookshelf">Bookshelf</label>
					<select id="bookshelf" bind:value={form.bookshelf_id}>
						<option value="">No bookshelf</option>
						{#each bookshelves as bookshelf}
							<option value={bookshelf.id}>{bookshelf.name}</option>
						{/each}
					</select>
					{#if bookshelves.length === 0}
						<p class="help-text">
							<a href="/bookshelves/add">Create your first bookshelf</a> to organize your books
						</p>
					{/if}
				</div>

				<div class="form-group">
					<label for="notes">Notes</label>
					<textarea id="notes" bind:value={form.notes} rows="4" placeholder="Add your thoughts about this book..."></textarea>
				</div>

				<div class="form-actions">
					<button type="submit" disabled={saving} class="save-btn">
						{saving ? 'Saving...' : 'Save Changes'}
					</button>
					<a href="/books/{book.id}" class="cancel-btn">Cancel</a>
				</div>
			</form>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 800px;
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

	.help-text {
		margin: 0.5rem 0 0 0;
		font-size: 0.9rem;
		color: #666;
	}

	.help-text a {
		color: #667eea;
		text-decoration: none;
	}

	.help-text a:hover {
		text-decoration: underline;
	}

	.edit-page {
		background: white;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 2rem;
		border-bottom: 1px solid #eee;
	}

	.header h1 {
		margin: 0;
		color: #333;
	}

	.actions {
		display: flex;
		gap: 1rem;
	}

	.back-btn, .delete-btn {
		padding: 0.75rem 1.5rem;
		border-radius: 6px;
		text-decoration: none;
		font-weight: 600;
		border: none;
		cursor: pointer;
		transition: all 0.2s;
	}

	.back-btn {
		background: #f5f5f5;
		color: #666;
		border: 1px solid #ddd;
	}

	.back-btn:hover {
		background: #e0e0e0;
	}

	.delete-btn {
		background: #f44336;
		color: white;
	}

	.delete-btn:hover {
		background: #d32f2f;
	}

	.error-message {
		background: #fee;
		color: #c33;
		padding: 0.75rem;
		margin: 0 2rem 1rem 2rem;
		border-radius: 4px;
	}

	form {
		padding: 2rem;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: #555;
	}

	.form-group input,
	.form-group select,
	.form-group textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
	}

	.form-group input:focus,
	.form-group select:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: #667eea;
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
	}

	.save-btn, .cancel-btn {
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		font-weight: 600;
		cursor: pointer;
		border: none;
		text-decoration: none;
		text-align: center;
		display: inline-block;
	}

	.save-btn {
		background: #667eea;
		color: white;
	}

	.save-btn:hover:not(:disabled) {
		background: #5568d3;
	}

	.save-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.cancel-btn {
		background: #f5f5f5;
		color: #666;
		border: 1px solid #ddd;
	}

	.cancel-btn:hover {
		background: #e0e0e0;
	}

	@media (max-width: 768px) {
		.header {
			flex-direction: column;
			gap: 1rem;
			text-align: center;
		}
		
		.form-row {
			grid-template-columns: 1fr;
		}
		
		.form-actions {
			flex-direction: column;
		}
	}
</style>
