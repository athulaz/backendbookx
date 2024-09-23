// const mongoose = require('mongoose');

// // Define the book schema
// const bookSchema = mongoose.Schema({
//   title: {
//     type: String,
//     required: [true, 'Please add a title'],
//   },
//   author: {
//     type: String,
//     required: [true, 'Please add an author'],
//   },
//   genre: {
//     type: String,
//     required: [true, 'Please add a genre'],
//   },

//   description: {
//     type: String,
//     required: [true, 'Please add a description'],
//   },
//   imageUrl: {
//     type: String, // URL of the uploaded image
//     required: [true, 'Please add an image'],
//   },
  
//   userId: {
//     type: mongoose.Schema.Types.ObjectId, // Link to the user who added the book
//     required: true,
//     ref: 'User',
//   },
// }, { timestamps: true }); // Adds createdAt and updatedAt fields

// const Book = mongoose.model('Book', bookSchema);

// module.exports = Book;


const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
  },
  author: {
    type: String,
    required: [true, 'Please add an author'],
  },
  genre: {
    type: String,
    required: [true, 'Please add a genre'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  imageUrl: {
    type: String, // URL of the uploaded image
    required: [true, 'Please add an image'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
