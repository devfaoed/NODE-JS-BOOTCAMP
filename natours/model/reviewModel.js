import mongoose from 'mongoose';

import Tour from './tourModel.js';

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
},
{
  toJSON:{virtuals: true},
  toObject:{virtuals: true},
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

// static function for calculating ratings and averageRtaings
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // using mongoose aggrigate function
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);
  if(stats.length > 0){
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  }else{
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function(next){
  this.r = await this.findOne();
  // console.log(this.r)
  next()
})

reviewSchema.post(/^findOneAnd/, async function() {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});
const Review = mongoose.model('Review', reviewSchema);

export default Review;
