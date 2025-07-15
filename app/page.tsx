"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, BookOpen, Download, ExternalLink, Menu, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import Link from "next/link";
import Navbar from "@/components/navbar";

interface Book {
  key: string
  title: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
  subject?: string[]
  ia?: string[]
  has_fulltext?: boolean
  edition_count?: number
  language?: string[]
  publisher?: string[]
}

interface BookDetails {
  title: string
  description?: string | { value: string }
  covers?: number[]
  authors?: Array<{ author: { key: string } }>
  subjects?: string[]
  first_publish_date?: string
}

export default function CollegeBookFinder() {
  const [searchQuery, setSearchQuery] = useState("")
  const [books, setBooks] = useState<Book[]>([])
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([])
  const [categoryBooks, setCategoryBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [searchType, setSearchType] = useState("title")
  const [sortBy, setSortBy] = useState("relevance")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Add state for selected category and collection
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

  // Filter books based on selected category/collection
  const filteredBooks = books.filter((book) => {
    let match = true;
    if (selectedCategory) {
      match = book.subject?.some((s) => s.toLowerCase().includes(selectedCategory.toLowerCase()));
    }
    if (selectedCollection) {
      // For demo, just match collection name in title
      match = match && book.title.toLowerCase().includes(selectedCollection.toLowerCase());
    }
    return match;
  });

  const searchBooks = async (query: string, type = "title") => {
    if (!query.trim()) return

    setLoading(true)
    try {
      let searchParam = ""
      switch (type) {
        case "author":
          searchParam = `author:${query}`
          break
        case "subject":
          searchParam = `subject:${query}`
          break
        default:
          searchParam = `title:${query}`
      }

      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(searchParam)}&limit=20&fields=key,title,author_name,first_publish_year,cover_i,subject,ia,has_fulltext,edition_count,language,publisher`,
      )
      const data = await response.json()

      const sortedBooks = data.docs || []

      if (sortBy === "year") {
        sortedBooks.sort((a: Book, b: Book) => (b.first_publish_year || 0) - (a.first_publish_year || 0))
      } else if (sortBy === "title") {
        sortedBooks.sort((a: Book, b: Book) => a.title.localeCompare(b.title))
      }

      setBooks(sortedBooks)
    } catch (error) {
      console.error("Error searching books:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFeaturedBooks = async () => {
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=subject:computer%20science&limit=4&fields=key,title,author_name,first_publish_year,cover_i,subject,ia,has_fulltext`,
      )
      const data = await response.json()
      setFeaturedBooks(data.docs || [])
    } catch (error) {
      console.error("Error fetching featured books:", error)
    }
  }

  const fetchCategoryBooks = async () => {
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=subject:mathematics&limit=4&fields=key,title,author_name,first_publish_year,cover_i,subject,ia,has_fulltext`,
      )
      const data = await response.json()
      setCategoryBooks(data.docs || [])
    } catch (error) {
      console.error("Error fetching category books:", error)
    }
  }

  const fetchBookDetails = async (bookKey: string) => {
    setDetailsLoading(true)
    setBookDetails(null)
    try {
      console.log("Fetching details for book:", bookKey)
      const response = await fetch(`https://openlibrary.org${bookKey}.json`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const details = await response.json()
      console.log("Book details fetched:", details)
      setBookDetails(details)
    } catch (error) {
      console.error("Error fetching book details:", error)
      // Set empty details to show basic info even if API fails
      setBookDetails({ title: "Details unavailable" })
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchBooks(searchQuery, searchType)
  }

  const handleBookSelect = (book: Book) => {
    console.log("Book selected:", book)
    setSelectedBook(book)
    setDialogOpen(true)
    fetchBookDetails(book.key)
  }

  const getCoverUrl = (coverId: number, size = "M") => {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`
  }

  const getReadingUrl = (book: Book | null) => {
    if (!book || !book.ia || book.ia.length === 0) {
      return null
    }
    return `https://archive.org/details/${book.ia[0]}`
  }

  const getDownloadUrl = (book: Book | null) => {
    if (!book || !book.ia || book.ia.length === 0) {
      return null
    }
    return `https://archive.org/download/${book.ia[0]}`
  }

  useEffect(() => {
    fetchFeaturedBooks()
    fetchCategoryBooks()
  }, [])

  const BookCard = ({ book, showBadge = false }: { book: Book; showBadge?: boolean }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          {book.cover_i ? (
            <img
              src={getCoverUrl(book.cover_i, "L") || "/placeholder.svg"}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=240&width=320"
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
              <BookOpen className="w-16 h-16 text-orange-400" />
            </div>
          )}
        </div>
        {showBadge && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-montserrat font-medium">Featured</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-6">
        {book.subject && book.subject.length > 0 && (
          <p className="text-orange-500 text-sm font-montserrat font-medium mb-2">{book.subject[0]}</p>
        )}
        <h3 className="font-montserrat font-bold text-lg mb-3 line-clamp-2 min-h-[3.5rem] text-gray-800">
          {book.title}
        </h3>
        <p className="text-gray-600 font-montserrat text-sm mb-4 line-clamp-3">
          {book.author_name ? `by ${book.author_name.slice(0, 2).join(", ")}` : "Unknown Author"}
          {book.first_publish_year && ` • ${book.first_publish_year}`}
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 font-montserrat font-medium border-gray-300 hover:border-orange-500 hover:text-orange-500 bg-transparent"
            onClick={() => handleBookSelect(book)}
          >
            View Details
          </Button>

          {getReadingUrl(book) && (
            <Button asChild size="sm" className="flex-1 bg-orange-500 hover:bg-orange-600 font-montserrat">
              <a href={getReadingUrl(book)!} target="_blank" rel="noopener noreferrer">
                <BookOpen className="w-3 h-3 mr-1" />
                Read
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative">
        <div
          className="h-screen bg-cover bg-center bg-no-repeat relative"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black/50"></div>

          {/* Hero Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
            <h1 className="text-white font-kavoon text-4xl md:text-6xl lg:text-7xl mb-8 max-w-4xl leading-tight">
              Scrolla - Your Academic Library
            </h1>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-full p-2 flex items-center gap-2 w-full max-w-4xl shadow-2xl"
            >
              <div className="flex items-center gap-2 px-4 py-3 flex-1">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by title, author, or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-none bg-transparent font-montserrat text-lg placeholder:text-gray-400 focus-visible:ring-0"
                />
              </div>
              {/* Desktop: Show dropdown and text button */}
              <div className="hidden md:flex border-l border-gray-200 px-4 py-3">
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger className="border-none bg-transparent font-montserrat w-32 focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="author">Author</SelectItem>
                    <SelectItem value="subject">Subject</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Mobile: Icon button only, Desktop: Text button */}
              <button
                type="submit"
                disabled={loading}
                className="flex md:hidden items-center justify-center bg-orange-500 hover:bg-orange-600 text-white rounded-full p-3 transition-colors disabled:opacity-50"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <Button
                type="submit"
                disabled={loading}
                className="hidden md:inline-flex bg-orange-500 hover:bg-orange-600 text-white font-montserrat font-medium px-8 py-3 rounded-full"
              >
                {loading ? "Searching..." : "Search"}
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Book Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-montserrat font-bold">{selectedBook?.title}</DialogTitle>
            {selectedBook?.author_name && (
              <DialogDescription className="text-base font-montserrat">
                by {selectedBook.author_name.join(", ")}
              </DialogDescription>
            )}
          </DialogHeader>

          {detailsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-2 font-montserrat">Loading details...</span>
            </div>
          ) : (
            <div className="grid md:grid-cols-[200px_1fr] gap-6">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                {selectedBook?.cover_i ? (
                  <img
                    src={getCoverUrl(selectedBook.cover_i, "L") || "/placeholder.svg"}
                    alt={selectedBook.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <BookOpen className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {bookDetails?.description && (
                  <div>
                    <h4 className="font-montserrat font-semibold mb-2">Description</h4>
                    <p className="text-sm text-gray-600 font-montserrat">
                      {typeof bookDetails.description === "string"
                        ? bookDetails.description
                        : bookDetails.description.value}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm font-montserrat">
                  {selectedBook?.first_publish_year && (
                    <div>
                      <span className="font-medium">Published:</span>
                      <p>{selectedBook.first_publish_year}</p>
                    </div>
                  )}

                  {selectedBook?.edition_count && (
                    <div>
                      <span className="font-medium">Editions:</span>
                      <p>{selectedBook.edition_count}</p>
                    </div>
                  )}

                  {selectedBook?.language && (
                    <div>
                      <span className="font-medium">Languages:</span>
                      <p>{selectedBook.language.slice(0, 3).join(", ")}</p>
                    </div>
                  )}

                  {selectedBook?.publisher && (
                    <div>
                      <span className="font-medium">Publishers:</span>
                      <p>{selectedBook.publisher.slice(0, 2).join(", ")}</p>
                    </div>
                  )}
                </div>

                {selectedBook?.subject && selectedBook.subject.length > 0 && (
                  <div>
                    <h4 className="font-montserrat font-semibold mb-2">Subjects</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedBook.subject.slice(0, 10).map((subject, index) => (
                        <Badge key={index} variant="secondary" className="text-xs font-montserrat">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="flex gap-2">
                  {selectedBook && getReadingUrl(selectedBook) && (
                    <Button asChild className="flex-1 bg-orange-500 hover:bg-orange-600 font-montserrat">
                      <a
                        href={getReadingUrl(selectedBook)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        Read Online
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  )}

                  {selectedBook && getDownloadUrl(selectedBook) && (
                    <Button variant="outline" asChild className="flex-1 font-montserrat bg-transparent">
                      <a
                        href={getDownloadUrl(selectedBook)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Search Results */}
      {filteredBooks.length > 0 && (
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-kavoon text-3xl md:text-4xl text-gray-800 mb-4">Search Results</h2>
              <p className="font-montserrat text-gray-600 text-lg max-w-2xl mx-auto">
                Found {filteredBooks.length} books matching your search criteria
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredBooks.map((book) => (
                <BookCard key={book.key} book={book} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Books Section */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Home className="w-6 h-6 text-orange-500" />
              <h2 className="font-kavoon text-3xl md:text-4xl text-gray-800">Weekly Featured Books</h2>
            </div>
            <p className="font-montserrat text-gray-600 text-lg max-w-2xl mx-auto">
              Discover the most popular academic books this week. Start your learning journey today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredBooks.map((book) => (
              <BookCard key={book.key} book={book} showBadge={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-kavoon text-3xl md:text-4xl text-gray-800 mb-4">Mathematics & Sciences</h2>
            <p className="font-montserrat text-gray-600 text-lg max-w-2xl mx-auto">
              Explore comprehensive mathematics and science textbooks. Build your foundation in STEM subjects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoryBooks.map((book) => (
              <BookCard key={book.key} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-orange-500 font-kavoon text-2xl font-bold mb-4">Scrolla</div>
          <p className="font-montserrat text-gray-400 mb-6">
            Powered by{" "}
            <a
              href="https://openlibrary.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 transition-colors"
            >
              Open Library
            </a>{" "}
            and{" "}
            <a
              href="https://archive.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 transition-colors"
            >
              Internet Archive
            </a>
          </p>
          <p className="font-montserrat text-gray-500 text-sm">© 2024 Scrolla. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
