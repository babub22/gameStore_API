const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
  },
  role: {
    type: String,
    enum: ["User", "Admin"],
  },
  isReviewer: {
    type: Boolean,
    default: false,
    require: true,
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      role: this.role ?? "User",
      isReviewer: this.isReviewer,
    },
    config.get("jwtPrivateKey")
  );
};

const User = mongoose.model("User", userSchema);

module.exports = { User, userSchema };
