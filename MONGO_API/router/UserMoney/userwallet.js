const express = require('express');
const { UserMoney } = require('../../models/userMoney');
const authentication = require('../../middlewares/authentication');
const router = express.Router();

// GET /api/user/money - Retrieve list of games
router.get('/:id', authentication, async (req, res) => {
  try {
    const { id } = req.params;
    if (id != req.user._id) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    const userWallet = await UserMoney.findOne({ userId: id });
    res.status(200).send(userWallet);
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

router.post('/add/:id', authentication, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    // Check if the user is authorized
    if (id != req.user._id) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    // Find the user's wallet
    const userWallet = await UserMoney.findOne({ userId: id });
    if (!userWallet) {
      return res.status(404).send({ error: 'Something went wrong' });
    }

    // Ensure `amount` is a valid number
    if (isNaN(amount)) {
      return res.status(400).send({ error: 'Invalid amount' });
    }

    // Update walletMoney and moneyDeposited
    userWallet.walletMoney += amount;
    userWallet.moneyDeposited += amount;

    // Calculate totalMoney
    userWallet.totalMoney =
      (userWallet.moneyDeposited ?? 0) +
      (userWallet.moneyReceivedAsGift ?? 0) -
      (userWallet.moneySpent ?? 0);

    // Save the updated wallet
    await userWallet.save();

    res.status(200).send({ message: 'Money added successfully', userWallet });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
