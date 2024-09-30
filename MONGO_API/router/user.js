const { User } = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = new User({
      name,
      email,
      password,
    });

    const saveUser = await newUser.save();
    res.status(201).send(saveUser);
  } catch (err) {
    res.status(400).send({ error: err.message || 'Error creating game' });
  }
});

module.exports = router;
