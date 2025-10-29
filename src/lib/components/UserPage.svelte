<script lang="ts">
	import { Book, BookOpen, MenuIcon, Plus, PlusCircle, PlusCircleIcon, User } from "@lucide/svelte";
	import Button from "./Button.svelte";

    // let books = [
    //   {
    //     title: "The Pragmatic Programmer",
    //     author: "Andrew Hunt",
    //     status: "Currently Reading",
    //     pages: 124,
    //     cover: "#FCD34D"
    //   },
    //   {
    //     title: "Atomic Habits",
    //     author: "James Clear",
    //     status: "Completed",
    //     pages: 89,
    //     cover: "#FCD34D"
    //   }
    // ];
  
    // let bookshelves = [
    //   { name: "To Read Next", count: 18 },
    //   { name: "Non-fiction Gems", count: 12 }
    // ];

    let { user } = $props();

    console.log('user', user);
  </script>
  
  <div class="app">
    <main class="main-content">
      <section class="welcome-section">
        <div class="welcome-content">
          <div class="avatar"></div>
          <div class="welcome-text">
            <h1 class="welcome-title">Welcome back, {user.email}</h1>
            <p class="welcome-subtitle">Pick up where you left off — your library is waiting.</p>
          </div>
        </div>
        <div class="welcome-actions">
          <Button variant="secondary" href="/books/add">
            <Plus />
            Add a Book
          </Button>
          <Button variant="tertiary" href="/profile">
            <User />
            Profile
          </Button>
        </div>
      </section>
  
      <div class="dashboard-grid">
        <section class="card">
          <div class="card-header">
            <h2 class="card-title">Your Library</h2>
          </div>
          <p class="card-description">All books you own or saved. Filter by status and sort by date added.</p>
  
          <div class="books-list">
            <!-- {#each books as book}
              <div class="book-item">
                <div class="book-cover" style="background-color: {book.cover}"></div>
                <div class="book-info">
                  <h3 class="book-title">{book.title}</h3>
                  <p class="book-meta">{book.author} — {book.status}</p>
                </div>
                <div class="book-pages">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M2 2h4l2 2h6v10H2V2z"/>
                  </svg>
                  {book.pages}
                </div>
              </div>
            {/each} -->
          </div>
  
          <Button variant="primary" href="/library">
            <Book />
            View library
          </Button>
        </section>
  
        <section class="card">
          <div class="card-header">
            <h2 class="card-title">Bookshelves</h2>
          </div>
          <p class="card-description">Organize books into custom shelves for projects, genres, or moods.</p>
  
          <div class="shelves-list">
            <!-- {#each bookshelves as shelf}
              <button class="shelf-item">
                <div class="shelf-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M3 3h5l2 2h7v12H3V3z"/>
                  </svg>
                  <span class="shelf-name">{shelf.name}</span>
                  <span class="shelf-count">{shelf.count} books</span>
                </div>
                <svg class="chevron" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M7 5l5 5-5 5"/>
                </svg>
              </button>
            {/each} -->
          </div>
  
          <Button variant="secondary" href="/bookshelves">
            <BookOpen />
            View shelves
          </Button>
        </section>
  
        <section class="card">
          <div class="card-header">
            <h2 class="card-title">Add a Book</h2>
          </div>
          <p class="card-description">Search by title, author, or ISBN to add a book to your library.</p>
  
          <div class="empty-state">
            <p class="empty-text">No recent adds. Start by adding your first book.</p>
          </div>
  
          <div class="add-buttons">
            <Button variant="primary" href="/books/add">
              <Plus />
              Add a Book
            </Button>
          </div>
        </section>
      </div>
    </main>
  </div>
  
  <style>
    .main-content {
      max-width: var(--max-width);
      margin: 0 auto;
      padding: 2rem;
    }
  
    .welcome-section {
      background: white;
      border-radius: 16px;
      padding: 2rem 2.5rem;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  
    .welcome-content {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
  
    .avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
    }
  
    .welcome-title {
      margin: 0 0 0.25rem 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a1a1a;
    }
  
    .welcome-subtitle {
      margin: 0;
      color: #6b7280;
      font-size: 0.9375rem;
    }
  
    .welcome-actions {
      display: flex;
      gap: 1rem;
    }
  
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
  
    .card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
  
    .card-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a1a;
    }
  
    .card-description {
      color: #6b7280;
      font-size: 0.9375rem;
      margin: 0 0 1.5rem 0;
      line-height: 1.5;
    }
  
    .books-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
  
    .book-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #e0f2fe;
      border-radius: 12px;
      transition: transform 0.2s;
    }
  
    .book-item:hover {
      transform: translateX(2px);
    }
  
    .book-cover {
      width: 48px;
      height: 64px;
      border-radius: 6px;
      flex-shrink: 0;
    }
  
    .book-info {
      flex: 1;
      min-width: 0;
    }
  
    .book-title {
      margin: 0 0 0.25rem 0;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #1a1a1a;
    }
  
    .book-meta {
      margin: 0;
      font-size: 0.8125rem;
      color: #6b7280;
    }
  
    .book-pages {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      color: #6b7280;
      font-size: 0.8125rem;
    }
  
    .view-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: #0891b2;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      margin-top: auto;
    }
  
    .view-btn:hover {
      background: #0e7490;
    }
  
    .view-btn.secondary {
      background: transparent;
      color: #1a1a1a;
      border: 1px solid #e5e7eb;
    }
  
    .view-btn.secondary:hover {
      background: #f9fafb;
    }
  
    .shelves-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }
  
    .shelf-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background: #f0fdf4;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
      width: 100%;
      text-align: left;
    }
  
    .shelf-item:hover {
      background: #dcfce7;
    }
  
    .shelf-icon {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
    }
  
    .shelf-name {
      font-size: 0.9375rem;
      font-weight: 500;
      color: #1a1a1a;
    }
  
    .shelf-count {
      margin-left: auto;
      font-size: 0.8125rem;
      color: #6b7280;
    }
  
    .chevron {
      color: #9ca3af;
      flex-shrink: 0;
    }
  
    .empty-state {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: #f9fafb;
      border-radius: 12px;
      margin-bottom: 1.5rem;
    }
  
    .empty-text {
      margin: 0;
      color: #9ca3af;
      font-size: 0.875rem;
      text-align: center;
    }
  
    .add-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
  
    .add-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem;
      border: none;
      border-radius: 8px;
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
  
    .add-btn.primary {
      background: #0891b2;
      color: white;
    }
  
    .add-btn.primary:hover {
      background: #0e7490;
    }
  
    .add-btn.secondary {
      background: transparent;
      color: #1a1a1a;
      border: 1px solid #e5e7eb;
    }
  
    .add-btn.secondary:hover {
      background: #f9fafb;
    }
  
    @media (max-width: 1200px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }
  
    @media (max-width: 768px) {
      .nav-center {
        display: none;
      }
  
      .welcome-section {
        flex-direction: column;
        gap: 1.5rem;
        align-items: flex-start;
      }
  
      .welcome-actions {
        width: 100%;
      }
  
      .action-btn {
        flex: 1;
      }
    }
  </style>
  