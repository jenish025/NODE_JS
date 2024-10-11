const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { passwordHashing } = require('../controllers/passwordHashing');
const { UserMoney } = require('../models/userMoney');
const stripe = require('stripe')(
  'sk_test_51Q7s8OAWHP6mFb1qYV1RJMugzyE5ZD7IaDZn3iG41k7zuht2uN7dVwMpFIKwXhSCanRCAHupgJfaH8Xo2q5RZ2fH00l8cgkkMq'
);

router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).send({ error: 'User already exists' });
    }

    const hashedPassword = await passwordHashing(10, password);
    const stripeCustomer = await stripe.customers.create({
      email: email,
      name: name,
    });

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      stripeCustomerId: stripeCustomer.id,
    });
    const saveUser = await newUser.save();

    const userWallet = new UserMoney({
      userId: saveUser._id,
    });
    await userWallet.save();

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
