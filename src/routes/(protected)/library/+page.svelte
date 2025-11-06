<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import { Plus } from '@lucide/svelte';
	import BookCard from '$lib/components/BookCard.svelte';

	let loading = $state(true);
	let activeShelf = $state('all');

	let { data } = $props();
	let { books, user, supabase } = $derived(data);
	let filteredBooks = $derived(
		activeShelf === 'all' ? books : books.filter((b) => b.status === activeShelf)
	);

	const shelves = {
		all: 'All Books',
		want_to_read: 'Want to Read',
		currently_reading: 'Currently Reading',
		finished: 'Finished'
	};

	onMount(async () => {
		await fetchBooks();
	});

	async function fetchBooks() {
		loading = true;
		const { data, error } = await supabase
			.from('books')
			.select(`*,bookshelf:bookshelves(name)`)
			.eq('user_id', user.id)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching books:', error);
		} else {
			books = data || [];
		}
		loading = false;
	}
</script>

<div class="container">
	<div class="header">
		<h1>Your Library</h1>
		<Button variant="primary" href="/books/add"><Plus /> Add a Book</Button>
	</div>

	<div class="shelves">
		{#each Object.entries(shelves) as [key, label]}
			<button
				class="shelf-btn"
				class:active={activeShelf === key}
				onclick={() => (activeShelf = key)}
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
			{#each filteredBooks as book}
				<BookCard {book} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: var(--max-width);
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
