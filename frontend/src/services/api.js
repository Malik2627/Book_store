import axios from 'axios';

// Centralized API configuration powered by Vite environment variable VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Response interceptor to extract clean, user-friendly error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      const data = error.response.data;
      if (data && data.message) {
        message = data.message;
        if (Array.isArray(data.errors) && data.errors.length > 0) {
          message += `: ${data.errors.join(', ')}`;
        }
      } else {
        message = `Server responded with status ${error.response.status}`;
      }
    } else if (error.request) {
      message = 'Backend server is currently unreachable. Please check your network connection and server status.';
    } else if (error.message) {
      message = error.message;
    }

    return Promise.reject(new Error(message));
  }
);

// 1. Health check
export const getHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

// 2. GET /books - Retrieve all books
export const getBooks = async () => {
  const response = await apiClient.get('/books');
  return response.data;
};

// 3. GET /books/:id - Retrieve a book by ID
export const getBookById = async (id) => {
  const response = await apiClient.get(`/books/${id}`);
  return response.data;
};

// 4. POST /books - Create a new book
export const createBook = async (bookData) => {
  const response = await apiClient.post('/books', bookData);
  return response.data;
};

// 5. PUT /books/:id - Update an existing book
export const updateBook = async (id, bookData) => {
  const response = await apiClient.put(`/books/${id}`, bookData);
  return response.data;
};

// 6. DELETE /books/:id - Delete a book
export const deleteBook = async (id) => {
  const response = await apiClient.delete(`/books/${id}`);
  return response.data;
};

export default apiClient;
