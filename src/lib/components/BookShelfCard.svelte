<script lang="ts">
    let { bookshelf, deleteBookshelf } = $props();
</script>

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
                onclick={() => deleteBookshelf(bookshelf.id)}
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

<style>
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