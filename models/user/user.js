const mongoose = require("mongoose");
const userStatusSchema = require("./userStatusSchema");
const validateSignin = require("./statics/validateSignin");
const validateSingup = require("./statics/validateSingup");
const generateAuthToken = require("./methods/generateAuthToken");
const blockUserById = require("./statics/blockUserById");
const changeRoleById = require("./statics/changeRoleById");
const increaseReviewsCountById = require("./statics/increaseReviewsCountById");
const findUsersAndSortByQuery = require("./statics/findUsersAndSortByQuery");

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
    default: "User",
  },
  registrationDate: {
    type: Date,
  },
  reviewsCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  isReviewer: {
    type: Boolean,
  },
  userStatus: { type: userStatusSchema, default: { userStatusSchema } },
});

userSchema.methods.generateAuthToken = generateAuthToken;

userSchema.statics.blockUserById = blockUserById;
userSchema.statics.validateSignin = validateSignin;
userSchema.statics.validateSingup = validateSingup;
userSchema.statics.changeRoleById = changeRoleById;
userSchema.statics.increaseReviewsCountById = increaseReviewsCountById;
userSchema.statics.findUsersAndSortByQuery = findUsersAndSortByQuery;

const User = mongoose.model("User", userSchema);

module.exports = { User, userSchema };
