const mongoose = require('mongoose');

const userGamesCreateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  gameCreatedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Games',
  },
});

const UserGamesCreate = mongoose.model(
  'UserGamesCreate',
  userGamesCreateSchema
);
exports.UserGamesCreate = UserGamesCreate;
