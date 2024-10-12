const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const authentication = require('../../middlewares/authentication');
const { User } = require('../../models/user');
const { UserGamesBought } = require('../../models/userGamesBuy');
const { UserGamesCreate } = require('../../models/userGamesCreate');
const { Games } = require('../../models/games');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/userinfo/:id - Retrieve user information

/**
 * @swagger
 * /api/userinfo/:id:
 *   get:
 *     summary: Get user info with bought and created games
 *     description: Retrieve user information, including their bought and created games. Authentication is required.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user's ID
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: User ID
 *                 name:
 *                   type: string
 *                   description: User's name
 *                 email:
 *                   type: string
 *                   description: User's email
 *                 isAdmin:
 *                   type: boolean
 *                   description: Whether the user is an admin
 *                 boughtGames:
 *                   type: array
 *                   items:
 *                     type: object
 *                 createdGames:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid user ID
 *       403:
 *         description: Forbidden! User does not have permission
 *       404:
 *         description: User not found
 *       500:
 *         description: Error occurred while fetching user information
 */

router.get('/:id', authentication, async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).send({ error: 'Invalid user ID' });
    }
    if (id != req.user._id) {
      return res
        .status(403)
        .send({ error: 'forbidden ! user does not have permission to access' });
    }

    const user = await User.findOne({ _id: id }).select('-password');
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    const boughtGames = await UserGamesBought.find({ userId: id });
    const boughtGameIds = boughtGames.map((buy) => buy.gameBoughtId);

    const createdGames = await UserGamesCreate.find({ userId: id });
    const createdGameIds = createdGames.map((create) => create.gameCreatedId);

    const [boughtGamesDetails, createdGamesDetails] = await Promise.all([
      Games.find({ _id: { $in: boughtGameIds } })
        .select(['-availableCopies', '-isReleased', '-isFree', '-price'])
        .limit(3),
      Games.find({ _id: { $in: createdGameIds } }).limit(5),
      ,
    ]);

    const userInfo = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      boughtGames: boughtGamesDetails,
      createdGames: createdGamesDetails,
    };

    res.status(200).send(userInfo);
  } catch (err) {
    res.status(500).send({
      error: `${err}:An error occurred while fetching user information`,
    });
  }
});

router.get('/games/buy/:id', authentication, async (req, res) => {
  try {
    const { id } = req.params;
    if (id != req.user._id) {
      return res.status(403).send({
        error: 'forbidden! user does not have permission to access',
      });
    }
    if (!isValidObjectId(id)) {
      return res.status(400).send({ error: 'Invalid user ID' });
    }
    if (id != req.user._id) {
      return res.status(403).send({
        error: 'forbidden ! user does not have permission to access',
      });
    }
    const boughtGames = await UserGamesBought.find({ userId: id });
    const boughtGameIds = boughtGames.map((buy) => buy.gameBoughtId) || [];
    const [boughtGamesDetails] = await Promise.all([
      Games.find({ _id: { $in: boughtGameIds } }).select([
        '-availableCopies',
        '-isReleased',
        '-isFree',
        '-price',
      ]),
    ]);
    const numberOfGamesBought = boughtGamesDetails.length;
    res.status(200).send({
      totalBoughtGames: numberOfGamesBought || 0,
      games: boughtGamesDetails || [],
    });
  } catch (err) {
    res.status(500).send({ error: 'An error occurred while fetching users' });
  }
});

/**
 * @swagger
 * /api/userinfo/games/create/:id:
 *   get:
 *     summary: Get games created by user
 *     description: Retrieve all games created by a user. Authentication is required.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The user's ID
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved created games
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCreatedGames:
 *                   type: integer
 *                   description: Total number of games created
 *                 games:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Invalid user ID
 *       403:
 *         description: Forbidden! User does not have permission
 *       500:
 *         description: Error occurred while fetching created games
 */
router.get('/games/create/:id', authentication, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).send({ error: 'Invalid user ID' });
    }
    if (id != req.user._id) {
      return res.status(403).send({
        error: 'forbidden ! user does not have permission to access',
      });
    }
    const createdGames = await UserGamesCreate.find({ userId: id });
    const createdGameIds =
      createdGames.map((create) => create.gameCreatedId) || [];
    const [createdGamesDetails] = await Promise.all([
      Games.find({ _id: { $in: createdGameIds } }),
    ]);
    const numberOfGamesBought = createdGamesDetails.length;
    res.status(200).send({
      totalCretedGames: numberOfGamesBought || 0,
      games: createdGamesDetails || [],
    });
  } catch (err) {
    res.status(500).send({ error: 'An error occurred while fetching users' });
  }
});

module.exports = router;
