const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const reviewschema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    max: 5,
    min: 1,
  },
  createdat: {
    type: Date,
    default: Date.now,
  },
});
const Review = new mongoose.model('Review', reviewschema);
module.exports = { Review };
