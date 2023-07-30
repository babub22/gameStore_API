const mongoose = require("mongoose");

const developerSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 1,
    unique: true,
    trim: true,
  },
});

const Developer = mongoose.model("Developer", developerSchema);

module.exports = { Developer, developerSchema };
