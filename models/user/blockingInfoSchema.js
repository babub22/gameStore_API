const mongoose = require("mongoose");

const blockingInfoSchema = new mongoose.Schema({
  blockedBy: {
    type: new mongoose.Schema({
      name: { type: String, required: true, minlength: 3, trim: true },
    }),
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  blockingDate: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = blockingInfoSchema;
