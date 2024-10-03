const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 1, maxlength: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true, minlength: 4, maxlength: 1050 },
    isAdmin: { type: Boolean, default: false },
  },
  { versionKey: false } // Exclude __v from the schema
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get('jwtSecret')
  );
  return token;
};

const User = mongoose.model('User', userSchema);
exports.User = User;
