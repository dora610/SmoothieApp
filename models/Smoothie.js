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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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

smoothieSchema.pre('save', function (next) {
  console.log(this.ingredients);
  console.log(this.ingredients.length);
  // this.ingredients
  if (this.ingredients.length === 0) {
    throw new Error('ingredient: Invalid: Ingredient items cannot be empty');
  }
  next();
});

module.exports = mongoose.model('Smoothie', smoothieSchema);
