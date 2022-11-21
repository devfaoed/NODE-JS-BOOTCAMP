import mongoose from 'mongoose';
import validator from 'validator';
// import User from './userModel.js';
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'a tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'a tour name must not be greater than 50 characters'],
      minlength: [
        10,
        'a tour name must greater than or equals to 10 characters',
      ],
      // validate: [
      //   validator.isAlpha,
      //   'Name must contain only letters, no special character',
      // ],
    },
    duration: {
      type: Number,
      required: [true, 'a tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'a tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'a tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'minimum rating should be 1.0'],
      max: [5, 'maximum rating should be 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'a tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: function (val) {
        // this only points to current document
        return val < this.price;
      },
      message: 'discount price ({VALUE}) should be blow regular price',
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'a tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'a tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      // to hide something or data by not allowing it to be sent to the client we use select like the example below
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // using GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // for guides embedding
    // guides: Array,
    // for guildes referencing
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    reviews: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Review',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// mongoose vitual model properties
tourSchema.virtual('durationweeks').get(function () {
  return this.duration / 7;
});

// populating reviews throug virtua;
tourSchema.virtual('review', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// document middleware: run before .save() and .create()
// how to implement embedding user model into tour model
// here embedding all tour guilds from the user database
// tourSchema.pre("save", async function(next){
//   const tourGuides = this.guides.map(async id => await User.findById(id))
//     this.guides = await Promise.all(tourGuides)
//   next();
// })

// tourSchema.pre(/^find/, function (docs, next) {
//   this.find({ secretTour: { $ne: true } });

//   this.startDate = Date.now();
//   next();
// });

// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`query took ${Date.now() - this.startDates} milliseconds`);
//   next();
// });

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -date',
  });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
