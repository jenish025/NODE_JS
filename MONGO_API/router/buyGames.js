const mongoose = require('mongoose');
const { Games } = require('../models/games');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.post('/:id', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body; // User ID will be passed in the request body

  console.log(id, userId);

  if (!isValidObjectId(id) || !isValidObjectId(userId)) {
    return res.status(400).send({ error: 'Invalid game or user ID' });
  }

  try {
    // Find the game and the user
    const game = await Games.findById(id);
    const user = await User.findById(userId);

    if (!game) {
      return res.status(404).send({ error: 'Game not found' });
    }

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Check if the user is the game creator
    if (game.gameCreatorId.toString() === userId) {
      return res
        .status(403)
        .send({ error: 'Game creators cannot buy their own games' });
    }

    // Check if there are available copies
    if (game.availableCopies <= 0) {
      return res.status(400).send({ error: 'No available copies left' });
    }

    // Check if the user already bought the game
    if (user.boughtGames.includes(id)) {
      return res.status(400).send({ error: 'User already bought this game' });
    }

    // Decrement the availableCopies count for the game
    game.availableCopies -= 1;
    await game.save(); // Save the updated game

    // Add the game to the user's boughtGames array
    user.boughtGames.push(game._id);
    await user.save(); // Save the updated user

    // Respond with a success message
    res.status(200).send({ message: 'Game purchased successfully', game });
  } catch (err) {
    console.error('Error buying game:', err);
    res.status(500).send({ error: 'Error processing game purchase' });
  }
});

module.exports = router;
