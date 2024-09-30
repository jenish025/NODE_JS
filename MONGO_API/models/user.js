const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 1, maxlength: 50 },
    email: { type: String, required: true, minlength: 5, maxlength: 50 },
    password: { type: String, required: true, minlength: 8, maxlength: 50 },
    isAdmin: { type: Boolean, default: false },
    gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Games' },
    gamesCreated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'games', // Reference to the games created by the user
      },
    ],
    boughtGames: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Games', // Reference to games bought by the user
      },
    ],
  },
  { versionKey: false } // Exclude __v from the schema
);

const User = mongoose.model('User', userSchema);
exports.User = User;
