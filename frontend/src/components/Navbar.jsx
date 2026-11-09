import React from 'react';

function Navbar({ currentView, onNavigate }) {
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <div
          className="navbar-brand"
          onClick={() => onNavigate('list')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onNavigate('list')}
        >
          <span className="navbar-logo">📚</span>
          <span className="navbar-title">Book Store</span>
        </div>

        <nav className="navbar-links" aria-label="Main Navigation">
          <button
            type="button"
            className={`nav-btn ${currentView === 'list' ? 'active' : ''}`}
            onClick={() => onNavigate('list')}
          >
            Home
          </button>
          <button
            type="button"
            className={`nav-btn add-btn ${currentView === 'add' ? 'active' : ''}`}
            onClick={() => onNavigate('add')}
          >
            + Add Book
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

