const mongoose = require('mongoose');

const userMoneySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  walletMoney: {
    type: Number,
    default: 0,
  },
  totalMoney: {
    type: Number,
    default: 0,
  },
  moneySpent: {
    type: Number,
    default: 0,
  },
  moneyEarned: {
    type: Number,
    default: 0,
  },
  moneyDeposited: {
    type: Number,
    default: 0,
  },
  moneyWithdrawn: {
    type: Number,
    default: 0,
  },
  moneyReceivedAsGift: {
    type: Number,
    default: 0,
  },
});

const UserMoney = mongoose.model('UserMoney', userMoneySchema);
exports.UserMoney = UserMoney;
