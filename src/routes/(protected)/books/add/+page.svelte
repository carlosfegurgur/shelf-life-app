<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import BookSearchModal from '$lib/components/BookSearchModal.svelte';
	import type { BookSearchResult } from '$lib/types/openLibrary.types';
	import type { Bookshelf } from '$lib/types/types.js';

	let showSearchModal = $state(false);
	let title = $state('');
	let author = $state('');
	let coverUrl = $state('');
	let status = $state('want_to_read');
	let bookshelfId = $state('');
	let bookshelves: Bookshelf[] = $state([]);
	let error = $state('');
	let loading = $state(false);

	let { data } = $props();
	let { user, supabase } = $derived(data);

	let selectedBookshelf = $derived(page.url.searchParams.get('bookshelf'));

	// Pre-fill form when book is selected from search
	function handleBookSelect(book: BookSearchResult) {
		title = book.title;
		author = book.author;
		coverUrl = book.coverUrl || '';
	}

	onMount(async () => {
		await fetchBookshelves();
		// Set bookshelf if provided in URL
		if (selectedBookshelf) {
			bookshelfId = selectedBookshelf;
		}
	});

	async function fetchBookshelves() {
		if (!user) return;
		const { data, error: fetchError } = await supabase
			.from('bookshelves')
			.select('id, name')
			.eq('user_id', user.id)
			.order('name');
		if (fetchError) {
			console.error('Error fetching bookshelves:', fetchError);
		} else {
			bookshelves = data || [];
		}
	}

	async function handleSubmit() {
		loading = true;

		try {
			const { error: insertError } = await supabase.from('books').insert([
				{
					user_id: user.id,
					title,
					author,
					cover_url: coverUrl || null,
					status,
					bookshelf_id: bookshelfId || null
				}
			]);

			if (insertError) throw insertError;

			// Redirect to bookshelf if specified, otherwise to library
			if (bookshelfId) {
				goto(`/bookshelves/${bookshelfId}`);
			} else {
				goto('/library');
			}
		} catch (error) {
			console.error('Error adding book:', error);
		} finally {
			loading = false;
		}
	}
</script>

<div class="container">
	<h1>Add New Book</h1>
	<div class="add-options">
		<button class="search-btn" onclick={() => (showSearchModal = true)}>
			🔍 Search Open Library
		</button>
		<span class="or">or add manually below</span>
	</div>

	{#if error}
		<div class="error">{error}</div>
	{/if}

	<form onsubmit={handleSubmit}>
		<div class="form-group">
			<label for="title">Title *</label>
			<input id="title" type="text" bind:value={title} required placeholder="The Great Gatsby" />
		</div>

		<div class="form-group">
			<label for="author">Author *</label>
			<input
				id="author"
				type="text"
				bind:value={author}
				required
				placeholder="F. Scott Fitzgerald"
			/>
		</div>

		<div class="form-group">
			<label for="coverUrl">Cover Image URL (optional)</label>
			<input
				id="coverUrl"
				type="url"
				bind:value={coverUrl}
				placeholder="https://example.com/cover.jpg"
			/>
		</div>

		<div class="form-group">
			<label for="status">Reading Status</label>
			<select id="status" bind:value={status}>
				<option value="want_to_read">Want to Read</option>
				<option value="currently_reading">Currently Reading</option>
				<option value="finished">Finished</option>
			</select>
		</div>

		<div class="form-group">
			<label for="bookshelf">Bookshelf (optional)</label>
			<select id="bookshelf" bind:value={bookshelfId}>
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

		<div class="button-group">
			<button type="submit" disabled={loading}>
				{loading ? 'Adding...' : 'Add Book'}
			</button>
			<a href="/library" class="cancel-btn">Cancel</a>
		</div>
	</form>
</div>

<BookSearchModal bind:isOpen={showSearchModal} onSelect={handleBookSelect} />

<style>
	.container {
		max-width: 600px;
		margin: 0 auto;
	}

	h1 {
		margin-bottom: 2rem;
		color: #333;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: #555;
	}

	input,
	select {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
	}

	input:focus,
	select:focus {
		outline: none;
		border-color: #667eea;
	}

	.button-group {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
	}

	button {
		flex: 1;
		padding: 0.75rem;
		background: #667eea;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
	}

	button:hover:not(:disabled) {
		background: #5568d3;
	}

	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.cancel-btn {
		flex: 1;
		padding: 0.75rem;
		background: #f5f5f5;
		color: #666;
		border: 1px solid #ddd;
		border-radius: 4px;
		text-align: center;
		text-decoration: none;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cancel-btn:hover {
		background: #e0e0e0;
	}

	.error {
		background: #fee;
		color: #c33;
		padding: 0.75rem;
		border-radius: 4px;
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
</style>
