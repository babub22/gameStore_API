const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const compareHashedStrings = require("../../utils/bcrypt/compareHashedStrings");
const { pick } = require("lodash");
const getHashedString = require("../../utils/bcrypt/getHashedString");
const userStatusSchema = require("./userStatusSchema");

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
    enum: ["User", "Moderator", "Admin"],
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

userSchema.statics.validateSignin = async function ({ password, email }) {
  const user = await this.findOne({ email });

  if (!user) {
    return { status: 404, message: "User with this mail doesnt exist!" };
  }

  const isValidPassword = await compareHashedStrings(password, user.password);

  if (!isValidPassword) {
    return { status: 404, message: "Password is wrong!" };
  }

  const token = await user.generateAuthToken();

  return { token, name: user.name };
};

userSchema.statics.validateSingup = async function (singupData) {
  const { email, password } = singupData;

  const user = await this.findOne({ email });

  if (user) {
    return { status: 400, message: "This user already exist!" };
  }

  const hashedPassword = await getHashedString(password);

  const newUser = new this({
    ...singupData,
    password: hashedPassword,
  });

  await newUser.save();

  const token = newUser.generateAuthToken();

  return { token, newUser: pick(newUser, ["_id", "name", "email"]) };
};

const User = mongoose.model("User", userSchema);

module.exports = { User, userSchema };
