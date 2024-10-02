const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { User } = require('../models/user');
const { passwordCompare } = require('../controllers/passwordHashing');

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
