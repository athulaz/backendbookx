const mongoose = require('mongoose');

// Define the user schema
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true, // Ensure each email is unique
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
  },
}, { timestamps: true }); // Adds createdAt and updatedAt fields

const User = mongoose.model('User', userSchema);

module.exports = User;
