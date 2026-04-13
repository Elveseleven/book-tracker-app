require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' Connected to MongoDB'))
  .catch(err => console.error(' Connection error:', err.message));

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});