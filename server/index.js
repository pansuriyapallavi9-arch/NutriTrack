const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware — allows JSON data and cross-origin requests
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors());

// Routes (we'll add these next)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/meals', require('./routes/meals'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/water', require('./routes/water'));

// Test route — just to confirm server is working
app.get('/', (req, res) => {
  res.json({ message: 'NutriTrack API is running!' });
});

// Connect to MongoDB then start server
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.log('MongoDB connection error:', error);
  });