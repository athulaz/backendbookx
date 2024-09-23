const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');

const router = express.Router();

// Route to register a new user
// POST /api/users/register
router.post('/register', registerUser);

// Route to log in a user
// POST /api/users/login
router.post('/login', loginUser);

module.exports = router;
