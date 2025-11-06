export interface Book {
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
    bookshelf?: {
        name: string;
    };
}

export interface Bookshelf {
    id: string;
    name: string;
    color?: string;
    user_id?: string;
    created_at?: string;
    updated_at?: string;
    description?: string;
    book_count?: number;
}