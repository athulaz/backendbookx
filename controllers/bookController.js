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
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';  // This should match the path where the image is saved
  console.log(req.file);  // This will log the details of the uploaded file

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
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Allow deletion if the book has no userId (for old entries)
    if (book.userId && book.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this book' });
    }

    await Book.findByIdAndDelete(id);
    res.status(200).json({ message: 'Book removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error });
  }
};



// @desc    Search books by title, author, or genre
// @route   GET /api/books/search
// @access  Private (You can leave it private if the user needs to be logged in)
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
          // Remove userId filter to allow fetching all books
          // userId: req.user._id
        }
      : {}; // No user-specific filter, fetch all books

    // const books = await Book.find(searchQuery);
    const books = await Book.find(searchQuery).populate('userId', 'name email'); // Populate user details

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error });
  }
};

// @desc    Get a single book by ID
// @route   GET /api/books/:id
// @access  Private
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book', error });
  }
};


module.exports = { addBook, editBook, deleteBook, searchBooks, getBookById };

