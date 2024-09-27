const express = require('express');
const categories = require('../models/categoryModel');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(categories);
});

router.post('/', (req, res) => {
  const { name, description } = req.body;
  const newCategory = {
    id: categories.length + 1,
    name,
    description,
  };
  categories.push(newCategory);
  res.status(201).json(newCategory);
});

// Similar routes for GET /:id, PUT /:id, DELETE /:id

module.exports = router;
