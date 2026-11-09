import React, { useState, useEffect } from 'react';

function BookForm({ initialData = null, onSubmit, onCancel, isSubmitting = false }) {
  const isEditing = Boolean(initialData && initialData._id);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    price: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        author: initialData.author || '',
        genre: initialData.genre || '',
        price: initialData.price !== undefined && initialData.price !== null ? initialData.price : '',
        description: initialData.description || ''
      });
    } else {
      setFormData({
        title: '',
        author: '',
        genre: '',
        price: '',
        description: ''
      });
    }
    setErrors({});
    setTouched({});
  }, [initialData]);

  const validate = (dataToValidate = formData) => {
    const newErrors = {};

    if (!dataToValidate.title || !dataToValidate.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!dataToValidate.author || !dataToValidate.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!dataToValidate.genre || !dataToValidate.genre.trim()) {
      newErrors.genre = 'Genre is required';
    }

    if (
      dataToValidate.price === '' ||
      dataToValidate.price === null ||
      dataToValidate.price === undefined
    ) {
      newErrors.price = 'Price is required';
    } else {
      const numPrice = Number(dataToValidate.price);
      if (isNaN(numPrice)) {
        newErrors.price = 'Price must be a valid number';
      } else if (numPrice < 0) {
        newErrors.price = 'Price cannot be negative';
      }
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (touched[name]) {
      const fieldErrors = validate(updated);
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validate(formData);
    setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      title: true,
      author: true,
      genre: true,
      price: true,
      description: true
    });

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit({
      title: formData.title.trim(),
      author: formData.author.trim(),
      genre: formData.genre.trim(),
      price: Number(formData.price),
      description: formData.description.trim()
    });
  };

  return (
    <section className="form-wrapper">
      <div className="form-card">
        <div className="form-header">
          <h2>{isEditing ? '✏️ Edit Book' : '➕ Add New Book'}</h2>
          <p className="form-subtitle">
            {isEditing
              ? 'Update book details below and save changes.'
              : 'Fill in the information below to add a new book to the library.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="book-title">
              Book Title <span className="required-star">*</span>
            </label>
            <input
              id="book-title"
              name="title"
              type="text"
              placeholder="e.g. Atomic Habits"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${errors.title && touched.title ? 'input-error' : ''}`}
            />
            {errors.title && touched.title && (
              <span className="error-message" role="alert">
                {errors.title}
              </span>
            )}
          </div>

          {/* Author */}
          <div className="form-group">
            <label htmlFor="book-author">
              Author <span className="required-star">*</span>
            </label>
            <input
              id="book-author"
              name="author"
              type="text"
              placeholder="e.g. James Clear"
              value={formData.author}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${errors.author && touched.author ? 'input-error' : ''}`}
            />
            {errors.author && touched.author && (
              <span className="error-message" role="alert">
                {errors.author}
              </span>
            )}
          </div>

          {/* Genre and Price in a row on larger screens */}
          <div className="form-row">
            {/* Genre */}
            <div className="form-group">
              <label htmlFor="book-genre">
                Genre <span className="required-star">*</span>
              </label>
              <input
                id="book-genre"
                name="genre"
                type="text"
                placeholder="e.g. Self Help, Fiction"
                value={formData.genre}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.genre && touched.genre ? 'input-error' : ''}`}
              />
              {errors.genre && touched.genre && (
                <span className="error-message" role="alert">
                  {errors.genre}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="form-group">
              <label htmlFor="book-price">
                Price ($) <span className="required-star">*</span>
              </label>
              <input
                id="book-price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 19.99"
                value={formData.price}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.price && touched.price ? 'input-error' : ''}`}
              />
              {errors.price && touched.price && (
                <span className="error-message" role="alert">
                  {errors.price}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="book-description">
              Description <span className="optional-tag">(Optional)</span>
            </label>
            <textarea
              id="book-description"
              name="description"
              rows="4"
              placeholder="Brief summary or details about this book..."
              value={formData.description}
              onChange={handleChange}
              className="form-input form-textarea"
            ></textarea>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : isEditing
                ? 'Save Changes'
                : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default BookForm;

