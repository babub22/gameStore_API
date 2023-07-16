const mongoose = require("mongoose");
const blockingInfoSchema = require("./blockingInfoSchema");

const userStatusSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["Active", "Blocked"],
    default: "Active",
    required: true,
  },
  blockingInfo: {
    type: blockingInfoSchema,
    required: function () {
      return this.status === "Blocked";
    },
  },
});

module.exports = userStatusSchema;
