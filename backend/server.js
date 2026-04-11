require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// ROUTES
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' Connected to MongoDB'))
  .catch(err => console.error(' Connection error:', err.message));

// TEST ROUTE 
app.get('/', (req, res) => {
  res.send('API is running...');
});

// API ROUTES
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});