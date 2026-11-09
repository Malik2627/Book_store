import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import Loading from './components/Loading';
import { getBooks, createBook, updateBook, deleteBook } from './services/api';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'add' | 'edit'
  const [selectedBook, setSelectedBook] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // Auto-dismiss success message after 4 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Fetch books from Express backend API
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getBooks();
      // Handle either response.data array or fallback
      const bookData = Array.isArray(response)
        ? response
        : response && Array.isArray(response.data)
        ? response.data
        : [];
      setBooks(bookData);
    } catch (err) {
      setError(err.message || 'Unable to connect to the backend server. Please verify Express is running.');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Navigation handlers
  const handleNavigate = (view) => {
    setError(null);
    if (view === 'add') {
      setSelectedBook(null);
      setCurrentView('add');
    } else {
      setSelectedBook(null);
      setCurrentView('list');
    }
  };

  const handleEditClick = (book) => {
    setSelectedBook(book);
    setCurrentView('edit');
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Create or Update book submission
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      if (currentView === 'edit' && selectedBook && selectedBook._id) {
        const response = await updateBook(selectedBook._id, formData);
        const updated = response.data || { ...selectedBook, ...formData };
        setBooks((prev) =>
          prev.map((b) => (b._id === selectedBook._id ? updated : b))
        );
        setSuccessMessage(`"${formData.title}" updated successfully!`);
      } else {
        const response = await createBook(formData);
        const created = response.data || {
          ...formData,
          _id: `temp-${Date.now()}`,
          createdAt: new Date().toISOString()
        };
        setBooks((prev) => [created, ...prev]);
        setSuccessMessage(`"${formData.title}" added to the store!`);
      }
      setSelectedBook(null);
      setCurrentView('list');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Failed to save book. Please check your data and backend status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete book flow
  const handleDeleteClick = (book) => {
    setBookToDelete(book);
  };

  const confirmDelete = async () => {
    if (!bookToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteBook(bookToDelete._id);
      setBooks((prev) => prev.filter((b) => b._id !== bookToDelete._id));
      setSuccessMessage(`"${bookToDelete.title}" was deleted successfully.`);
      setBookToDelete(null);
    } catch (err) {
      setError(err.message || 'Failed to delete book. Please try again.');
    } finally {
      setIsSubmitting(false);
      setBookToDelete(null);
    }
  };

  const cancelDelete = () => {
    setBookToDelete(null);
  };

  return (
    <div className="app-container">
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      <main className="main-content">
        {/* Success Alert Banner */}
        {successMessage && (
          <aside className="alert alert-success" role="status" aria-live="polite">
            <span className="alert-icon">✅</span>
            <span className="alert-text">{successMessage}</span>
            <button
              type="button"
              className="alert-close"
              onClick={() => setSuccessMessage(null)}
              aria-label="Dismiss message"
            >
              ✕
            </button>
          </aside>
        )}

        {/* Error Alert Banner */}
        {error && (
          <aside className="alert alert-error" role="alert">
            <span className="alert-icon">⚠️</span>
            <div className="alert-text">
              <strong>Error:</strong> {error}
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={fetchBooks}
              style={{ marginLeft: 'auto' }}
            >
              🔄 Retry
            </button>
            <button
              type="button"
              className="alert-close"
              onClick={() => setError(null)}
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </aside>
        )}

        {/* View Switcher: Loading / Form / List */}
        {loading ? (
          <Loading message="Loading books from library..." />
        ) : currentView === 'add' || currentView === 'edit' ? (
          <BookForm
            initialData={selectedBook}
            onSubmit={handleFormSubmit}
            onCancel={() => handleNavigate('list')}
            isSubmitting={isSubmitting}
          />
        ) : (
          <BookList
            books={books}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onAddClick={() => handleNavigate('add')}
          />
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {bookToDelete && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-icon">🗑️</div>
            <h3 className="modal-title">Delete Book</h3>
            <p className="modal-description">
              Are you sure you want to delete <strong>"{bookToDelete.title}"</strong> by {bookToDelete.author}? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelDelete}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer-container">
        <p>© 2026 Book Store Academic Project. Built with React & Express.</p>
      </footer>
    </div>
  );
}

export default App;
