<script lang="ts">
    let { book } = $props();
</script>

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
        {#if book.bookshelf}
            <div class="bookshelf-tag" style="--shelf-color: '#667eea'}">
                {book.bookshelf.name}
            </div>
        {/if}
        {#if book.rating}
            <div class="rating">
                {'⭐'.repeat(book.rating)}
            </div>
        {/if}
    </div>
</a>

<style>
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

	.bookshelf-tag {
		display: inline-block;
		background: var(--shelf-color);
		color: white;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.8rem;
		font-weight: 500;
		margin: 0.5rem 0;
	}

	.rating {
		margin-top: 0.5rem;
		font-size: 0.9rem;
	}
</style>