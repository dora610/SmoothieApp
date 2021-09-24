const mongoose = require('mongoose');

const smoothieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: 'Smoothie name cannot be blank',
      trim: true,
      lowercase: true,
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
  },
  { timestamps: true }
);

smoothieSchema.pre('save', function (next) {
  if (this.ingredients.length === 0) {
    throw new Error('ingredient: Invalid: Ingredient items cannot be empty');
  }
  next();
});

module.exports = mongoose.model('Smoothie', smoothieSchema);
