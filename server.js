const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware to parse incoming requests and enable CORS
app.use(cors());
app.use(express.json());




// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

  

// Import routes
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');

// Use routes
app.use('/api/users', userRoutes);  // User-related routes
app.use('/api/books', bookRoutes);  // Book-related routes


// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));


// Set up server to listen on a specific port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
