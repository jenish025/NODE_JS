const express = require('express');
const authors = require('../models/authorModel');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(authors);
});

router.post('/', (req, res) => {
  const { name, biography } = req.body;
  const newAuthor = {
    id: authors.length + 1,
    name,
    biography,
  };
  authors.push(newAuthor);
  res.status(201).json(newAuthor);
});

// Similar routes for GET /:id, PUT /:id, DELETE /:id

module.exports = router;
