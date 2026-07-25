const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: "Invalid avatar URL"
    },
    weather: {
      type: String,
      required: true,
      enum: ["hot", "cold", "rainy", "snowy"]
    },
  },
});

module.exports = mongoose.model("item", clothingItemSchema);