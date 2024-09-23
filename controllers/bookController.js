const Book = require('../models/bookModel');

const multer = require('multer');

// Set up multer for local image storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

const addBook = async (req, res) => {
  const { title, author, genre, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    const book = await Book.create({
      title,
      author,
      genre,
      description,
      imageUrl,
      userId: req.user._id,
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error adding book', error });
  }
};

// @desc    Edit a book
// @route   PUT /api/books/:id
// @access  Private
const editBook = async (req, res) => {
   const { id } = req.params;
   const { title, author, genre, description } = req.body;
 
   try {
     const book = await Book.findById(id);
     if (!book) {
       return res.status(404).json({ message: 'Book not found' });
     }
 
     // Ensure the user trying to edit is the owner of the book
     if (book.userId.toString() !== req.user._id.toString()) {
       return res.status(401).json({ message: 'Not authorized to edit this book' });
     }
 
     // Update fields
     book.title = title || book.title;
     book.author = author || book.author;
     book.genre = genre || book.genre;
     book.description = description || book.description;
 
     // Update image if a new one is uploaded
     if (req.file) {
       book.imageUrl = `/uploads/${req.file.filename}`;
     }
 
     const updatedBook = await book.save();
     res.status(200).json(updatedBook);
   } catch (error) {
     res.status(500).json({ message: 'Error editing book', error });
   }
 };
 
// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private

const deleteBook = async (req, res) => {
   const { id } = req.params;
 
   try {
     // Log book and user details for debugging
     console.log('Deleting Book ID:', id);
     console.log('User ID:', req.user._id);
 
     const book = await Book.findById(id);
 
     if (!book) {
       return res.status(404).json({ message: 'Book not found' });
     }
 
     // Ensure that the user deleting the book is the owner
     if (book.userId.toString() !== req.user._id.toString()) {
       return res.status(401).json({ message: 'Not authorized to delete this book' });
     }
 
     // Use findByIdAndDelete instead of book.remove()
     await Book.findByIdAndDelete(id);
 
     res.status(200).json({ message: 'Book removed successfully' });
   } catch (error) {
     console.error('Error deleting book:', error);
     res.status(500).json({ message: 'Error deleting book', error });
   }
 };
 

// @desc    Search books by title, author, or genre
// @route   GET /api/books/search
// @access  Private
const searchBooks = async (req, res) => {
  const { query } = req.query;

  try {
    const searchQuery = query
      ? {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { author: { $regex: query, $options: 'i' } },
            { genre: { $regex: query, $options: 'i' } },
          ],
          userId: req.user._id, // Only return books owned by the logged-in user
        }
      : { userId: req.user._id };

    const books = await Book.find(searchQuery);

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error });
  }
};



module.exports = { addBook, editBook, deleteBook, searchBooks };
