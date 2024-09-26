const express = require('express');
const { addBook, editBook, deleteBook, searchBooks, getBookById } = require('../controllers/bookController');
const { protect } = require('../middlewares/authMiddleware');
const multer = require('multer');

const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Route to add a new book (with image upload)
router.post('/', protect, upload.single('image'), addBook);

// Route to edit a book (with optional image upload)
router.put('/:id', protect, upload.single('image'), editBook);

// Route to delete a book
router.delete('/:id', protect, deleteBook);

// Route to search for books
router.get('/search', protect, searchBooks);

router.get('/:id', protect, getBookById); // Add this route for getting book details



module.exports = router;
