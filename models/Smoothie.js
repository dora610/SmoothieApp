const mongoose = require('mongoose');

const smoothieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Smoothie title cannot be blank',
    trim: true,
    lowercase: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  ingredients: [
    {
      type: String,
      required: true,
      lowercase: true,
    },
  ],
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

module.exports = mongoose.model('Smoothie', smoothieSchema);
