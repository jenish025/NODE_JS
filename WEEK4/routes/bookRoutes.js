const express = require('express');
const books = require('../models/bookModel');
const validateBook = require('../middlewares/validateBook');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(books);
});

router.post('/', validateBook, (req, res) => {
  const { title, authorId, categoryId, publicationYear } = req.body;
  const newBook = {
    id: books.length + 1,
    title,
    authorId,
    categoryId,
    publicationYear,
  };
  books.push(newBook);
  res.status(201).json(newBook);
});

router.get('/:id', (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

router.put('/:id', validateBook, (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: 'Book not found' });

  const { title, authorId, categoryId, publicationYear } = req.body;
  book.title = title;
  book.authorId = authorId;
  book.categoryId = categoryId;
  book.publicationYear = publicationYear;

  res.json(book);
});

router.delete('/:id', (req, res) => {
  const bookIndex = books.findIndex((b) => b.id === parseInt(req.params.id));
  if (bookIndex === -1)
    return res.status(404).json({ message: 'Book not found' });

  books.splice(bookIndex, 1);
  res.status(204).end();
});

module.exports = router;
