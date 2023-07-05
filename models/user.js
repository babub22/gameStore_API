const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: "String",
    required: true,
    minlength: 3,
    trim: true,
  },
  email: {
    type: "String",
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: "String",
    required: true,
    minlength: 3,
  },
  role: {
    type: "String",
    required: true,
  },
  isReviewer: Boolean,
});

const User = mongoose.model("User", userSchema);

module.exports = { User, userSchema };