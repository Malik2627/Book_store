import React from 'react';
import BookCard from './BookCard';

function BookList({ books, onEdit, onDelete, onAddClick }) {
  if (!books || books.length === 0) {
    return (
      <section className="empty-state-wrapper">
        <div className="empty-state-card">
          <div className="empty-icon">📖</div>
          <h2 className="empty-title">No books available yet</h2>
          <p className="empty-description">
            Your collection is currently empty. Get started by adding your first book to the store.
          </p>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={onAddClick}
          >
            ➕ Add Your First Book
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="book-list-container">
      <div className="list-header">
        <div>
          <h2 className="list-title">Explore Books</h2>
          <p className="list-subtitle">
            Showing {books.length} {books.length === 1 ? 'book' : 'books'} in library
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onAddClick}
        >
          ➕ Add New Book
        </button>
      </div>

      <div className="book-grid">
        {books.map((book) => (
          <BookCard
            key={book._id || `${book.title}-${book.author}`}
            book={book}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}

export default BookList;

