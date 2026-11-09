import React from 'react';

function BookCard({ book, onEdit, onDelete }) {
  const { title, author, genre, price, description } = book;

  return (
    <article className="book-card">
      <div className="card-top">
        <span className="genre-badge">{genre}</span>
        <span className="price-tag">${Number(price).toFixed(2)}</span>
      </div>

      <div className="card-body">
        <h3 className="book-title" title={title}>
          {title}
        </h3>
        <p className="book-author">by <strong>{author}</strong></p>
        <p className="book-description">
          {description && description.trim() !== ''
            ? description
            : 'No description provided.'}
        </p>
      </div>

      <div className="card-actions">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onEdit(book)}
          aria-label={`Edit ${title}`}
        >
          ✏️ Edit
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(book)}
          aria-label={`Delete ${title}`}
        >
          🗑️ Delete
        </button>
      </div>
    </article>
  );
}

export default BookCard;

