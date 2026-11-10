# Book Store — Full-Stack Web Application

A modern, responsive full-stack web application designed for bookstore inventory and catalog management. Built with a decoupled client-server architecture utilizing **React 19**, **Vite**, **Express.js**, and **MongoDB Atlas**.

---

## 1. Project Overview

The **Book Store Application** enables bookstores and readers to manage a catalog of books through a user-friendly interface backed by a persistent cloud database. The application features complete **CRUD** (Create, Read, Update, Delete) functionality, real-time visual feedback, and responsive layout design.

The system is deployed in production across specialized cloud hosting providers:
- **Frontend Client**: Hosted on **Vercel**
- **Backend API**: Hosted on **Render**
- **Database Engine**: Hosted on **MongoDB Atlas**

---

## 2. Features

- **View All Books**: Displays catalog items as responsive cards displaying title, author, genre badge, price, and description.
- **Add a Book**: Form view with client-side and server-side validation (ensures valid titles, authors, genres, and non-negative pricing).
- **Edit/Update a Book**: Pre-populated edit modal allowing updates to pricing, descriptions, and book metadata.
- **Delete a Book**: Interactive confirmation modal to prevent accidental data loss.
- **Empty Library State**: Friendly visual placeholder displayed when no inventory exists in the database.
- **Delete Confirmation Modal**: Accessible dialog window requiring explicit confirmation before permanent deletion.
- **Success & Error Feedback**: Non-intrusive alert banners providing confirmation of database mutations and informative server error alerts.
- **Responsive Interface**: Fluid layout optimized for mobile, tablet, and desktop screens.
- **Centralized REST Client**: Built on Axios with interceptors for error extraction and standardized timeout handling.
- **Cloud Database Persistence**: Schema-backed document storage via Mongoose on MongoDB Atlas.

---

## 3. Technology Stack

### Frontend
- **React 19** — Component-driven user interface
- **Vite** — Next-generation frontend tooling and bundler
- **Axios** — Promise-based HTTP client for browser requests
- **HTML5 & CSS3** — Semantic layout and custom responsive styling

### Backend
- **Node.js** — JavaScript runtime environment
- **Express.js** — RESTful API web framework
- **Mongoose** — Object Data Modeling (ODM) library for MongoDB
- **CORS** — Cross-Origin Resource Sharing middleware
- **Dotenv** — Zero-dependency module for environment variable loading

### Database
- **MongoDB Atlas** — Managed cloud document database cluster

### Cloud Deployment
- **Vercel** — Production frontend hosting and edge distribution
- **Render** — Cloud backend application service
- **Git & GitHub** — Version control and continuous deployment pipeline

---

## 4. System Architecture

The application implements a decoupled, three-tier architecture communicating over secure HTTPS:

```text
React 19 + Vite Frontend (Vercel)
         │
         │  HTTPS / REST API / Axios
         ▼
Node.js + Express.js Backend (Render)
         │
         │  TLS 1.3 / Mongoose ODM
         ▼
MongoDB Atlas Cloud Cluster (Database)
```

1. **Client Tier**: React frontend runs in the client browser, handling user interaction and state management.
2. **API Tier**: Express backend processes business logic, validates payloads, enforces CORS policies, and exposes REST endpoints.
3. **Data Tier**: MongoDB Atlas stores book records as structured documents with Mongoose schema enforcement.

---

## 5. Project Structure

The project maintains separation between the frontend client and backend server:

```text
Bookstoreapplication/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection and reconnection logic
│   ├── models/
│   │   └── Book.js               # Mongoose schema and validation rules
│   ├── routes/
│   │   └── bookRoutes.js         # REST API routes and CRUD controllers
│   ├── .env                      # Local backend environment variables (git-ignored)
│   ├── .gitignore                # Backend-specific ignore rules
│   ├── package.json              # Backend dependencies and scripts
│   └── server.js                 # Express server configuration and middleware
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg           # Application favicon
│   │   └── icons.svg             # Static SVG icon assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookCard.jsx      # Individual book card view
│   │   │   ├── BookForm.jsx      # Create/Edit book form with validation
│   │   │   ├── BookList.jsx      # Grid view and empty-state handler
│   │   │   ├── Loading.jsx       # Loading spinner component
│   │   │   └── Navbar.jsx        # Navigation header with view switching
│   │   ├── services/
│   │   │   └── api.js            # Centralized Axios client and API methods
│   │   ├── App.css               # Main component styles and modal styles
│   │   ├── App.jsx               # Application root controller and state
│   │   ├── index.css             # Base typography and design variables
│   │   └── main.jsx              # React 19 entry point
│   ├── .env                      # Local frontend environment variables (git-ignored)
│   ├── .env.production           # Production environment variables (git-ignored)
│   ├── .gitignore                # Frontend-specific ignore rules
│   ├── index.html                # HTML entry document
│   ├── package.json              # Frontend dependencies and scripts
│   └── vite.config.js            # Vite build configuration
│
├── .gitignore                    # Root repository ignore rules
└── README.md                     # Project documentation
```

---

## 6. Frontend Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend local server runs at: `http://localhost:5173`

### Production Build
```bash
# Compile and optimize production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 7. Backend Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB Atlas cluster account

### Installation
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start backend server
npm start
```

The backend local server runs at: `http://localhost:5000`

---

## 8. Environment Variables

Environment variables are isolated from version control. Never commit real credentials to GitHub.

### Backend (`backend/.env`)

```env
# Server port
PORT=5000

# MongoDB Atlas connection URI
MONGO_URI=mongodb+srv://<username>:<password>@cluster2627.avhhhrk.mongodb.net/bookstore?retryWrites=true&w=majority

# Allowed CORS origins (comma-separated or wildcard in development)
FRONTEND_URL=http://localhost:5173,http://localhost:3000
```

### Frontend (`frontend/.env` - Local Development)

```env
# Local Express backend endpoint
VITE_API_URL=http://localhost:5000
```

### Frontend (`frontend/.env.production` - Production)

```env
# Live Render backend endpoint
VITE_API_URL=https://bookstore-backend-zysa.onrender.com
```

---

## 9. MongoDB Atlas Configuration

1. **Cluster Creation**: Set up a free-tier M0 cluster on MongoDB Atlas.
2. **Database User**: Create a database user with `readWriteAnyDatabase` privileges.
3. **Network Access**:
   - In Atlas Console, go to **Security** → **Network Access**.
   - Add IP address `0.0.0.0/0` (Allow Access from Anywhere) with **Permanent** duration to allow connections from Render's cloud servers.
4. **Connection String**: Copy the `mongodb+srv://` connection URI and configure it under `MONGO_URI` in your backend environment settings.

---

## 10. REST API Endpoints

The backend provides a standardized RESTful API:

| Method | Endpoint | Purpose | Success Status | Error Status |
|---|---|---|:---:|:---:|
| `GET` | `/health` | Server health check | `200 OK` | `500` |
| `GET` | `/books` | Retrieve all books (sorted newest first) | `200 OK` | `500`, `503` |
| `GET` | `/books/:id` | Retrieve single book by ObjectId | `200 OK` | `400`, `404`, `503` |
| `POST` | `/books` | Create a new book record | `201 Created` | `400`, `500`, `503` |
| `PUT` | `/books/:id` | Update an existing book record | `200 OK` | `400`, `404`, `503` |
| `DELETE` | `/books/:id` | Delete a book record by ObjectId | `200 OK` | `400`, `404`, `503` |

---

## 11. CRUD Operations

### Create Book (`POST /books`)
**Request Body**:
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "genre": "Software Engineering",
  "price": 29.99,
  "description": "A Handbook of Agile Software Craftsmanship."
}
```
**Response (`201 Created`)**:
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "6af341b9664b8efbc23193a3",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "genre": "Software Engineering",
    "price": 29.99,
    "description": "A Handbook of Agile Software Craftsmanship.",
    "createdAt": "2026-11-10T16:09:29.409Z",
    "updatedAt": "2026-11-10T16:09:29.409Z"
  }
}
```

### Read All Books (`GET /books`)
**Response (`200 OK`)**:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "6af341b9664b8efbc23193a3",
      "title": "Clean Code",
      "author": "Robert C. Martin",
      "genre": "Software Engineering",
      "price": 29.99,
      "description": "A Handbook of Agile Software Craftsmanship."
    }
  ]
}
```

### Update Book (`PUT /books/:id`)
**Request Body**:
```json
{
  "price": 34.99,
  "description": "Updated edition with new design patterns."
}
```
**Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": {
    "_id": "6af341b9664b8efbc23193a3",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "genre": "Software Engineering",
    "price": 34.99,
    "description": "Updated edition with new design patterns."
  }
}
```

### Delete Book (`DELETE /books/:id`)
**Response (`200 OK`)**:
```json
{
  "success": true,
  "message": "Book deleted successfully"
}
```

---

## 12. Local Development

To run the full stack concurrently on your local machine:

1. **Terminal 1 — Backend**:
   ```bash
   cd D:\Bookstoreapplication\backend
   npm install
   npm start
   # Server runs on http://localhost:5000
   ```

2. **Terminal 2 — Frontend**:
   ```bash
   cd D:\Bookstoreapplication\frontend
   npm install
   npm run dev
   # App runs on http://localhost:5173
   ```

3. Open your browser and navigate to `http://localhost:5173`.

---

## 13. Production Deployment

### Backend Deployment (Render)
1. Link GitHub repository `https://github.com/Malik2627/Book_store`.
2. Configure service settings:
   - **Environment**: Node
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
3. Add Environment Variables in Render Dashboard:
   - `PORT`: `5000`
   - `MONGO_URI`: `mongodb+srv://<user>:<password>@cluster2627.avhhhrk.mongodb.net/bookstore?retryWrites=true&w=majority`
   - `FRONTEND_URL`: `https://book-store-gray-iota.vercel.app`

### Frontend Deployment (Vercel)
1. Import GitHub repository `https://github.com/Malik2627/Book_store`.
2. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. Add Environment Variable in Vercel Dashboard:
   - `VITE_API_URL`: `https://bookstore-backend-zysa.onrender.com`

---

## 14. Live Demo

| Component | Service | Live Production URL |
|---|---|---|
| **Frontend Application** | Vercel | [https://book-store-gray-iota.vercel.app/](https://book-store-gray-iota.vercel.app/) |
| **Backend REST API** | Render | [https://bookstore-backend-zysa.onrender.com](https://bookstore-backend-zysa.onrender.com) |
| **Health Check Endpoint** | Render | [https://bookstore-backend-zysa.onrender.com/health](https://bookstore-backend-zysa.onrender.com/health) |

---

## 15. GitHub Repository

- **Repository**: [https://github.com/Malik2627/Book_store](https://github.com/Malik2627/Book_store)
- **Default Branch**: `main`

---

## 16. Production Verification

The deployed application has been verified across all integration layers:

- **Frontend Accessibility**: `GET https://book-store-gray-iota.vercel.app/` returns HTTP `200 OK`.
- **Backend Health**: `GET /health` returns HTTP `200 OK`.
- **Database Query**: `GET /books` returns HTTP `200 OK`.
- **Live UI CRUD Operations**:
  - `POST /books` (CREATE) → HTTP `201 Created`
  - `GET /books` (READ All) → HTTP `200 OK`
  - `GET /books/:id` (READ Single) → HTTP `200 OK`
  - `PUT /books/:id` (UPDATE) → HTTP `200 OK`
  - `DELETE /books/:id` (DELETE) → HTTP `200 OK`
  - `GET /books/:id` (Verify Deletion) → HTTP `404 Not Found`
- **CORS Handling**: Preflight `OPTIONS` allowed for origin `https://book-store-gray-iota.vercel.app`.
- **Protocol Enforcement**: HTTPS strictly enforced on all client and server endpoints.
- **Production Asset Audit**: Zero occurrences of `localhost:5000` or `127.0.0.1:5000` in the deployed production bundle.
- **Data Hygiene**: Temporary verification records removed after test runs; database clean.

---

## 17. Security Notes

- **Strict Exclusion of Secrets**: All `.env`, `.env.local`, and `.env.production` files are strictly excluded from version control via `.gitignore`.
- **No Hardcoded Credentials**: Passwords, connection strings, and tokens are injected exclusively via environment variables on Render and Vercel.
- **Error Sanitization**: Database connection error handlers sanitize connection strings to prevent credential leakage in server logs.
- **CORS Protection**: Restricted to authorized origins in production with preflight validation.
- **HTTPS Encryption**: Transport-layer security (TLS 1.3) protects all browser-to-server and server-to-database communications.

---

## 18. Future Improvements

- Search and real-time title/author filtering
- Category and genre filter dropdowns
- Pagination for large catalog collections
- User authentication and role-based access control (Admin vs. Reader)
- Sorting controls (price ascending/descending, recently added)
- Image upload support for book cover illustrations

---

## 19. Author

**Jaffar Malik**<br />
B.Sc. Computer Science (A.I. & M.L.)<br />
Takshashila University

---

## 20. License

This project is developed for educational and academic assessment purposes.
