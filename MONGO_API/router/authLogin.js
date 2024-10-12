const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { User } = require('../models/user');
const { passwordCompare } = require('../controllers/passwordHashing');

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user with email and password, and return a JWT token.
 *     tags:
 *       - User Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: password123
 *     responses:
 *       200:
 *         description: User successfully authenticated and token returned
 *         headers:
 *           x-auth-token:
 *             description: JWT authentication token
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
 *       400:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Invalid Email or Password
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: Error creating game
 */

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send({ error: 'Invalid Email or Password' });
    }
    const isValid = await passwordCompare(password, user.password);
    if (!isValid)
      return res.status(400).send({ error: 'Invalid Email or Password' });
    const token = user.generateAuthToken();
    res.status(200).header('x-auth-token', token).send({ token });
  } catch (err) {
    res.status(500).send({ error: err.message || 'Error creating game' });
  }
});

module.exports = router;
