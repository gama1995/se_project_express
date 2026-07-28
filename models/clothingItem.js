const mongoose = require("mongoose");
const isValidUrl = require("../utils/isValidUrl");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: true,
    enum: ["hot", "warm", "cold"],
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return isValidUrl(value);
      },
      message: "Invalid image URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: [],
    },
  ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    clothingItemSchema: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "clothingItem",  
    }
});

module.exports = mongoose.model("item", clothingItemSchema);
