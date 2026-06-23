require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to MongoDB database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for easier local dev/testing
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/decisions', require('./routes/decisions'));
app.use('/api/evaluations', require('./routes/evaluations'));
app.use('/api/outcomes', require('./routes/outcomes'));

// Default Health Route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Inner Council Backend API is active' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error('Error occurred:', err.stack || err.message);
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
