<!-- src/lib/components/BookSearchModal.svelte -->
<script lang="ts">
    import { OpenLibraryService } from '$lib/services/openLibraryService'
    import type { BookSearchResult } from '$lib/types/openLibrary.types'
    
    export let isOpen = false
    export let onSelect: (book: BookSearchResult) => void
    
    let query = ''
    let results: BookSearchResult[] = []
    let loading = false
    let selectedIndex = -1
  
    const debouncedSearch = OpenLibraryService.createDebouncedSearch()
  
    function handleSearch() {
      loading = true
      debouncedSearch(query, (searchResults) => {
        results = searchResults
        loading = false
        selectedIndex = -1
      })
    }
  
    function handleSelect(book: BookSearchResult) {
      onSelect(book)
      closeModal()
    }
  
    function closeModal() {
      isOpen = false
      query = ''
      results = []
      selectedIndex = -1
    }
  
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeModal()
      } else if (event.key === 'ArrowDown') {
        event.preventDefault()
        selectedIndex = Math.min(selectedIndex + 1, results.length - 1)
      } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        selectedIndex = Math.max(selectedIndex - 1, -1)
      } else if (event.key === 'Enter' && selectedIndex >= 0) {
        event.preventDefault()
        handleSelect(results[selectedIndex])
      }
    }
  </script>
  
  {#if isOpen}
    <div class="modal-overlay" on:click={closeModal}>
      <div class="modal" on:click|stopPropagation>
        <div class="modal-header">
          <h2>Search Books</h2>
          <button class="close-btn" on:click={closeModal}>×</button>
        </div>
  
        <div class="search-input-wrapper">
          <input
            type="text"
            bind:value={query}
            on:input={handleSearch}
            on:keydown={handleKeydown}
            placeholder="Search by title, author, or ISBN..."
            autofocus
          />
          {#if loading}
            <span class="loading-spinner">🔄</span>
          {/if}
        </div>
  
        <div class="results">
          {#if query.length > 0 && results.length === 0 && !loading}
            <p class="no-results">No books found. Try a different search.</p>
          {:else if results.length > 0}
            <ul>
              {#each results as book, index (book.olid)}
                <li 
                  class:selected={index === selectedIndex}
                  on:click={() => handleSelect(book)}
                >
                  <div class="book-result">
                    {#if book.coverUrl}
                      <img src={book.coverUrl} alt={book.title} class="result-cover" />
                    {:else}
                      <div class="result-cover placeholder">📖</div>
                    {/if}
                    <div class="result-info">
                      <h3>{book.title}</h3>
                      <p class="author">{book.author}</p>
                      {#if book.firstPublishYear}
                        <p class="year">{book.firstPublishYear}</p>
                      {/if}
                    </div>
                  </div>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
  
        <div class="modal-footer">
          <button on:click={closeModal}>Cancel</button>
          <a href="/books/add" class="manual-link">Add Manually</a>
        </div>
      </div>
    </div>
  {/if}
  
  <style>
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
  
    .modal {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
    }
  
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e0e0e0;
    }
  
    .modal-header h2 {
      margin: 0;
    }
  
    .close-btn {
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      color: #666;
      line-height: 1;
    }
  
    .search-input-wrapper {
      padding: 1.5rem;
      position: relative;
    }
  
    input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
  
    input:focus {
      outline: none;
      border-color: #667eea;
    }
  
    .loading-spinner {
      position: absolute;
      right: 2rem;
      top: 50%;
      transform: translateY(-50%);
      animation: spin 1s linear infinite;
    }
  
    @keyframes spin {
      from { transform: translateY(-50%) rotate(0deg); }
      to { transform: translateY(-50%) rotate(360deg); }
    }
  
    .results {
      flex: 1;
      overflow-y: auto;
      padding: 0 1.5rem;
    }
  
    .results ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
  
    .results li {
      cursor: pointer;
      border-radius: 4px;
      margin-bottom: 0.5rem;
    }
  
    .results li:hover,
    .results li.selected {
      background: #f5f5f5;
    }
  
    .book-result {
      display: flex;
      gap: 1rem;
      padding: 1rem;
    }
  
    .result-cover {
      width: 60px;
      height: 90px;
      object-fit: cover;
      border-radius: 4px;
      flex-shrink: 0;
    }
  
    .result-cover.placeholder {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
    }
  
    .result-info {
      flex: 1;
    }
  
    .result-info h3 {
      margin: 0 0 0.25rem 0;
      font-size: 1.1rem;
      color: #333;
    }
  
    .result-info .author {
      color: #666;
      margin: 0 0 0.25rem 0;
    }
  
    .result-info .year {
      color: #999;
      font-size: 0.875rem;
      margin: 0;
    }
  
    .no-results {
      text-align: center;
      padding: 2rem;
      color: #666;
    }
  
    .modal-footer {
      padding: 1.5rem;
      border-top: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  
    .manual-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
    }
  </style>