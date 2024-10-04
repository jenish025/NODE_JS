const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const authentication = require('../../middlewares/authentication');
const { UserGamesBought } = require('../../models/userGamesBuy');
const { UserGamesCreate } = require('../../models/userGamesCreate');
const { User } = require('../../models/user');
const { Games } = require('../../models/games');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.post('/:id', authentication, async (req, res) => {
  try {
    const { id } = req.params; // game id
    const { userId } = req.body; // User ID will be passed in the request body

    if (userId != req.user._id) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    if (!isValidObjectId(id) || !isValidObjectId(userId)) {
      return res.status(400).send({ error: 'Invalid game or user ID' });
    }
    // Find the game and the user
    const game = await Games.findById(id);
    const user = await User.findById(userId);

    if (!game) {
      return res.status(404).send({ error: 'Game not found' });
    }

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    const userBoughtGames = await UserGamesBought.findOne({
      userId,
      gameBoughtId: id,
    });
    const userCreatedGames = await UserGamesCreate.findOne({
      userId,
      gameCreatedId: id,
    });

    if (userCreatedGames) {
      return res
        .status(403)
        .send({ error: 'Game creators cannot buy their own games' });
    }

    if (game.availableCopies <= 0) {
      return res.status(400).send({ error: 'No available copies left' });
    }

    if (userBoughtGames) {
      return res.status(400).send({ error: 'User already bought this game' });
    }

    const userGamesBought = await UserGamesBought({
      userId: userId,
      gameBoughtId: id,
    });

    game.availableCopies -= 1;
    await game.save();

    const userGamesBoughtResult = await userGamesBought.save();
    res
      .status(200)
      .send({ message: 'Game purchased successfully', userGamesBoughtResult });
  } catch (err) {
    console.error('Error buying game:', err);
    res.status(500).send({ error: 'Error processing game purchase' });
  }
});

module.exports = router;
