// src/lib/types/openLibrary.types.ts

export interface OpenLibrarySearchResult {
    numFound: number
    start: number
    docs: OpenLibraryBook[]
  }
  
  export interface OpenLibraryBook {
    key: string
    title: string
    author_name?: string[]
    first_publish_year?: number
    isbn?: string[]
    cover_i?: number
    publisher?: string[]
    number_of_pages_median?: number
    subject?: string[]
  }
  
  export interface OpenLibraryWork {
    title: string
    description?: string | { value: string }
    covers?: number[]
    authors?: Array<{
      author: {
        key: string
      }
    }>
    subjects?: string[]
    first_publish_date?: string
  }
  
  export interface OpenLibraryAuthor {
    name: string
    bio?: string | { value: string }
    birth_date?: string
    photos?: number[]
  }
  
  // Transformed type for your app
  export interface BookSearchResult {
    olid: string // Open Library ID
    title: string
    author: string
    coverUrl?: string
    firstPublishYear?: number
    isbn?: string
    pageCount?: number
    description?: string
  }