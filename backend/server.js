require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Test route to verify server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// MongoDB Connection with better error handling
console.log("mongo db url", process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/leafnode')
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    
    // Only start server after DB connects
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`👉 CORS enabled for origin: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Models
const User = require('./models/User');
const Complaint = require('./models/Complaint');

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) throw new Error();
    
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

// Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('Registration attempt:', req.body);
    
    if (!req.body.email || !req.body.password || !req.body.name) {
      return res.status(400).json({ 
        error: 'Please provide all required fields: name, email, and password' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      console.log('User already exists:', req.body.email);
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = new User(req.body);
    await user.save();
    
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    console.log('Registration successful for:', req.body.email);

    res.status(201).json({ 
      user: userResponse, 
      token 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      error: error.message || 'Registration failed',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password))) {
      throw new Error('Invalid login credentials');
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
    // Convert to plain object and remove password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.send({ user: userResponse, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Complaints routes
app.post('/api/complaints', auth, async (req, res) => {
  try {
    const complaint = new Complaint({
      ...req.body,
      userId: req.user._id
    });
    await complaint.save();
    res.status(201).send(complaint);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/complaints', auth, async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id });
    res.send(complaints);
  } catch (error) {
    res.status(500).send(error);
  }
});
