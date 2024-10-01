const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const _ = require('lodash');
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
    const token = jwt.sign({ _id: user._id }, 'jwtToken');
    res.status(200).send({ token });
  } catch (err) {
    res.status(400).send({ error: err.message || 'Error creating game' });
  }
});

module.exports = router;
