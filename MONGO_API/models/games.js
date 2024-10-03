const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 1, maxlength: 50 },
    price: { type: Number, min: 0 },
    isFree: { type: Boolean },
    tags: {
      type: Array,
      required: true,
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'A Game should have at least one tag',
      },
      set: function (v) {
        if (typeof v === 'string') {
          return v.split(',').map((tag) => tag.trim().toUpperCase());
        }
        return v.map((tag) => tag.toUpperCase());
      },
    },
    date: { type: Date, default: Date.now },
    isReleased: { type: Boolean, required: true },
    availableCopies: { type: Number },
    trailer: { type: String },
    availablePlatforms: {
      type: Array,
      set: function (v) {
        if (typeof v === 'string') {
          return v.split(',').map((platform) => platform.trim().toUpperCase());
        }
        return v.map((platform) => platform.toUpperCase());
      },
    },
  },
  { versionKey: false } // Exclude __v from the schema
);

const Games = mongoose.model('Games', gameSchema);

exports.Games = Games;
