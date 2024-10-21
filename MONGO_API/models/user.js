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
    stripeCustomerId: {
      type: String,
      unique: true,
      sparse: true, // Allows for unique values while permitting nulls
    },
  },
  { versionKey: false } // Exclude __v from the schema
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    // config.get('jwtSecret')
    'gameses_jwt_secret'
  );
  return token;
};

const User = mongoose.model('User', userSchema);
exports.User = User;
