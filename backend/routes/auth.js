const express = require('express');
const router = express.Router();

// Mock data for demonstration
const users = []; // In real apps, this would be stored in the database

// POST - Register a new user
router.post('/signup', (req, res) => {
  const { username, password } = req.body;
  
  // Here you would typically add validation and save the user to the database
  users.push({ username, password }); // Mock saving the user
  res.status(201).json({ message: 'User registered successfully' });
});

// POST - Login user
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Find the user (this is just a simple mock check)
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ message: 'Login successful' });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;
