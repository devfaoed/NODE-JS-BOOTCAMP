import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'review cannot be empty'],
  },
  rating: {
    type: Number,
    required: [true, 'review must have a rating'],
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'review must belong to a tour'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'review must belong to a user'],
  },
});

// populating tours
reviewSchema.pre(/^find/, function (next) {
  // this.populate(
  // {
  //     path: "tour",
  //     select: "name"
  // }
  // ).populate({
  //             path: "user",
  //             select: "name photo -__v"
  //     })
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// populating user

const Review = mongoose.model('Review', reviewSchema);

export default Review;
