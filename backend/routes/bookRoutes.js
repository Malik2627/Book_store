const express = require('express');
const mongoose = require('mongoose');
const Book = require('../models/Book');
const connectDB = require('../config/db');

const router = express.Router();

// Helper to check DB connection and trigger reconnection if disconnected
const isDbConnected = () => {
  if (mongoose.connection.readyState === 0) {
    connectDB();
  }
  return mongoose.connection.readyState === 1;
};

const dbNotConnectedResponse = (res) => {
  return res.status(503).json({
    success: false,
    message: 'Database connection is not ready. Please verify MONGO_URI in .env.'
  });
};

// Helper function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// 1. POST /books - Create a new book
router.post('/', async (req, res, next) => {
  try {
    const { title, author, genre, price, description } = req.body;
    const validationErrors = [];

    if (!title || typeof title !== 'string' || title.trim() === '') {
      validationErrors.push('Title is required and cannot be empty.');
    }

    if (!author || typeof author !== 'string' || author.trim() === '') {
      validationErrors.push('Author is required and cannot be empty.');
    }

    if (!genre || typeof genre !== 'string' || genre.trim() === '') {
      validationErrors.push('Genre is required and cannot be empty.');
    }

    if (price === undefined || price === null || price === '') {
      validationErrors.push('Price is required.');
    } else if (typeof price !== 'number' || isNaN(price)) {
      validationErrors.push('Price must be a valid number.');
    } else if (price < 0) {
      validationErrors.push('Price must not be negative.');
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    if (!isDbConnected()) {
      return dbNotConnectedResponse(res);
    }

    const newBook = new Book({
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      price: Number(price),
      description: typeof description === 'string' ? description.trim() : ''
    });

    const savedBook = await newBook.save();

    return res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: savedBook
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    next(error);
  }
});

// 2. GET /books - Retrieve all books
router.get('/', async (req, res, next) => {
  try {
    if (!isDbConnected()) {
      return dbNotConnectedResponse(res);
    }

    const books = await Book.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
});

// 3. GET /books/:id - Retrieve a book by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format'
      });
    }

    if (!isDbConnected()) {
      return dbNotConnectedResponse(res);
    }

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
});

// 4. PUT /books/:id - Update a book
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format'
      });
    }

    const { title, author, genre, price, description } = req.body;
    const validationErrors = [];

    if (title !== undefined && (typeof title !== 'string' || title.trim() === '')) {
      validationErrors.push('Title cannot be empty.');
    }

    if (author !== undefined && (typeof author !== 'string' || author.trim() === '')) {
      validationErrors.push('Author cannot be empty.');
    }

    if (genre !== undefined && (typeof genre !== 'string' || genre.trim() === '')) {
      validationErrors.push('Genre cannot be empty.');
    }

    if (price !== undefined) {
      if (typeof price !== 'number' || isNaN(price)) {
        validationErrors.push('Price must be a valid number.');
      } else if (price < 0) {
        validationErrors.push('Price must not be negative.');
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    if (!isDbConnected()) {
      return dbNotConnectedResponse(res);
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (author !== undefined) updateData.author = author.trim();
    if (genre !== undefined) updateData.genre = genre.trim();
    if (price !== undefined) updateData.price = Number(price);
    if (description !== undefined) updateData.description = typeof description === 'string' ? description.trim() : '';

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!updatedBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: updatedBook
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    next(error);
  }
});

// 5. DELETE /books/:id - Delete a book
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid book ID format'
      });
    }

    if (!isDbConnected()) {
      return dbNotConnectedResponse(res);
    }

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: deletedBook
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
