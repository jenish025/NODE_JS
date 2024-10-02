const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { passwordHashing } = require('../controllers/passwordHashing');

router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).send({ error: 'User already exists' });
    }

    const hashedPassword = await passwordHashing(10, password);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    const saveUser = await newUser.save();
    const token = saveUser.generateAuthToken();
    res
      .header('x-auth-token', token)
      .status(201)
      .send(_.pick(saveUser, ['_id', 'name', 'email']));
  } catch (err) {
    res.status(400).send({ error: err.message || 'Somthing went wrong' });
  }
});

module.exports = router;
