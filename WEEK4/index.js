require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const bookRoutes = require('./routes/bookRoutes.js');
const authorRoutes = require('./routes/authorRoutes.js');
const categoryRoutes = require('./routes/categoryRoutes.js');
const logger = require('./middlewares/logger.js');
const errorHandler = require('./middlewares/errorHandler.js');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev')); // Use Morgan for logging
app.use(logger); // Custom logging middleware

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/categories', categoryRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
