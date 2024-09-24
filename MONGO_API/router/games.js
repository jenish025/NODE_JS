const { Games } = require('../models/games');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/games - Retrieve list of games
router.get('/', async (req, res) => {
  try {
    const games = await Games.find().limit(10).sort({ name: 1 });
    res.status(200).send(games);
  } catch (err) {
    res.status(500).send({ error: 'An error occurred while fetching games' });
  }
});

// POST /api/games - Create a new game
router.post('/', async (req, res) => {
  try {
    const {
      name,
      price,
      tags,
      isReleased,
      availableCopies,
      trailer,
      availablePlatforms,
    } = req.body;

    const newGame = new Games({
      name,
      price,
      isFree: price === 0,
      tags,
      isReleased,
      availableCopies: isReleased ? availableCopies : 0,
      trailer,
      availablePlatforms,
    });

    const savedGame = await newGame.save();
    res.status(201).send(savedGame);
  } catch (err) {
    res.status(400).send({ error: err.message || 'Error creating game' });
  }
});

// PUT /api/games/:id - Update an existing game
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).send({ error: 'Invalid game ID' });
  }

  try {
    const updatedGame = await Games.findByIdAndUpdate(
      id,
      {
        $set: {
          name: req.body.name,
          price: req.body.price,
          isFree: req.body.price === 0,
          tags: req.body.tags,
          isReleased: req.body.isReleased,
          availableCopies: req.body.availableCopies,
          trailer: req.body.trailer,
          availablePlatforms: req.body.availablePlatforms,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedGame) {
      return res.status(404).send({ error: 'Game not found' });
    }

    res.status(200).send(updatedGame);
  } catch (err) {
    res.status(400).send({ error: err.message || 'Error updating game' });
  }
});

// GET /api/games/:id - Get game by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).send({ error: 'Invalid game ID' });
  }

  try {
    const game = await Games.findById(id);
    if (!game) {
      return res.status(404).send({ error: 'Game not found' });
    }
    res.status(200).send(game);
  } catch (err) {
    res.status(500).send({ error: 'Error fetching game details' });
  }
});

// DELETE /api/games/:id - Delete a game by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).send({ error: 'Invalid game ID' });
  }

  try {
    const deleteResult = await Games.deleteOne({ _id: id });
    if (deleteResult.deletedCount === 0) {
      return res.status(404).send({ error: 'Game not found' });
    }
    res.status(200).send({ message: 'Game deleted successfully' });
  } catch (err) {
    res.status(500).send({ error: 'Error deleting game' });
  }
});

module.exports = router;
