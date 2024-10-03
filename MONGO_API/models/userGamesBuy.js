const mongoose = require('mongoose');

const userGamesBoughtSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  gameBoughtId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Games',
  },
});

const UserGamesBought = mongoose.model('UserGamesBuy', userGamesBoughtSchema);
exports.UserGamesBought = UserGamesBought;
