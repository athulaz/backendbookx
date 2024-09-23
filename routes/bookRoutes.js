// const express = require('express');
// const { addBook, editBook, deleteBook, searchBooks } = require('../controllers/bookController');
// const { protect } = require('../middlewares/authMiddleware');

// const router = express.Router();

// // Route to add a new book
// // POST /api/books
// router.post('/', protect, addBook);

// // Route to edit a book
// // PUT /api/books/:id
// router.put('/:id', protect, editBook);

// // Route to delete a book
// // DELETE /api/books/:id
// router.delete('/:id', protect, deleteBook);

// // Route to search for books
// // GET /api/books/search
// router.get('/search', protect, searchBooks);

// router.post('/', protect, upload.single('image'), addBook);

// module.exports = router;

const express = require('express');
const { addBook, editBook, deleteBook, searchBooks } = require('../controllers/bookController');
const { protect } = require('../middlewares/authMiddleware');
const multer = require('multer'); // Import multer for handling file uploads

const router = express.Router();

// Set up multer storage for images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to store images
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Save files with a timestamp
  }
});

const upload = multer({ storage }); // Initialize multer with the storage config

// Route to add a new book (with image upload)
router.post('/', protect, upload.single('image'), addBook);

// Route to edit a book
router.put('/:id', protect, editBook);

// Route to delete a book
router.delete('/:id', protect, deleteBook);

// Route to search for books
router.get('/search', protect, searchBooks);

module.exports = router;

