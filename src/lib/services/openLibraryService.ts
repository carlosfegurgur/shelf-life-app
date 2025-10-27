// src/lib/services/openLibraryService.ts
import type { 
    OpenLibrarySearchResult, 
    OpenLibraryWork,
    // OpenLibraryAuthor,
    BookSearchResult, 
    OpenLibraryBook
  } from '$lib/types/openLibrary.types'
  
  const BASE_URL = 'https://openlibrary.org'
  const COVERS_URL = 'https://covers.openlibrary.org/b'
  
  export class OpenLibraryService {
    /**
     * Search books by title, author, or ISBN
     */
    static async searchBooks(query: string, limit = 10): Promise<BookSearchResult[]> {
      try {
        const response = await fetch(
          `${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=${limit}`
        )
        
        if (!response.ok) throw new Error('Search failed')
        
        const data: OpenLibrarySearchResult = await response.json()
        console.log('book data', data);
        
        return data.docs.map(book => this.transformBook(book))
      } catch (error) {
        console.error('Open Library search error:', error)
        return []
      }
    }
  
    /**
     * Search books by ISBN
     */
    static async searchByISBN(isbn: string): Promise<BookSearchResult | null> {
      try {
        const response = await fetch(
          `${BASE_URL}/search.json?isbn=${isbn}`
        )
        
        if (!response.ok) throw new Error('ISBN search failed')
        
        const data: OpenLibrarySearchResult = await response.json()
        
        if (data.docs.length === 0) return null
        
        return this.transformBook(data.docs[0])
      } catch (error) {
        console.error('ISBN search error:', error)
        return null
      }
    }
  
    /**
     * Get detailed book information by Open Library ID
     */
    static async getBookDetails(olid: string): Promise<BookSearchResult | null> {
      try {
        const response = await fetch(`${BASE_URL}/works/${olid}.json`)
        
        if (!response.ok) throw new Error('Failed to fetch book details')
        
        const work: OpenLibraryWork = await response.json()
        
        return {
          olid,
          title: work.title,
          author: 'Unknown', // Need to fetch author separately
          coverUrl: work.covers?.[0] ? this.getCoverUrl(work.covers[0], 'M') : undefined,
          description: this.extractDescription(work.description),
          firstPublishYear: work.first_publish_date 
            ? new Date(work.first_publish_date).getFullYear() 
            : undefined
        }
      } catch (error) {
        console.error('Get book details error:', error)
        return null
      }
    }
  
    /**
     * Get cover image URL
     */
    static getCoverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'M'): string {
      return `${COVERS_URL}/id/${coverId}-${size}.jpg`
    }
  
    /**
     * Get cover URL by ISBN
     */
    static getCoverUrlByISBN(isbn: string, size: 'S' | 'M' | 'L' = 'M'): string {
      return `${COVERS_URL}/isbn/${isbn}-${size}.jpg`
    }
  
    /**
     * Transform Open Library book to app format
     */
    private static transformBook(book: OpenLibraryBook): BookSearchResult {
      return {
        olid: book.key.replace('/works/', ''),
        title: book.title,
        author: book.author_name?.[0] || 'Unknown Author',
        coverUrl: book.cover_i ? this.getCoverUrl(book.cover_i, 'M') : undefined,
        firstPublishYear: book.first_publish_year,
        isbn: book.isbn?.[0],
        pageCount: book.number_of_pages_median,
        description: undefined // Need separate API call for description
      }
    }
  
    /**
     * Extract description from Open Library format
     */
    private static extractDescription(
      description?: string | { value: string }
    ): string | undefined {
      if (!description) return undefined
      if (typeof description === 'string') return description
      return description.value
    }
  
    /**
     * Debounced search for autocomplete
     */
    static createDebouncedSearch(delay = 300) {
      let timeoutId: ReturnType<typeof setTimeout>
      
      return (query: string, callback: (results: BookSearchResult[]) => void) => {
        clearTimeout(timeoutId)
        
        if (query.trim().length < 2) {
          callback([])
          return
        }
        
        timeoutId = setTimeout(async () => {
          const results = await this.searchBooks(query)
          callback(results)
        }, delay)
      }
    }
  }