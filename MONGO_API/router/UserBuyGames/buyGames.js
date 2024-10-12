const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const authentication = require('../../middlewares/authentication');
const { UserGamesBought } = require('../../models/userGamesBuy');
const { UserGamesCreate } = require('../../models/userGamesCreate');
const { User } = require('../../models/user');
const { Games } = require('../../models/games');
const { UserMoney } = require('../../models/userMoney');
const stripe = require('stripe')(
  'sk_test_51Q7s8OAWHP6mFb1qYV1RJMugzyE5ZD7IaDZn3iG41k7zuht2uN7dVwMpFIKwXhSCanRCAHupgJfaH8Xo2q5RZ2fH00l8cgkkMq'
);

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

router.post('/:id', authentication, async (req, res) => {
  try {
    const { id } = req.params; // Game ID
    const { userId } = req.body; // User ID passed in the request body

    // Check if the user making the request is the same as the user in the body
    if (userId != req.user._id) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    // Validate IDs
    if (!isValidObjectId(id) || !isValidObjectId(userId)) {
      return res.status(400).send({ error: 'Invalid game or user ID' });
    }

    // Find the game and user
    const game = await Games.findById(id);
    const user = await User.findById(userId);
    const userWallet = await UserMoney.findOne({ userId });

    if (!game) {
      return res.status(404).send({ error: 'Game not found' });
    }

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Check if the user has already bought or created the game
    const userBoughtGames = await UserGamesBought.findOne({
      userId,
      gameBoughtId: id,
    });
    const userCreatedGames = await UserGamesCreate.findOne({
      userId,
      gameCreatedId: id,
    });

    if (userCreatedGames) {
      return res.status(403).send({
        error: 'Game creators cannot buy their own games',
      });
    }

    if (userBoughtGames) {
      return res.status(400).send({
        error: 'User already bought this game',
      });
    }

    if (game.availableCopies <= 0) {
      return res.status(400).send({
        error: 'No available copies left',
      });
    }

    // Find game creator information
    const gamecreaterInfo = await UserGamesCreate.findOne({
      gameCreatedId: id,
    });

    if (!gamecreaterInfo) {
      return res.status(404).send({ error: 'Game creator not found' });
    }

    const gameCreaterWallet = await UserMoney.findOne({
      userId: gamecreaterInfo.userId,
    });

    if (!gameCreaterWallet) {
      return res.status(404).send({ error: 'Game creator wallet not found' });
    }

    // Check if the game is not free and if the user has enough funds
    if (!game.isFree) {
      if (!userWallet) {
        return res.status(404).send({ error: 'User wallet not found' });
      }
      if (userWallet.totalMoney < game.price) {
        return res.status(400).send({ error: 'Insufficient funds' });
      }

      // Deduct the price from the user's wallet
      userWallet.walletMoney -= game.price;
      userWallet.moneySpent += game.price;
      userWallet.totalMoney -= game.price;

      // Add the game price to the creator's wallet
      gameCreaterWallet.moneyEarned += game.price;
    }

    // Reduce available copies of the game
    game.availableCopies -= 1;

    // Record the user's game purchase
    const userGamesBought = new UserGamesBought({
      userId,
      gameBoughtId: id,
    });

    // Save the changes
    const paymentStripe = await stripe.checkout.sessions.create({
      mode: 'payment',
      currency: 'usd',
      customer: user.stripeCustomerId, // If using saved customers
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: game.name,
            },
            unit_amount: game.price * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        gameId: game._id.toHexString(),
        gameCreatorId: gamecreaterInfo.userId.toHexString(),
        gameBoughtId: userId,
      },
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    req.redirect(paymentStripe.url);

    await userWallet.save();
    await game.save();
    await gameCreaterWallet.save();
    const userGamesBoughtResult = await userGamesBought.save();

    res.status(200).send({
      message: 'Game purchased successfully',
      userGamesBoughtResult,
    });
  } catch (err) {
    console.error('Error buying game:', err);
    res.status(500).send({ error: 'Error processing game purchase' });
  }
});

module.exports = router;
